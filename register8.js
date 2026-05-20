       // 1. Load the dotenv library
    require('dotenv').config();

      // 1. Configuration
        const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com"; 
const CONTRACT_ADDRESS = "0xdEB791266bE6ACca34F58989dD75cCb52d4fba7c";
//const PINATA_JWT = "PASTE_YOUR_FULL_JWT_HERE"; // Ensure this is the LONG token

//const CONTRACT_ADDRESS = "0x27AEB9e899669A8Ad6A19460054A614e6bAcD17e";
      //  const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
     //   const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com"; 
//const CONTRACT_ADDRESS = "0x7b7Fc57F363b9D60038C8b7f8F270e77Ee13dd0C";
//const PINATA_JWT = "PASTE_YOUR_FULL_JWT_HERE"; // Ensure this is the LONG token

//const CONTRACT_ADDRESS = "0x27AEB9e899669A8Ad6A19460054A614e6bAcD17e";
      //  const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
//const RPC_URL = "https://eth-hoodi.g.alchemy.com/v2/apnIC4FVlS_hAusqPQkDb";

         // 2. Access variables via process.env
      //  const RPC_URL = process.env.RPC_URL;
         //const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
     //  const MASTER_KEY = process.env.MASTER_KEY;

       // 3. Fund the new wallet for gas fees (SECURE VERSION)
status.innerText = "Requesting Gas from KHOZA Vault...";

const response = await fetch('https://your-api-link.com/refuel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userAddress: customerSigner.address })
});

const result = await response.json();
if (result.success) {
    status.innerText = "Gas Received. Syncing to Blockchain...";
} else {
    throw new Error("Gas refuel denied.");
}
          const ABI = abi3.json;  


    const MASTER_KEY = "0x38c7c4a5de74883af146fd14cc61d6f89313bbce1ad6c931b25dd1efcfb86a9d"; 

      
       async function register() {
            const status = document.getElementById('status');
            try {
                // 1. Get User Inputs
                const fName = document.getElementById('firstName').value.trim();
                const sName = document.getElementById('surname').value.trim();
                const email = document.getElementById('email').value.trim();
                const pass = document.getElementById('pass').value;
                const confirmPass = document.getElementById('confirmPass').value; // Get the second password
                const addr = document.getElementById('deliveryAddress').value.trim();
                const phoneInput = document.getElementById('phoneNumber').value.replace(/\D/g,'');


                 // Check if both password fields match exactly
                   const passwordsMatch = (pass === confirmPass);


                   // Error Handling for Passwords
                 if (!passwordsMatch) {
                    status.style.color = "#ff4d4d";
                   status.innerText = "Error: Passwords do not match.";
                      return;
                   }
                                        // --- NEW PASSWORD STRENGTH VALIDATION ---

                         // Check 1: Minimum length of 7 characters
                 const isLongEnough = pass.length >= 7;

              // Check 2: Contains at least one uppercase letter (A-Z)
              const hasUppercase = /[A-Z]/.test(pass);

            // Check 3: Contains at least one number (0-9)
               const hasNumber = /[0-9]/.test(pass);

             // Logic Gate: If any condition fails, stop the process and alert the user
           if (!isLongEnough || !hasUppercase || !hasNumber) {
              status.style.color = "#ff4d4d"; // Change text to red for error
              status.innerText = "Security Error: Password must be 7+ chars, include 1 uppercase & 1 number.";
              return; // Exit function so no gas is spent and no registration occurs
                 } 

                // Validation
                if (!email || !pass || !fName) {
                    status.innerText = "Error: Name, Email, and Password required.";
                    return;
                }

                // COMBINE NAMES: Contract only has ONE name field (_name)
                const fullName = fName + " " + sName;
                const phone = BigInt(phoneInput);

                // 2. Setup Provider and User Wallet
                const provider = new ethers.JsonRpcProvider(RPC_URL);
                const seed = email.toLowerCase() + pass;
                const userWallet = new ethers.Wallet(ethers.keccak256(ethers.toUtf8Bytes(seed)));
                const customerSigner = userWallet.connect(provider);

                const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, customerSigner);

                // 3. Fund the new wallet for gas fees
                status.innerText = "Refueling Gas Tank...";
                const masterSigner = new ethers.Wallet(MASTER_KEY, provider);
                const userBal = await provider.getBalance(customerSigner.address);

                if (userBal < ethers.parseEther("0.002")) {
                    const fundTx = await masterSigner.sendTransaction({
                        to: customerSigner.address, // Sends to user, not contract
                        value: ethers.parseEther("0.007") 
                    });
                    await fundTx.wait();
                }


                // Inside your register() function
status.innerText = "Requesting gas from KHOZA Vault...";

try {
    const response = await fetch("/.netlify/functions/refuel", {
        method: "POST",
        body: JSON.stringify({ userAddress: customerSigner.address }),
    });

    const result = await response.json();
    if (result.success) {
        status.innerText = "Gas refueled! Finalizing blockchain registration...";
        // Now proceed with your contract.registerCustomer(...) logic
    }
} catch (err) {
    status.innerText = "Refuel failed. Please try again.";
    console.error(err);
}

                // 4. BLOCKCHAIN REGISTRATION (Matches the 5 arguments in cfw11.sol)
                status.innerText = "Syncing Identity to Blockchain...";
                const ref = "REF-" + Math.random().toString(36).substr(2, 6).toUpperCase();
                
                // ORDER MUST MATCH ABI: _name, _ref, _address, _phone, _email
                const tx = await contract.registerCustomer(
                    fullName,   // Maps to _name
                    ref,        // Maps to _ref
                    addr,       // Maps to _address
                    phone,      // Maps to _phone
                    email,      // Maps to _email
                    { gasLimit: 600000 } 
                );

                await tx.wait();
                status.innerText = "Registration Confirmed!";
                saveSession(userWallet.privateKey);

            } catch (e) {
                console.error("Full Debug Error:", e);
                status.innerText = "Error: " + (e.reason || "Parameter mismatch or network error.");
            }
        }

        function saveSession(key) {
            localStorage.setItem("user_session_key", key);
            localStorage.setItem("user_role", "customer");
            setTimeout(() => { window.location.href = "shop.html"; }, 2000);
        }