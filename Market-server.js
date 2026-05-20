// functions/api/get-products.js

// Import Ethers cleanly via CDN for zero-node, instant deployment architectures
import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.5/ethers.js';

// Fully expanded ABI to mirror your contract's structural data requirements
const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "productCount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "products",
        "outputs": [
            { "internalType": "uint256", "name": "id", "type": "uint256" },
            { "internalType": "address", "name": "admin", "type": "address" },
            { "internalType": "string", "name": "itemCode", "type": "string" },
            { "internalType": "string", "name": "itemName", "type": "string" },
            { "internalType": "uint256", "name": "retailPrice", "type": "uint256" },
            { "internalType": "uint256", "name": "stockPrice", "type": "uint256" },
            { "internalType": "string", "name": "colour", "type": "string" },
            { "internalType": "uint256", "name": "quantityAvailable", "type": "uint256" },
            { "internalType": "uint256", "name": "totalSold", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_pId", "type": "uint256" }],
        "name": "getProductImages",
        "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }],
        "stateMutability": "view",
        "type": "function"
    }
];

export async function onRequestGet(context) {
    try {
        // 1. Grab environment connections safely out of Cloudflare's injected secret context
        const rpcProviderUrl = context.env.RPC_PROVIDER_URL;
        const contractAddress = context.env.CONTRACT_ADDRESS;
        
        // These are available securely if needed for authorization or write operations
        const privateKey = context.env.PRIVATE_KEY;
        const pinataJwt = context.env.PINATA_JWT;

        if (!rpcProviderUrl || !contractAddress) {
            return new Response(JSON.stringify({ error: "Cloudflare Environment Variables are unconfigured." }), {
                status: 500, 
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Open data connection to the blockchain node matrix
        const provider = new ethers.JsonRpcProvider(rpcProviderUrl);
        const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

        // 3. Collect total product tracking indexes
        const countBigInt = await contract.productCount();
        const count = Number(countBigInt);
        let allProducts = [];

        // 4. Gather data items linearly
        for (let i = 1; i <= count; i++) {
            const p = await contract.products(i);
            const images = await contract.getProductImages(i);
            
            // Only aggregate items with active stock quantities
            if (Number(p.quantityAvailable) > 0) {
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

        // 5. Fisher-Yates Randomization Mix
        for (let i = allProducts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
        }

        // 6. Stream the polished inventory array back to browser container
        return new Response(JSON.stringify({ success: true, data: allProducts }), {
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message || "Failed to parse decentralized ledger catalog." }), {
            status: 400, 
            headers: { 'Content-Type': 'application/json' }
        });
    }
}