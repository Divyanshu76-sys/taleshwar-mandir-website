const crypto = require('crypto');

exports.handler = async function (event) {
  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server par Cloudinary environment variables set nahi hain.' })
      };
    }

    const timestamp = Math.round(Date.now() / 1000);

    // Params that will be signed. Must match exactly what the browser sends to Cloudinary.
    const paramsToSign = {
      timestamp: timestamp,
      folder: 'mandir-videos',
      tags: 'mandir-video'
    };

    // Build the string to sign, sorted alphabetically by key, per Cloudinary's spec.
    const sortedKeys = Object.keys(paramsToSign).sort();
    const stringToSign = sortedKeys
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join('&');

    const signature = crypto
      .createHash('sha1')
      .update(stringToSign + apiSecret)
      .digest('hex');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder: paramsToSign.folder,
        tags: paramsToSign.tags
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
