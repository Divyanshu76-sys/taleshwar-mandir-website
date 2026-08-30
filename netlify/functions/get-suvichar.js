const { getStore } = require('@netlify/blobs');

exports.handler = async function () {
  try {
    
    const store = getStore({
  name: 'suvichar',
  siteID: process.env.BLOBS_SITE_ID,
  token: process.env.BLOBS_TOKEN
});
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
