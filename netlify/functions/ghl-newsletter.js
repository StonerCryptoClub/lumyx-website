const GHL_CONTACTS_UPSERT_URL = 'https://services.leadconnectorhq.com/contacts/upsert';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'yrcYgS03BFe8fHYJOaTx';
const GHL_PRIVATE_INTEGRATION_TOKEN = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

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

    if (!data.email) {
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({ error: 'Email is required' })
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

    const payload = {
      locationId: GHL_LOCATION_ID,
      email: data.email,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      phone: data.phone || '',
      companyName: data.company || '',
      source: 'Lumyx newsletter page',
      tags: ['newsletter', 'website-lead']
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
          error: 'GHL contacts API rejected the request',
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
        error: 'Newsletter submission failed',
        details: error.message
      })
    };
  }
};
