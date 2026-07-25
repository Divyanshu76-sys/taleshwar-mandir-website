const { getStore } = require('@netlify/blobs');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Sirf POST allowed hai.' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const text = (body.text || '').trim();

    if (!text) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Suvichar text khali nahi ho sakta.' }) };
    }

    const store = getStore({ name: 'suvichar' });
    const record = {
      text,
      publishedAt: new Date().toISOString()
    };

    await store.setJSON('latest', record);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, record })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
