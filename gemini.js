exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the data sent from your website's frontend
    const { model, systemInstruction, contents, generationConfig } = JSON.parse(event.body);

    // Use the secret environment variable for the API key
    const apiKey = process.env.GEMINI_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_KEY is not set in Netlify environment variables.' }) };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Forward the request to Google Gemini
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction, contents, generationConfig })
    });

    const data = await res.text();

    // Send the response back to your website
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
  } catch (e) {
    // Handle any unexpected errors
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};