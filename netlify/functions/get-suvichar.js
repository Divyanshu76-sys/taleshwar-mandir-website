const { getStore } = require('@netlify/blobs');

exports.handler = async function () {
  try {
    const store = getStore({ name: 'suvichar' });
    const record = await store.get('latest', { type: 'json' });

    if (!record) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: null })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
