function preparePayFastAndSubmit() {
    const cart = getCart(); // Your existing helper to get cart from localStorage
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // 1. Calculate Total (Matching your delivery logic)
    let totalItemsPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 2. Determine Delivery (Using your location logic)
    const primaryLocation = cart[0].location || "Standard";
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Reuse your rates from cart2.html
    const rates = { "Durban CBD": 40, "Parlock": 50, "Pinetown": 70, "Standard": 60 };
    const deliveryFee = rates[primaryLocation] || rates["Standard"];
    
    const finalAmount = totalItemsPrice + deliveryFee;

    // 3. Generate a Reference (Using your existing generator)
    const orderRef = generateOrderRef(); 

    // 4. Inject into PayFast Form
    document.getElementById('pf-amount').value = finalAmount.toFixed(2);
    document.getElementById('pf-item-name').value = `KHOZA Order: ${orderRef}`;
    document.getElementById('pf-payment-id').value = orderRef;

    // 5. Submit the form to PayFast
    console.log(`Redirecting to PayFast: R${finalAmount} for ${orderRef}`);
    document.getElementById('payfast-form').submit();
}

function togglePaymentUI() {
    const method = document.querySelector('input[name="payMethod"]:checked').value;
    const pfContainer = document.getElementById('payfast-container');
    const codContainer = document.getElementById('cod-container');

    if (method === 'cod') {
        pfContainer.style.display = 'none';
        codContainer.style.display = 'block';
    } else {
        pfContainer.style.display = 'block';
        codContainer.style.display = 'none';
    }
}

async function processCODOrder() {
    const cart = getCart();
    if (cart.length === 0) return;

    const confirmAction = confirm("Confirm your Order? You will pay in cash upon delivery.");
    if (!confirmAction) return;

    try {
        // 1. Auto-generate the unique reference
        const orderRef = generateOrderRef(); 
        
        // 2. Show loading state on the button
        const codBtn = document.querySelector('#cod-container .buy-button');
        codBtn.innerText = "SYNCING TO NETWORK...";
        codBtn.disabled = true;

        // 3. Sync to Blockchain (calling your existing bulk order function)
        // We pass the orderRef so the contract logs it
        await processBulkOrder(orderRef); 

        // 4. Display the Success UI with the reference number
        displayOrderSuccess(orderRef);

        // 5. Clear the cart so they don't double-order
        clearCart();

    } catch (error) {
        console.error("Order Sync Failed:", error);
        alert("Transaction failed. Please check your connection and try again.");
        
        // Reset button if it fails
        const codBtn = document.querySelector('#cod-container .buy-button');
        codBtn.innerText = "CONFIRM CASH ON DELIVERY";
        codBtn.disabled = false;
    }
}

function displayOrderSuccess(ref) {
    const display = document.getElementById('cartDisplay');
    const totalsArea = document.getElementById('cartTotals');
    const paymentPanel = document.querySelector('.glass-panel:last-of-type'); // Selects the payment selector panel

    // Create a high-visibility success screen
    const successHTML = `
        <div class="success-screen" style="text-align:center; padding:40px 20px; background: white; border-radius:15px; border: 2px solid #28a745;">
            <div style="font-size: 50px; color: #28a745; margin-bottom: 20px;">✓</div>
            <h2 style="color: #333; margin-bottom: 10px;">ORDER PLACED!</h2>
            <p style="color: #666; font-size: 0.9rem;">Your Cash on Delivery order is being processed.</p>
            
            <div style="margin: 25px 0; padding: 20px; background: #f8fbff; border: 1px dashed #007bff; border-radius: 10px;">
                <span style="display:block; font-size: 0.7rem; color: #007bff; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">Tracking Reference</span>
                <h1 style="letter-spacing: 4px; color: #222; margin: 0; font-family: monospace;">${ref}</h1>
            </div>

            <p style="font-size: 0.8rem; color: #888; margin-bottom: 20px;">
                Please keep this reference for your delivery driver. 
                A copy has been logged to the KHOZA Network.
            </p>
            
            <button onclick="window.print()" class="secondary-btn" style="width:100%; margin-bottom:10px;">PRINT RECEIPT</button>
            <a href="shop.html" class="primary-btn" style="display:block; text-decoration:none; text-align:center; background:#007bff; color:white; padding:15px; border-radius:10px;">CONTINUE SHOPPING</a>
        </div>
    `;

    // Replace the items list and hide the checkout math
    if(display) display.innerHTML = successHTML;
    if(totalsArea) totalsArea.style.display = "none";
    if(paymentPanel) paymentPanel.style.display = "none";
}


// 1. UNIQUE REFERENCE GENERATOR[cite: 10]
// Combines prefix, random entropy, and timestamp
function generateOrderRef() {
    const prefix = "KHZ";
    const random = Math.floor(1000 + Math.random() * 9000); 
    const timestamp = Date.now().toString().slice(-4); 
    return `${prefix}-${random}-${timestamp}`;
}

// 2. RENDER CART PAGE
function renderCartPage() {
    const cart = getCart(); // From cart-logic_4.js
    const display = document.getElementById('cartDisplay');
    const totalsDisplay = document.getElementById('cartTotals');
    
    if (!display) return;

    if (cart.length === 0) {
        display.innerHTML = "<p style='text-align:center; color:#888;'>Your node cart is empty.</p>";
        if(totalsDisplay) totalsDisplay.innerHTML = "";
        return;
    }

    let totalItemsPrice = 0;
    let totalQty = 0;
    let primaryLocation = cart[0].location || "Standard";

    display.innerHTML = cart.map((item, index) => {
        const itemSubtotal = (item.price || 0) * (item.quantity || 1);
        totalItemsPrice += itemSubtotal;
        totalQty += item.quantity;

        return `
            <div class="cart-item">
                <img src="${item.image}" alt="item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity} | ${item.variant || 'Standard'}</p>
                    <p style="font-weight:bold; color:var(--text-main)">R${itemSubtotal.toLocaleString()}</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index}); renderCartPage();">Remove</button>
            </div>
        `;
    }).join('');

    // Logistics Rate Calculation[cite: 13]
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

    if(totalsDisplay) {
        totalsDisplay.innerHTML = `
            <div style="font-size:0.85rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>Subtotal:</span><span>R${totalItemsPrice.toLocaleString()}</span></div>
                <div style="display:flex; justify-content:space-between; color:var(--accent-blue); font-weight:bold;">
                    <span>Logistics (${primaryLocation}):</span><span>R${deliveryFee.toLocaleString()}</span>
                </div>
                <hr style="border:0; border-top:1px solid #ddd; margin:10px 0;">
                <div style="display:flex; justify-content:space-between; font-size:1.3rem; font-weight:bold; color:#1e7e34;">
                    <span>GRAND TOTAL:</span><span>R${finalTotal.toLocaleString()}</span>
                </div>
            </div>
        `;
    }
}

/**async function processBulkOrder() {
    //const addressInput = document.getElementById('deliveryAddress').value;
    //if (!addressInput) return alert("Please enter a delivery address.");

    const cart = getCart(); //[cite: 15]
    if (cart.length === 0) return alert("Cart is empty");

    const orderRef = generateOrderRef(); //[cite: 10]
    const btn = document.querySelector(".buy-button");

    try {
        btn.disabled = true;
        btn.innerText = "UPLOADING TO LEDGER...";

        for (let item of cart) {
            // Format Description: "Size: XL | Colour: Black"[cite: 16]
            const description = `Size: ${item.variant || 'N/A'} | Colour: ${item.colour || 'Standard'}`;
            
            // Execute with new parameters[cite: 16]
            const tx = await contract.placeOrder(
                item.id, 
                item.quantity, 
                orderRef, 
                description, 
                //addressInput
            );
            await tx.wait();
        }

        // Show detailed success UI
        document.getElementById('cartDisplay').innerHTML = `
            <div class="glass-panel" style="text-align:center; border:2px solid var(--accent-blue);">
                <h2 style="color:var(--accent-blue);">ORDER SUCCESSFUL</h2>
                <p>Reference: <strong>${orderRef}</strong></p>
                <p style="font-size:0.7rem; margin-top:15px;">A delivery agent will contact you shortly.</p>
            </div>
        `;

         // Show detailed success UI
        document.getElementById('cartDisplay').innerHTML = `
            <div class="glass-panel" style="text-align:center; border:2px solid var(--accent-blue);">
                <h2 style="color:var(--accent-blue);">ORDER SUCCESSFUL</h2>
                <p>Reference: <strong>${orderRef}</strong></p>
                <p>Delivery to: ${addressInput}</p>
                <p style="font-size:0.7rem; margin-top:15px;">A delivery agent will contact you shortly.</p>
            </div>
        `;

        clearCart(); //[cite: 15]
        if(document.getElementById('cartTotals')) document.getElementById('cartTotals').style.display = 'none';
        btn.style.display = 'none';

    } catch (error) {
        btn.disabled = false;
        btn.innerText = "EXECUTE BULK ORDER";
        console.error("Checkout Error:", error);
    }
}

**/

/**
 * KHOZA.IO - UPDATED CART.JS
 * Action: Pure Reference Generation & UI Checkout
 */

//const KHOZA_CART_KEY = "khoza_cart";


// 3. EXECUTE CHECKOUT[cite: 10, 14]
function processBulkOrder() {
    const cart = getCart(); //[cite: 15]
    if (cart.length === 0) return alert("Cart is empty");

    const orderRef = generateOrderRef(); // Generate the one-time ID[cite: 10]

    // Update UI to show reference to customer immediately
    const display = document.getElementById('cartDisplay');
    const totalsArea = document.getElementById('cartTotals');
    const checkoutBtn = document.querySelector(".buy-button");

    display.innerHTML = `
        <div class="glass-panel" style="text-align:center; padding:30px; border:2px solid var(--accent-blue); background: white;">
            <h2 style="color:var(--accent-blue); margin-bottom:10px;">ORDER SUCCESSFUL</h2>
            <p style="font-size:0.9rem; color:#666;">Please provide this Reference Number for tracking:</p>
            <h1 style="letter-spacing:3px; color:#333; margin:20px 0; padding:15px; background:#f8fbff; border-radius:10px; border:1px dashed var(--accent-blue);">
                ${orderRef}
            </h1>
            <p style="font-size:0.8rem; color:#888;">Order logged in KHOZA Logistics Network [Durban/Pinetown]</p>
            <button class="buy-button" onclick="window.print()" style="background:#6c757d; margin-top:10px;">PRINT RECEIPT</button>
        </div>
    `;

    // Hide totals and original checkout button after completion
    if(totalsArea) totalsArea.style.display = "none";
    if(checkoutBtn) checkoutBtn.style.display = "none";

    // Clear cart to prevent reuse or regeneration on refresh[cite: 11, 15]
    clearCart(); 
    
    console.log("Order Processed. Ref: " + orderRef);
}

// Initialize when page loads[cite: 13]
window.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});


// 1. UNIQUE REFERENCE GENERATOR[cite: 10]
// Combines prefix, random entropy, and timestamp
function generateOrderRef() {
    const prefix = "KHZ";
    const random = Math.floor(1000 + Math.random() * 9000); 
    const timestamp = Date.now().toString().slice(-4); 
    return `${prefix}-${random}-${timestamp}`;
}

// 2. RENDER CART PAGE
function renderCartPage() {
    const cart = getCart(); // From cart-logic_4.js
    const display = document.getElementById('cartDisplay');
    const totalsDisplay = document.getElementById('cartTotals');
    
    if (!display) return;

    if (cart.length === 0) {
        display.innerHTML = "<p style='text-align:center; color:#888;'>Your node cart is empty.</p>";
        if(totalsDisplay) totalsDisplay.innerHTML = "";
        return;
    }

    let totalItemsPrice = 0;
    let totalQty = 0;
    let primaryLocation = cart[0].location || "Standard";

    display.innerHTML = cart.map((item, index) => {
        const itemSubtotal = (item.price || 0) * (item.quantity || 1);
        totalItemsPrice += itemSubtotal;
        totalQty += item.quantity;

        return `
            <div class="cart-item">
                <img src="${item.image}" alt="item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity} | ${item.variant || 'Standard'}</p>
                    <p style="font-weight:bold; color:var(--text-main)">R${itemSubtotal.toLocaleString()}</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index}); renderCartPage();">Remove</button>
            </div>
        `;
    }).join('');

    // Logistics Rate Calculation[cite: 13]
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

    if(totalsDisplay) {
        totalsDisplay.innerHTML = `
            <div style="font-size:0.85rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>Subtotal:</span><span>R${totalItemsPrice.toLocaleString()}</span></div>
                <div style="display:flex; justify-content:space-between; color:var(--accent-blue); font-weight:bold;">
                    <span>Logistics (${primaryLocation}):</span><span>R${deliveryFee.toLocaleString()}</span>
                </div>
                <hr style="border:0; border-top:1px solid #ddd; margin:10px 0;">
                <div style="display:flex; justify-content:space-between; font-size:1.3rem; font-weight:bold; color:#1e7e34;">
                    <span>GRAND TOTAL:</span><span>R${finalTotal.toLocaleString()}</span>
                </div>
            </div>
        `;
    }
}

// 3. EXECUTE CHECKOUT[cite: 10, 14]
function processBulkOrder() {
    const cart = getCart(); //[cite: 15]
    if (cart.length === 0) return alert("Cart is empty");

    const orderRef = generateOrderRef(); // Generate the one-time ID[cite: 10]

    // Update UI to show reference to customer immediately
    const display = document.getElementById('cartDisplay');
    const totalsArea = document.getElementById('cartTotals');
    const checkoutBtn = document.querySelector(".buy-button");

    display.innerHTML = `
        <div class="glass-panel" style="text-align:center; padding:30px; border:2px solid var(--accent-blue); background: white;">
            <h2 style="color:var(--accent-blue); margin-bottom:10px;">ORDER SUCCESSFUL</h2>
            <p style="font-size:0.9rem; color:#666;">Please provide this Reference Number for tracking:</p>
            <h1 style="letter-spacing:3px; color:#333; margin:20px 0; padding:15px; background:#f8fbff; border-radius:10px; border:1px dashed var(--accent-blue);">
                ${orderRef}
            </h1>
            <p style="font-size:0.8rem; color:#888;">Order logged in KHOZA Logistics Network [Durban/Pinetown]</p>
            <button class="buy-button" onclick="window.print()" style="background:#6c757d; margin-top:10px;">PRINT RECEIPT</button>
        </div>
    `;

    // Hide totals and original checkout button after completion
    if(totalsArea) totalsArea.style.display = "none";
    if(checkoutBtn) checkoutBtn.style.display = "none";

    // Clear cart to prevent reuse or regeneration on refresh[cite: 11, 15]
    clearCart(); 
    
    console.log("Order Processed. Ref: " + orderRef);
}

// Initialize when page loads[cite: 13]
window.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});