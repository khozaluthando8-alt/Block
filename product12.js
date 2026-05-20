 const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
        const CONTRACT2= 0xf22Af894a5377D66D8f7E9baFE65E5e5179A9866;
        const GATEWAY = "https://gateway.pinata.cloud/ipfs/";
        
        
        
        let currentPrice = 0;
        let currentIndex = 0;
        let totalImages = 0;
      import ABI from '/abi.js';
      
      
        const AI = [
            {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"products","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"admin","type":"address"},{"internalType":"string","name":"itemCode","type":"string"},{"internalType":"string","name":"itemName","type":"string"},{"internalType":"uint256","name":"retailPrice","type":"uint256"},{"internalType":"uint256","name":"stockPrice","type":"uint256"},{"internalType":"string","name":"colour","type":"string"},{"internalType":"uint256","name":"quantityAvailable","type":"uint256"},{"internalType":"uint256","name":"totalSold","type":"uint256"}],"stateMutability":"view","type":"function"},
            {"inputs":[{"internalType":"uint256","name":"_pId","type":"uint256"}],"name":"getProductImages","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"}
        ];

        async function loadDetails() {
            const display = document.getElementById('productDetail');
            const productId = localStorage.getItem("selected_product_id");

            if (!productId) {
                display.innerHTML = "<h2 style='text-align:center'>ERROR: NO_PRODUCT_ID</h2>";
                return;
            }

            try {
                const provider = new ethers.JsonRpcProvider(RPC_URL);
                const contract = new ethers.Contract(CONTRACT2, ABI, provider);

                const [p, rawImages] = await Promise.all([
                    contract.products(productId),
                    contract.getProductImages(productId)
                ]);

                currentPrice = Number(p.retailPrice);
                const images = rawImages.filter(img => img).map(img => img.startsWith('http') ? img : `${GATEWAY}${img}`);
                totalImages = images.length;

                display.innerHTML = `
                    <div class="product-grid">
                        <div class="slider-section">
                            <div class="slider-viewport">
                                <div class="slider-wrapper" id="sliderWrapper">
                                    ${totalImages > 0 
                                        ? images.map(src => `<div class="slider-item"><img src="${src}"></div>`).join('')
                                        : '<div class="slider-item">NO_BLOCK_ASSETS</div>'}
                                </div>
                            </div>
                            ${totalImages > 1 ? `
                            <div class="slider-nav">
                                <button class="nav-btn" onclick="moveSlider(-1)">PREV</button>
                                <span id="imgCounter" style="font-size:0.75rem;">${(currentIndex + 1)} / ${totalImages}</span>
                                <button class="nav-btn" onclick="moveSlider(1)">NEXT</button>
                            </div>` : ''}
                        </div>

                        <div class="product-info">
                            <p style="color:var(--accent-blue); font-size:0.65rem; margin:0">NODE_ID: ${p.itemCode}</p>
                            <h1 style="margin: 10px 0 20px 0; font-size: 2rem;">${p.itemName}</h1>
                            <div class="price-tag">R${currentPrice.toLocaleString()}</div>
                            
                            <div class="quote-box">
                                <label style="font-size:0.6rem; color:#666">SELECT_SIZE</label>
                                <select id="itemSize"><option>S</option><option>M</option><option>L</option><option>XL</option></select>
                                
                                <label style="font-size:0.6rem; color:#666">DISTRIBUTION_ZONE</label>
                                <select id="location" onchange="updateTotals()">
                                    <option value="Standard">Standard SA</option>
                                    <option value="Durban CBD">Durban CBD</option>
                                    <option value="Parlock">Parlock</option>
                                    <option value="Pinetown">Pinetown</option>
                                </select>

                                <label style="font-size:0.6rem; color:#666">UNIT_COUNT</label>
                                <input type="number" id="qtyInput" value="1" min="1" oninput="updateTotals()">

                                <div style="margin-top:20px; padding-top:15px; border-top:1px solid var(--glass-border)">
                                    <div style="display:flex; justify-content:space-between; font-size:0.8rem"><span>Shipping:</span><span id="shipFee">R 0.00</span></div>
                                    <div style="display:flex; justify-content:space-between; font-weight:bold; margin-top:8px; font-size:1.1rem"><span>ORDER_TOTAL:</span><span id="finalTotal">R 0.00</span></div>
                                </div>
                            </div>

                            <button class="buy-button" style="margin-top:25px" onclick="handleAddToCart('${productId}', '${p.itemName}', '${images[0] || ''}')">
                                ADD_TO_SESSION
                            </button>
                        </div>
                    </div> 
                `;
                updateTotals();
                updateBadge();
                document.getElementById('connectionStatus').innerText = "ASSET_READY: " + p.itemName;
            } catch (err) {
                document.getElementById('connectionStatus').innerText = "SYNC_FAILED: LEDGER_UNREACHABLE";
            }
        }

        function moveSlider(dir) {
            currentIndex = (currentIndex + dir + totalImages) % totalImages;
            gsap.to("#sliderWrapper", { xPercent: -100 * currentIndex, duration: 0.5, ease: "power2.out" });
            document.getElementById('imgCounter').innerText = `${currentIndex + 1} / ${totalImages}`;
        }

        function updateTotals() {
            const qty = parseInt(document.getElementById('qtyInput').value) || 1;
            const loc = document.getElementById('location').value;
            const rates = { "Durban CBD": [40, 60, 100, 180], "Parlock": [50, 70, 110, 190], "Pinetown": [70, 100, 170, 230], "Standard": [60, 100, 180, 240] };
            const selected = rates[loc] || rates["Standard"];
            
            let ship = selected[0];
            if (qty > 4) ship = selected[1];
            if (qty > 10) ship = selected[2];
            if (qty > 20) ship = selected[3];

            document.getElementById('shipFee').innerText = `R ${ship.toLocaleString()}`;
            document.getElementById('finalTotal').innerText = `R ${(currentPrice * qty + ship).toLocaleString()}`;
            return { ship, total: (currentPrice * qty + ship) };
        }

        function handleAddToCart(id, name, img) {
            const qty = parseInt(document.getElementById('qtyInput').value);
            const variant = document.getElementById('itemSize').value;
            const calculations = updateTotals();

            const item = {
                id, name, price: currentPrice, image: img, quantity: qty,
                location: `${document.getElementById('location').value} (${variant})`,
                shipping: calculations.ship,
                itemTotal: calculations.total
            };

            if (typeof addToCart === 'function') {
                addToCart(item);
                updateBadge();
            }
        }

        function updateBadge() {
            const cart = JSON.parse(localStorage.getItem('khoza_cart') || "[]");
            document.getElementById('cartCount').innerText = cart.reduce((s, i) => s + i.quantity, 0);
        }

        window.onload = loadDetails;