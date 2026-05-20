// Configuration
const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com"; 
const CONTRACT_ADDRESS = "0x5FC196d4379A8c555866d665191f58a02982c6b3";
// Pinata API Keys (Get these for free at pinata.cloud)
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4NmExODhkYy01ZGJmLTQwMjItOTliMC0wNmFiNTk4Nzg2NjMiLCJlbWFpbCI6Imtob3phbHV0aGFuZG84QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiY2M5YTA2ZmU0ZDM5YjZmMDg4ZCIsInNjb3BlZEtleVNlY3JldCI6ImE3YTY2NWI2ODBiYWJmNjIyNmZkYjdkNGIzMTc4Y2JhMGVmZjUwNTBkNzhlNjg3ZDZhODUxMmY3Y2I0MGU5NTUiLCJleHAiOjE4MDg2NjA3OTF9.KCYCXSVX8-qNzoeXVYsDt3Fn1OZeEAnkSC5cLOxthkE";
// ABI for the KhozaLogistics functions

        const ABI =[
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "variation",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "colour",
        "type": "string"
      }
    ],
    "name": "ItemQuantity",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "customer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "_reference",
        "type": "string"
      }
    ],
    "name": "OrderPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "itemName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "ProductAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_itemCode",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_itemName",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "_urls",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "_retail",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_stockPrice",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_colour",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_qty",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "_size",
        "type": "string[]"
      },
      {
        "internalType": "string",
        "name": "_category",
        "type": "string"
      }
    ],
    "name": "addProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "adminAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_old",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_new",
        "type": "address"
      }
    ],
    "name": "adminForceMigrateCustomer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "admins",
    "outputs": [
      {
        "internalType": "address",
        "name": "adminId",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "storeName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "bankName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "accountHolder",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "accountNumber",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "couriers",
    "outputs": [
      {
        "internalType": "address",
        "name": "adminId",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "firstName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "vehicleType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "phoneNumber",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "customerAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "customerOrders",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "customers",
    "outputs": [
      {
        "internalType": "address",
        "name": "CustomerId",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "Reference",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "firstName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "surname",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "deliveryAddress",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "phoneNumber",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "debtCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "debts",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "customer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isPaid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "deliveryPersonnel",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "emailToAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "admin",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "itemCode",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "itemName",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "imageUrls",
            "type": "string[]"
          },
          {
            "internalType": "uint256",
            "name": "retailPrice",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "stockPrice",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "colour",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "quantityAvailable",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalSold",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "size",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "category",
            "type": "string"
          }
        ],
        "internalType": "struct KhozaLogistics.Product",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_pId",
        "type": "uint256"
      }
    ],
    "name": "getProductImages",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_a",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_a",
        "type": "address"
      }
    ],
    "name": "isCourier",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_old",
        "type": "address"
      }
    ],
    "name": "migrateCustomer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "orderCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "orders",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "customer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "status",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "Reference",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "deliveryAddress",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_pId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_qty",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_ref",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_desc",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_addr",
        "type": "string"
      }
    ],
    "name": "placeOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "productCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "productIds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "admin",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "itemCode",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "itemName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "retailPrice",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "stockPrice",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "colour",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "quantityAvailable",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalSold",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_store",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_bank",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_holder",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_acc",
        "type": "string"
      }
    ],
    "name": "registerAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_ref",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_fn",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_sn",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_addr",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_ph",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_em",
        "type": "string"
      }
    ],
    "name": "registerCustomer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_oId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_st",
        "type": "string"
      }
    ],
    "name": "updateOrderStatus",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "usedReferences",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


const SESSION_KEY = localStorage.getItem("admin_session_key");
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(SESSION_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        body: formData
    });
    const json = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${json.IpfsHash}`;
}

// ... existing configuration (RPC_URL, CONTRACT_ADDRESS, etc.) ...

/**
 * Automatically calculates total stock from the variation string
 * Example: _XL(10), _M(15) -> Total: 25
 */
// --- DYNAMIC VARIATION LOGIC ---

// 1. Function to add a new color row
document.getElementById('addVarBtn').addEventListener('click', () => {
    const container = document.getElementById('variationsContainer');
    const firstRow = document.querySelector('.variation-row');
    const newRow = firstRow.cloneNode(true);
    
    // Clear inputs in the new row
    newRow.querySelectorAll('input').forEach(input => input.value = '');
    newRow.querySelector('.row-qty').innerText = '0';
    
    container.appendChild(newRow);
});

// 2. Updated calculation logic to sum all rows
function calculateGrandTotal() {
    const rows = document.querySelectorAll('.variation-row');
    let grandTotal = 0;

    rows.forEach(row => {
        const sizeInput = row.querySelector('.vSizes').value;
        const matches = sizeInput.match(/\(([^)]+)\)/g);
        let rowTotal = 0;

        if (matches) {
            matches.forEach(match => {
                const num = parseInt(match.replace('(', '').replace(')', ''));
                if (!isNaN(num)) rowTotal += num;
            });
        }
        row.querySelector('.row-qty').innerText = rowTotal;
        grandTotal += rowTotal;
    });

    document.getElementById('qtyDisplay').innerText = grandTotal;
    document.getElementById('finalQty').value = grandTotal;
}

// 3. Updated Sync Logic to handle multiple variations
async function syncInventoryToBlockchain(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    
    try {
        btn.disabled = true;
        
        // Collect Global Data
        const itemCode = document.getElementById('itemCode').value;
        const itemName = document.getElementById('itemName').value;
        const category = document.getElementById('itemCategory').value;
        const description = document.getElementById('itemDesc').value;
        const retail = BigInt(document.getElementById('pRetail').value);
        const stock = BigInt(document.getElementById('pStock').value);

        // Upload Images once for all variations
        btn.innerText = "Uploading Images...";
        const imageInputs = document.querySelectorAll('.product-image-input');
        let urls = [];
        for (let input of imageInputs) {
            if (input.files[0]) {
                const url = await uploadToIPFS(input.files[0]);
                urls.push(url);
            }
        }

        // Loop through each Colour/Size row and create a transaction
        const rows = document.querySelectorAll('.variation-row');
        for (let i = 0; i < rows.length; i++) {
            const color = rows[i].querySelector('.vColour').value;
            const sizeString = rows[i].querySelector('.vSizes').value;
            const sizeArray = sizeString.split(',').map(s => s.trim());
            const rowQty = BigInt(rows[i].querySelector('.row-qty').innerText);

            btn.innerText = `Syncing Variation ${i + 1}/${rows.length} (${color})...`;

            /** Matching cfw.sol parameters  */
            const tx = await contract.addProduct(
                itemCode,
                itemName,
                urls,
                retail,
                description,
                stock,
                color,
                rowQty,
                sizeArray,
                category
            );
            await tx.wait();
        }

        alert("All variations synced successfully!");
        location.reload();

    } catch (err) {
        console.error(err);
        alert("Sync Failed: " + (err.reason || err.message));
        btn.disabled = false;
        btn.innerText = "Upload Product & Sync Chain";
    }
}


// Initial Run and Event Listeners
window.addEventListener('load', () => {
    const form = document.getElementById('addItemForm');
    if (form) {
        form.addEventListener('submit', syncInventoryToBlockchain);
    }
});