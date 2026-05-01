const GHL_WEBHOOK =
  process.env.GHL_NEWSLETTER_WEBHOOK ||
  'https://services.leadconnectorhq.com/hooks/yrcYgS03BFe8fHYJOaTx/webhook-trigger/013f481f-3d30-44fa-81b9-c39b3617d3cc';

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

    const payload = {
      email: data.email,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      phone: data.phone || '',
      company: data.company || '',
      source: 'Lumyx newsletter page'
    };

    const ghlResponse = await fetch(GHL_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const ghlText = await ghlResponse.text();

    if (!ghlResponse.ok) {
      return {
        statusCode: 502,
        headers: jsonHeaders,
        body: JSON.stringify({
          error: 'GHL webhook rejected the request',
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
