// Menu Data
const menu = [
    { id: 1, name: "Latte", price: 180, category: "coffee", emoji: "☕" },
    { id: 2, name: "Cappuccino", price: 160, category: "coffee", emoji: "☕" },
    { id: 3, name: "Espresso", price: 120, category: "coffee", emoji: "☕" },
    { id: 4, name: "Chocolate Cake", price: 220, category: "dessert", emoji: "🍰" },
    { id: 5, name: "Cheesecake", price: 250, category: "dessert", emoji: "🍰" },
    { id: 6, name: "Brownie", price: 150, category: "dessert", emoji: "🍫" },
    { id: 7, name: "Veg Sandwich", price: 140, category: "sandwich", emoji: "🥪" },
    { id: 8, name: "Chicken Sandwich", price: 180, category: "sandwich", emoji: "🥪" }
];

let cart = [];

// Display Menu
function displayMenu(category = "all") {
    const filtered = category === "all" ? menu : menu.filter(item => item.category === category);
    
    const grid = document.getElementById("menuGrid");
    grid.innerHTML = filtered.map(item => `
        <div class="menu-card">
            <div style="font-size: 3rem;">${item.emoji}</div>
            <h3>${item.name}</h3>
            <div class="price">₹${item.price}</div>
            <button class="add-btn" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `).join("");
}

// Add to Cart
function addToCart(id) {
    const item = menu.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    updateCart();
    showMessage(`${item.name} added!`);
}

// Update Cart Display
function updateCart() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById("cartCount").innerText = count;
    
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById("cartTotal").innerText = total;
    
    const cartItemsDiv = document.getElementById("cartItems");
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Cart is empty</p>";
        return;
    }
    
    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} x${item.qty}</span>
            <span>₹${item.price * item.qty}</span>
            <button onclick="removeItem(${item.id})">❌</button>
        </div>
    `).join("");
}

// Remove Item
function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
    showMessage("Item removed");
}

// Show Message
function showMessage(msg) {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = "position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#5a3e2b; color:white; padding:8px 20px; border-radius:25px; z-index:1000;";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showMessage("Cart is empty!");
        return;
    }
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    showMessage(`Order placed! Total: ₹${total}`);
    cart = [];
    updateCart();
    closeCart();
}

// Cart Sidebar
function openCart() {
    document.getElementById("cartSidebar").classList.add("open");
}

function closeCart() {
    document.getElementById("cartSidebar").classList.remove("open");
}

// Event Listeners
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        displayMenu(btn.dataset.category);
    });
});

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", checkout);

// Initialize
displayMenu("all");