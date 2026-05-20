/**
 * GLOBAL MARKETPLACE LOGIC - KHOZA.IO
 * Client-side script fetches clean data from the secure Cloudflare Pages Function.
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

        // B. SESSION GREETING USING ETHERS LOCALLY
        // We resolve the tracking identity without making outside queries
        const wallet = new ethers.Wallet(userKey);
        if (headerStatus) {
            headerStatus.innerText = `Authorizing Session... | Node: ${wallet.address.substring(0, 8)}...`;
        }

        // C. FETCH PRODUCTS FROM SECURE PAGES FUNCTION
        const response = await fetch('/api/get-products');
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Backend verification drop.");
        }

        // D. UPDATE GREETING WITH COMPLETED CONTEXT
        if (headerStatus) {
            headerStatus.innerText = `Welcome back | Node: ${wallet.address.substring(0, 8)}...`;
        }

        // E. RENDER
        renderGallery(result.data);

    } catch (err) {
        console.error("Critical System Failure:", err);
        gallery.innerHTML = "<p style='color:red;'>CONNECTION TO LEDGER FAILED. REFRESHING...</p>";
    }
}

/**
 * 4. UI Rendering
 * Generates the HTML for the product cards safely.
 */
function renderGallery(products) {
    const gallery = document.getElementById('productGallery');
    if (!products || products.length === 0) {
        gallery.innerHTML = "<p>MARKETPLACE EMPTY: NO ACTIVE STOCK FOUND.</p>";
        return;
    }

    const localFallback = "301015489_443828151102927_1957794053294967618_n.png";

    gallery.innerHTML = products.map(p => {
        const hasImage = p.images && p.images.length > 0 && p.images[0] !== "";
        const displayImage = hasImage ? p.images[0] : localFallback;

        return `
            <div class="product-card">
                <div class="card-image">
                    <img src="${displayImage}" 
                         alt="${p.name}" 
                         onerror="this.src='${localFallback}'">
                </div>
                <div class="card-info">
                    <h3>${p.name}</h3>
                    <p class="price">R${Number(p.price).toLocaleString()}</p>
                    <p class="store-tag">CODE: ${p.code}</p>
                    <p class="meta">Available: ${p.stock} units</p>
                    <button onclick="openProduct(${p.id})">VIEW ITEM</button>
                </div>
            </div>
        `;
    }).join('');

    applyCardAnimations();
}

/**
 * 5. Navigation Logic
 * Bridges the shop to the individual product page.
 */
function openProduct(productId) {
    console.log("Routing to product node:", productId);
    localStorage.setItem("selected_product_id", productId);
    window.location.href = "product12.html";
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
                rotationY: x * 20,
                rotationX: -y * 20,
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

// Initialize on window load
window.onload = loadRandomMarketplace;