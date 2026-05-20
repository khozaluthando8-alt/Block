// api/secure-api.js

export default async function handler(request) {
  // 1. Read the private key securely from Vercel's backend environment
  const privateKey = process.env.MY_PRIVATE_KEY;

  if (!privateKey) {
    return new Response(
      JSON.stringify({ error: "Private key configuration missing on server." }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Only allow POST requests (good practice for submitting data)
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }), 
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 3. Parse data sent from your frontend HTML page
    const requestData = await request.json();
    
    // --- YOUR SECURE LOGIC HERE ---
    // Example: Use the private key to sign data or interact with a ledger.
    // ------------------------------

    // 4. Return ONLY safe data back to the frontend browser
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Operation completed on Vercel without exposing the key!" 
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}