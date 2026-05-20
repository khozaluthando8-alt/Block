/**
 * MARKETPLACE CORE LOGIC ENGINE (marketplace-logic.js)
 * Architecture: Mobile-first development workflow (No Node.js / No NPM)
 * Handles catalog synchronization, layout randomization, and single-item parameter filtering.
 */

// Global state container to avoid redundant network round-trips
let globalInventory = [];

/**
 * Fisher-Yates array shuffling algorithm
 * Randomizes order of array elements efficiently in place.
 */
function shuffleProducts(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

/**
 * Global Routing Link Handshake
 * Routes client frame target straight to the standalone product specification card.
 */
function openProduct(productId) {
    if (!productId) return;
    window.location.href = `product.html?id=${productId}`;
}

/**
 * DOM Template Component Generator
 * Emits clean HTML string structures using dynamic payload objects
 */
function createProductCard(product) {
    const displayImage = (product.images && product.images.length > 0) 
        ? product.images[0] 
        : 'https://via.placeholder.com/300?text=No+Image+Available';
        
    return `
        <article 
            onclick="openProduct('${product.id}')" 
            class="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
        >
            <div>
                <div class="aspect-square bg-gray-50 overflow-hidden relative border-b border-gray-50">
                    <img 
                        src="${displayImage}" 
                        alt="${product.name}" 
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    >
                </div>
                <div class="p-4">
                    <span class="text-xs font-mono text-gray-400 block mb-1">${product.code}</span>
                    <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">${product.name}</h3>
                </div>
            </div>
            <div class="p-4 pt-0 flex items-center justify-between mt-auto">
                <div class="flex flex-col">
                    <span class="text-xs text-gray-400 font-medium">Retail Price</span>
                    <span class="text-lg font-bold text-gray-900">R ${parseFloat(product.price).toFixed(2)}</span>
                </div>
                <span class="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-md">
                    ${product.stock} left
                </span>
            </div>
        </article>
    `;
}

/**
 * Orchestrator: Index Catalog Page Initialization
 */
async function initializeMarketplaceCatalog() {
    const gridEl = document.getElementById('marketplace-grid');
    const statusTextEl = document.getElementById('status-text');
    const statusContainerEl = document.getElementById('status-container');

    if (!gridEl) return; // Exit if not currently on the main index catalog view

    try {
        const response = await fetch('/api/products');
        const result = await response.json();

        if (!result.success || !result.data || result.data.length === 0) {
            statusTextEl.innerText = "No active stock found on the marketplace ledger matrix.";
            return;
        }

        globalInventory = result.data;
        const randomizedInventory = shuffleProducts([...globalInventory]);

        gridEl.innerHTML = randomizedInventory.map(createProductCard).join('');

        if (statusContainerEl) statusContainerEl.classList.add('hidden');
        gridEl.classList.remove('hidden');

    } catch (error) {
        console.error("Catalog Fetch Failure:", error);
        if (statusTextEl) {
            statusTextEl.innerText = "Network Error: Unable to sync with the marketplace api endpoint.";
            statusTextEl.classList.add('text-red-500');
        }
    }
}

/**
 * Orchestrator: Single Product Specification Page Initialization
 */
async function initializeProductDetails() {
    const containerEl = document.getElementById('product-container');
    const statusEl = document.getElementById('status-message');

    if (!containerEl) return; // Exit if not currently on the product.html view

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        if (statusEl) statusEl.innerText = "Error: Missing product routing parameters.";
        return;
    }

    try {
        const response = await fetch('/api/products');
        const result = await response.json();

        if (!result.success || !result.data) {
            throw new Error("Unable to extract valid inventory ledger array.");
        }

        const product = result.data.find(item => item.id === productId);

        if (!product) {
            if (statusEl) statusEl.innerText = "Error: Item could not be located in active inventory.";
            return;
        }

        // Bind data models directly to DOM view nodes
        document.getElementById('product-name').innerText = product.name;
        document.getElementById('product-code').innerText = `Item Code: ${product.code}`;
        document.getElementById('product-price').innerText = parseFloat(product.price).toFixed(2);
        document.getElementById('product-stock').innerText = product.stock;

        const mainImg = document.getElementById('main-image');
        const thumbGrid = document.getElementById('thumbnail-grid');

        if (product.images && product.images.length > 0) {
            mainImg.src = product.images[0];
            thumbGrid.innerHTML = ''; // Sanitize grid frame container

            product.images.forEach((imgUrl) => {
                const thumb = document.createElement('img');
                thumb.src = imgUrl;
                thumb.className = "w-full h-16 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity";
                thumb.addEventListener('click', () => mainImg.src = imgUrl);
                thumbGrid.appendChild(thumb);
            });
        } else {
            mainImg.src = 'https://via.placeholder.com/400?text=No+Image+Available';
        }

        if (statusEl) statusEl.classList.add('hidden');
        containerEl.classList.remove('hidden');

    } catch (err) {
        console.error(err);
        if (statusEl) statusEl.innerText = "Network Error: Failed to fetch item specifications.";
    }
}

// Router deployment hook binding execution contexts straight to window document frame cycles
document.addEventListener('DOMContentLoaded', () => {
    initializeMarketplaceCatalog();
    initializeProductDetails();
});