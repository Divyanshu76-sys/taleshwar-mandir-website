exports.handler = async function () {
  try {
    const apiKey = process.env.geminikey;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server par geminikey set nahi hai.' })
      };
    }

    const prompt =
      'Ek chota, prernadayak Hindi "suvichar" (thought of the day) likho jo Shri Taleshwar Mahadev Mandir ki website par lagaya jayega. ' +
      'Ye Bhagwan Shiv, bhakti, dharm, ya jeevan mulyon se juda ho sakta hai. ' +
      '2-3 vaakya se zyada lamba na ho. Sirf Devanagari Hindi mein likho. ' +
      'Sirf suvichar ka text do, koi prastavna ya quotation marks nahi, koi extra comment nahi.';

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Gemini API se error aaya.', details: errText })
      };
    }

    const data = await response.json();
    const text =
      (data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text) ||
      '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestion: text.trim() })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
