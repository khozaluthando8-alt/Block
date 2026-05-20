 function renderCartPage() {
            const cart = getCart(); 
            const display = document.getElementById('cartDisplay');
            const totalsDisplay = document.getElementById('cartTotals');
            
            if (cart.length === 0) {
                display.innerHTML = "<p style='text-align:center; color:#888;'>Your node cart is empty.</p>";
                totalsDisplay.innerHTML = "";
                return;
            }

            let totalItemsPrice = 0;
            let totalQty = 0;
            let primaryLocation = cart[0].location || "Standard";

            display.innerHTML = cart.map((item, index) => {
                const itemSubtotal = item.price * item.quantity;
                totalItemsPrice += itemSubtotal;
                totalQty += item.quantity;

                return `
                    <div class="cart-item">
                        <img src="${item.image}">
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>Qty: ${item.quantity} | ${item.variant}</p>
                            <p style="font-weight:bold; color:var(--text-main)">R${itemSubtotal.toLocaleString()}</p>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${index}); renderCartPage();">Remove</button>
                    </div>
                `;
            }).join('');

            // Consolidating Logistics Rate calculation
            const rates = { 
                "Durban CBD": [40, 60, 100, 180], 
                "Parlock": [50, 70, 110, 190], 
                "Pinetown": [70, 100, 170, 230], 
                "Standard": [60, 100, 180, 240] 
            };
            
            const s = rates[primaryLocation] || rates["Standard"];
            let deliveryFee = s[0];
            if (totalQty > 4) deliveryFee = s[1];
            if (totalQty > 10) deliveryFee = s[2];
            if (totalQty > 20) deliveryFee = s[3];

            const finalTotal = totalItemsPrice + deliveryFee;

            totalsDisplay.innerHTML = `
                <div style="font-size:0.85rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>Subtotal (${totalQty} units):</span><span>R${totalItemsPrice.toLocaleString()}</span></div>
                    <div style="display:flex; justify-content:space-between; color:var(--accent-blue); font-weight:bold;">
                        <span>Logistics (${primaryLocation}):</span>
                        <span>R${deliveryFee.toLocaleString()}</span>
                    </div>
                    <hr style="border:0; border-top:1px solid #ddd; margin:10px 0;">
                    <div style="display:flex; justify-content:space-between; font-size:1.3rem; font-weight:bold; color:#1e7e34;">
                        <span>GRAND TOTAL:</span><span>R${finalTotal.toLocaleString()}</span>
                    </div>
                </div>
            `;
        }

        window.onload = () => {
            renderCartPage();
        };