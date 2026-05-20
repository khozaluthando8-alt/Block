// cart-logic.js - Core Utility
const KHOZA_CART_KEY = "khoza_cart"; 

function getCart() {
    const cart = localStorage.getItem(KHOZA_CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(KHOZA_CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
    let cart = getCart();
    // Unique check by ID + Variant string to keep separate delivery rows if needed
    const existingIndex = cart.findIndex(item => item.id === product.id && item.variant === product.variant);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    saveCart(cart);
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    if (typeof renderCartPage === 'function') renderCartPage();
}

function clearCart() {
    localStorage.removeItem(KHOZA_CART_KEY);
}