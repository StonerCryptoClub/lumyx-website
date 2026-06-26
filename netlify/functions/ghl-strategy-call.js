const GHL_CONTACTS_UPSERT_URL = 'https://services.leadconnectorhq.com/contacts/upsert';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'yrcYgS03BFe8fHYJOaTx';
const GHL_PRIVATE_INTEGRATION_TOKEN = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() || '',
    lastName: parts.join(' ')
  };
}

function serviceTag(service) {
  return String(service || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: jsonHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    if (!data.name || !data.email || !data.phone || !data.business || !data.service) {
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({ error: 'Name, email, phone, business, and service are required' })
      };
    }

    if (!GHL_PRIVATE_INTEGRATION_TOKEN) {
      return {
        statusCode: 500,
        headers: jsonHeaders,
        body: JSON.stringify({
          error: 'GHL private integration token is not configured',
          details: 'Set GHL_PRIVATE_INTEGRATION_TOKEN in Netlify environment variables.'
        })
      };
    }

    const { firstName, lastName } = splitName(data.name);
    const normalizedServiceTag = serviceTag(data.service);
    const isTrue = (v) => v === true || v === 'true' || v === 'yes';
    const marketingIn = isTrue(data.smsMarketing);
    const transactionalIn = isTrue(data.smsTransactional);
    const anyConsent = marketingIn || transactionalIn || isTrue(data.smsConsent);

    const attribution = (data.attribution && typeof data.attribution === 'object') ? data.attribution : {};
    const slug = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const channel = slug(attribution.channel) || 'direct';

    const tags = ['strategy-call', 'website-lead'];
    if (normalizedServiceTag) tags.push(`service-${normalizedServiceTag}`);
    tags.push(anyConsent ? 'opted-in' : 'opted-out');
    if (marketingIn) tags.push('marketing-opted-in');
    tags.push(`source-${channel}`);

    const utmBits = [];
    if (attribution.utm_source) utmBits.push(`src:${attribution.utm_source}`);
    if (attribution.utm_medium) utmBits.push(`med:${attribution.utm_medium}`);
    if (attribution.utm_campaign) utmBits.push(`camp:${attribution.utm_campaign}`);
    if (attribution.utm_content) utmBits.push(`content:${attribution.utm_content}`);
    if (attribution.utm_term) utmBits.push(`term:${attribution.utm_term}`);
    const attributionSummary = utmBits.length ? ` | ${utmBits.join(' ')}` : '';

    const payload = {
      locationId: GHL_LOCATION_ID,
      name: data.name,
      firstName,
      lastName,
      email: data.email,
      phone: data.phone,
      companyName: data.business,
      source: `Lumyx strategy call form - ${data.service}${attributionSummary}`,
      tags
    };

    const ghlResponse = await fetch(GHL_CONTACTS_UPSERT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GHL_PRIVATE_INTEGRATION_TOKEN}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const ghlText = await ghlResponse.text();

    if (!ghlResponse.ok) {
      return {
        statusCode: 502,
        headers: jsonHeaders,
        body: JSON.stringify({
          error: 'GHL contacts API rejected the strategy call request',
          status: ghlResponse.status,
          details: ghlText
        })
      };
    }

    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({
        error: 'Strategy call submission failed',
        details: error.message
      })
    };
  }
};
