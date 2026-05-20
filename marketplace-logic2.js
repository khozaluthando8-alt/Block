/**
 * GLOBAL MARKETPLACE LOGIC - Updated for chw18.sol
 * Fetches all products from the Blockchain and displays them with Categories.
 */

const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const CONTRACT_ADDRESS = "0x94C20E1399bC29CF7263da085Adf7e1DF1d12258";

// 2. Updated ABI to match chw18.sol Product Struct
const ABI = [
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
            {"internalType": "string", "name": "colour", "type": "string"}, // Acts as description
            {"internalType": "uint256", "name": "quantityAvailable", "type": "uint256"},
            {"internalType": "uint256", "name": "totalSold", "type": "uint256"},
            {"internalType": "string[]", "name": "size", "type": "string[]"}, // New in chw18.sol
            {"internalType": "string", "name": "category", "type": "string"}   // New in chw18.sol
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {"inputs": [], "name": "productCount", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}
];

/**
 * 3. Fetch and Render
 */


/ 1. DYNAMIC SESSION RETRIEVAL
// This looks for the key saved in customer-register3.html or login.html


  

/**
 * GLOBAL MARKETPLACE LOGIC - KHOZA.IO
 * Fetches all products from the Blockchain and displays them randomly.
 */


  async function loadRandomMarketplace() {
    const gallery = document.getElementById('productGallery');
    const headerStatus = document.querySelector('.shop-header p');

    try {
        // A. SESSION VERIFICATION
        const userKey = localStorage.getItem("user_session_key");
        if (!userKey) {
            gallery.innerHTML = "<div style='text-align:center; padding: 50px;'><p>UNAUTHORIZED ACCESS</p><button onclick='window.location.href=\"register5.html\"'>REGISTER IDENTITY</button></div>";
            return;
        }

        // B. ETHERS SETUP
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(userKey, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        // C. CUSTOMER GREETING
        const profile = await contract.customers(wallet.address);
        if (headerStatus && profile.exists) {
            headerStatus.innerText = `Welcome back, ${profile.firstName} | Node: ${wallet.address.substring(0, 8)}...`;
        }

        // D. DATA HARVESTING
      // D. DATA HARVESTING - Updated to fetch images separately
        const count = await contract.productCount(); 
        let allProducts = [];

        for (let i = 1; i <= count; i++) {
            // Fetch product basic info
            const p = await contract.products(i);
            
            // Fetch images using the dedicated getter in your ABI
            const images = await contract.getProductImages(i);
            
            // Only show active stock
            if (p.quantityAvailable > 0) {
                allProducts.push({
                    id: p.id.toString(),
                    name: p.itemName,
                    code: p.itemCode,
                    price: p.retailPrice.toString(),
                    stockPrice: p.stockPrice.toString(),
                    // Assign the fetched image array here
                    images: images, 
                    stock: p.quantityAvailable.toString()
                });
            }
        }
        // E. RANDOMIZATION (Fisher-Yates)
        for (let i = allProducts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
        }

        // F. RENDER
        renderGallery(allProducts);

    } catch (err) {
        console.error("Critical System Failure:", err);
        gallery.innerHTML = "<p style='color:red;'>CONNECTION TO LEDGER FAILED. REFRESHING...</p>";
    }
}

/**
 * 4. UI Rendering
 * Generates the HTML for the product cards.
 */
/**
 * 4. UI Rendering
 * Updated with safety check for images to prevent 'undefined (reading 0)' error.
 */
function renderGallery(products) {
    const gallery = document.getElementById('productGallery');
    if (products.length === 0) {
        gallery.innerHTML = "<p>MARKETPLACE EMPTY: NO ACTIVE STOCK FOUND.</p>";
        return;
    }

    // Use your local logo file as the reliable fallback
    const localFallback = "301015489_443828151102927_1957794053294967618_n.png";

    gallery.innerHTML = products.map(p => {
        // Check if images exist and the first URL is not an empty string
        const hasImage = p.images && p.images.length > 0 && p.images[0] !== "";
        const displayImage = hasImage ? p.images[0] : localFallback;

        return `
            <  <div class="category-tag">${p.category || 'General'}</div>
                <img src="placeholder.jpg" id="img-${p.id}" alt="${p.itemName}">
                <div class="product-info">
                    <h4>${p.itemName}</h4>
                    <p class="price">R${ethers.formatUnits(p.retailPrice, 18)}</p>
                    <p class="stock-status">${p.quantityAvailable > 0 ? 'INSTOCK' : 'OUT OF STOCK'}</p>
                    <button onclick="openProduct(${p.id})">VIEW PRODUCT</button>
                </div>
        `;
    }).join('');

    // Re-initialize GSAP tilt effects for the new cards[cite: 8]
    applyCardAnimations();
}

/**
 * 6. UI Animations
 * Applies GSAP tilt effects to product cards after they are rendered.
 */
function applyCardAnimations() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (clientX - left) / width - 0.5;
            const y = (clientY - top) / height - 0.5;

            gsap.to(card, {
                rotationY: x * 20, // Tilt left/right
                rotationX: -y * 20, // Tilt up/down
                ease: "power2.out",
                duration: 0.4
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { 
                rotationX: 0, 
                rotationY: 0, 
                ease: "power2.out" 
            });
        });
    });
}
/**
 * 5. Navigation Logic
 * Bridges the shop to the individual product page.
 */
function openProduct(productId) {
    console.log("Routing to product node:", productId);
    localStorage.setItem("selected_product_id", productId);
    window.location.href = "product14.html";
}

// Initialize on window load
window.onload = loadRandomMarketplace;