// netlify/functions/secure-api.js

exports.handler = async function (event, context) {
  // 1. Read the private key securely from Netlify's backend environment
  const privateKey = process.env.MY_PRIVATE_KEY;

  if (!privateKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Private key configuration missing on server." }),
    };
  }

  try {
    // 2. Parse any data sent from your frontend HTML page
    const requestData = JSON.parse(event.body || "{}");
    
    // --- YOUR SECURE LOGIC HERE ---
    // Example: Use the private key to sign data, verify a signature, 
    // or interact with a blockchain provider using a CDN library.
    // ------------------------------

    // 3. Return ONLY the safe result back to the frontend
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        success: true, 
        message: "Operation completed securely without exposing the key!" 
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};