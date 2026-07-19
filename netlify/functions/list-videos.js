exports.handler = async function () {
  try {
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiKey || !apiSecret || !cloudName) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server par Cloudinary environment variables set nahi hain.' })
      };
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/tags/mandir-video?max_results=100&context=true`;

    const response = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` }
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Cloudinary se videos nahi mil paaye.', details: errText })
      };
    }

    const data = await response.json();

    const videos = (data.resources || [])
      .map((r) => ({
        publicId: r.public_id,
        url: r.secure_url,
        thumbnail: r.secure_url.replace(/\.[a-zA-Z0-9]+$/, '.jpg'),
        title: (r.context && r.context.custom && r.context.custom.title) || r.public_id.split('/').pop(),
        createdAt: r.created_at
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
