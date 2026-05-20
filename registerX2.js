// register.js - Security Update

// 1. List of blocked temporary email domains (2026 Updated)
const BLOCKED_DOMAINS = [
    "temp-mail.org", "10minutemail.com", "guerrillamail.com", 
    "mailinator.com", "yopmail.com", "maildrop.cc", "tempmail.net"
];

async function register() {
    const status = document.getElementById('status');
    const email = document.getElementById('email').value.toLowerCase();
    const phone = document.getElementById('phoneNumber').value;
    const firstName = document.getElementById('firstName').value;
    const surname = document.getElementById('surname').value;

    try {
        status.innerText = "Security Check: Scanning Connection...";

        // --- 1. BLOCK VPNs & PROXIES ---
        // Using a free privacy API (e.g., ipapi.co or ip-api.com)
        const ipCheck = await fetch('https://ipapi.co/json/');
        const ipData = await ipCheck.json();
        
        // Some APIs provide a 'security' or 'proxy' flag
        if (ipData.proxy || ipData.vpn) {
            status.innerText = "Error: VPN/Proxy detected. Please use a local South African connection.";
            return;
        }

        // --- 2. BLOCK TEMPORARY EMAILS ---
        const domain = email.split('@')[1];
        if (BLOCKED_DOMAINS.includes(domain)) {
            status.innerText = "Error: Temporary email providers are not permitted for KHOZA Identity.";
            return;
        }

        // --- 3. VALIDATE NAME/SURNAME (No Numbers) ---
        const nameRegex = /^[a-zA-Z\s]*$/;
        if (!nameRegex.test(firstName) || !nameRegex.test(surname)) {
            status.innerText = "Error: Names cannot contain numbers or special characters.";
            return;
        }

        // --- 4. VALIDATE PHONE (Numbers Only) ---
        if (!/^\d+$/.test(phone)) {
            status.innerText = "Error: Phone number must contain digits only.";
            return;
        }

        // If all checks pass, continue to original blockchain logic
        status.innerText = "Identity Validated. Connecting to Sepolia...";
        
        // [Existing Blockchain Registration Code from your register.js]
        // ... (const tx = await contract.registerCustomer(...))

    } catch (err) {
        console.error("Security Halt:", err);
        status.innerText = "Error: Security protocol failed. Check your internet.";
    }
}