/**
 * CLOUDFLARE WORKER BACKEND COMPONENT
 * Handles secure, lightning-fast edge queries to your smart contract.
 */

// ABI Configuration for fetching products
const ABI = [
  {
    "inputs": [],
    "name": "productCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "products",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "admin", "type": "address"},
      {"internalType": "string", "name": "itemCode", "type": "string"},
      {"internalType": "string", "name": "itemName", "type": "string"},
      {"internalType": "uint256", "name": "retailPrice", "type": "uint256"},
      {"internalType": "uint256", "name": "stockPrice", "type": "uint256"},
      {"internalType": "string", "name": "colour", "type": "string"},
      {"internalType": "uint256", "name": "quantityAvailable", "type": "uint256"},
      {"internalType": "uint256", "name": "totalSold", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_pId", "type": "uint256"}],
    "name": "getProductImages",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export default {
  async fetch(request, env, ctx) {
    // Dynamic CDN imports are standard practice inside Cloudflare module workers 
    const { ethers } = await import('https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.5/ethers.js');

    // CORS Headers to ensure your web client can speak to this endpoint safely
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Pull variables explicitly from Cloudflare's passed env bindings
      const rpcProviderUrl = env.RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
      const contractAddress = env.CONTRACT_ADDRESS || "0xf22Af894a5377D66D8f7E9baFE65E5e5179A9866";

      const provider = new ethers.JsonRpcProvider(rpcProviderUrl);
      const contract = new ethers.Contract(contractAddress, ABI, provider);

      const count = await contract.productCount();
      let allProducts = [];

      for (let i = 1; i <= count; i++) {
        const p = await contract.products(i);
        const images = await contract.getProductImages(i);

        if (p.quantityAvailable > 0) {
          allProducts.push({
            id: p.id.toString(),
            name: p.itemName,
            code: p.itemCode,
            price: p.retailPrice.toString(),
            stockPrice: p.stockPrice.toString(),
            images: images,
            stock: p.quantityAvailable.toString()
          });
        }
      }

      // Randomization processing (Fisher-Yates)
      for (let i = allProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
      }

      return new Response(JSON.stringify({ success: true, data: allProducts }), {
        status: 200,
        headers: corsHeaders
      });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};