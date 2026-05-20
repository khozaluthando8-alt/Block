// functions/api/get-products.js

// Import Ethers cleanly via CDN for zero-node, instant deployment architectures
import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.5/ethers.js';

const CONTRACT_ABI = [
    "function getAllProducts() public view returns (tuple(uint256 id, string name, string description, uint256 price, string imageUrl, uint256 stock, bool isActive)[])"
];

export async function onRequestGet(context) {
    try {
        // 1. Grab environment connections safely out of Cloudflare's injected context
        const rpcProviderUrl = context.env.RPC_PROVIDER_URL;
        const contractAddress = context.env.CONTRACT_ADDRESS;

        if (!rpcProviderUrl || !contractAddress) {
            return new Response(JSON.stringify({ error: "Cloudflare Environment Variables are unconfigured." }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Open an anonymous data connection to the blockchain node matrix
        const provider = new ethers.JsonRpcProvider(rpcProviderUrl);
        const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

        // 3. Request the inventory dataset array from the ledger view function
        const rawProducts = await contract.getAllProducts();

        // 4. Map BigInt ledger structures cleanly into frontend-friendly JSON primitives
        const formattedProducts = rawProducts.map(p => ({
            id: Number(p.id),
            name: p.name,
            description: p.description,
            price: ethers.formatEther(p.price), // Converts base unit Wei to clean decimal string (e.g. 0.05)
            imageUrl: p.imageUrl,
            stock: Number(p.stock)
        }));

        // 5. Stream the polished inventory array straight back to the user's browser canvas
        return new Response(JSON.stringify({ success: true, data: formattedProducts }), {
            status: 200, headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message || "Failed to parse decentralized ledger catalog." }), {
            status: 400, headers: { 'Content-Type': 'application/json' }
        });
    }
}