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

// ========== CONTINUOUS NEW FEATURES ==========

// 11. Add GST Display to Cart
function calculateGST(amount) {
    return amount * 0.05;
}

// 12. Update Cart with GST and Discounts
let appliedCoupon = null;
let totalSavings = 0;

function updateCartWithDetails() {
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const gst = calculateGST(subtotal);
    const discount = totalSavings;
    const total = subtotal + gst - discount;
    
    // Update display if elements exist
    if (document.getElementById("cartSubtotal")) {
        document.getElementById("cartSubtotal").innerText = subtotal;
        document.getElementById("cartGST").innerText = Math.round(gst);
        document.getElementById("cartDiscount").innerText = discount;
        document.getElementById("cartFinalTotal").innerText = total;
    }
    
    return total;
}

// 13. Apply Coupon Code
function applyCoupon(couponCode) {
    if (couponCode === "CAFE10") {
        totalSavings = 50;
        appliedCoupon = "CAFE10";
        showMessage("🎉 Coupon CAFE10 applied! You saved ₹50");
        updateCart();
        updateCartWithDetails();
        return true;
    } else if (couponCode === "WELCOME20") {
        totalSavings = 20;
        appliedCoupon = "WELCOME20";
        showMessage("✨ Welcome discount! ₹20 off on first order!");
        updateCart();
        updateCartWithDetails();
        return true;
    } else if (couponCode === "FREECOFFEE") {
        addToCart(3);
        showMessage("☕ Free espresso added to your cart!");
        return true;
    } else {
        showMessage("❌ Invalid coupon code");
        return false;
    }
}

// 14. Remove Coupon
function removeCoupon() {
    totalSavings = 0;
    appliedCoupon = null;
    showMessage("Coupon removed");
    updateCart();
    updateCartWithDetails();
}

// 15. Add to Wishlist
let wishlist = [];

function addToWishlist(itemId) {
    const item = menu.find(i => i.id === itemId);
    if (!wishlist.find(i => i.id === itemId)) {
        wishlist.push(item);
        showMessage(`❤️ ${item.name} added to wishlist!`);
    } else {
        showMessage(`${item.name} already in wishlist ❤️`);
    }
    updateWishlistDisplay();
}

function removeFromWishlist(itemId) {
    wishlist = wishlist.filter(i => i.id !== itemId);
    showMessage("Item removed from wishlist");
    updateWishlistDisplay();
}

function updateWishlistDisplay() {
    const wishlistBtn = document.getElementById("wishlistBtn");
    if (wishlistBtn) {
        wishlistBtn.innerHTML = `❤️ Wishlist (${wishlist.length})`;
    }
}

// 16. Show Wishlist Modal
function showWishlist() {
    if (wishlist.length === 0) {
        showMessage("Your wishlist is empty!");
        return;
    }
    
    let wishlistHTML = "❤️ My Wishlist ❤️\n\n";
    wishlist.forEach((item, index) => {
        wishlistHTML += `${index + 1}. ${item.name} - ₹${item.price}\n`;
    });
    alert(wishlistHTML);
}

// 17. Checkout with Order Summary
function checkoutWithSummary() {
    if (cart.length === 0) {
        showMessage("Cart is empty!");
        return;
    }
    
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const gst = calculateGST(subtotal);
    const discount = totalSavings;
    const total = subtotal + gst - discount;
    
    let summary = "🛍️ ORDER SUMMARY 🛍️\n\n";
    cart.forEach(item => {
        summary += `${item.name} x${item.qty} = ₹${item.price * item.qty}\n`;
    });
    summary += `\nSubtotal: ₹${subtotal}`;
    summary += `\nGST (5%): ₹${Math.round(gst)}`;
    if (discount > 0) {
        summary += `\nDiscount: -₹${discount}`;
    }
    summary += `\n\nTotal: ₹${total}`;
    summary += `\n\nThank you for ordering! ☕`;
    
    alert(summary);
    showMessage(`Order placed! Total: ₹${total}`);
    
    // Save to order history
    saveOrderToHistory(cart, total);
    
    cart = [];
    totalSavings = 0;
    appliedCoupon = null;
    updateCart();
    updateCartWithDetails();
    closeCart();
}

// 18. Save Order History
let orderHistory = [];

function saveOrderToHistory(items, total) {
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: [...items],
        total: total
    };
    orderHistory.push(order);
    showMessage("Order saved to history!");
}

// 19. View Order History
function viewOrderHistory() {
    if (orderHistory.length === 0) {
        showMessage("No orders yet!");
        return;
    }
    
    let historyHTML = "📜 ORDER HISTORY 📜\n\n";
    orderHistory.forEach(order => {
        historyHTML += `Order #${order.id}\n`;
        historyHTML += `Date: ${order.date}\n`;
        order.items.forEach(item => {
            historyHTML += `  - ${item.name} x${item.qty} = ₹${item.price * item.qty}\n`;
        });
        historyHTML += `Total: ₹${order.total}\n`;
        historyHTML += "-------------------\n\n";
    });
    alert(historyHTML);
}

// 20. Daily Special Check
function checkDailySpecial() {
    const day = new Date().getDay();
    const specials = {
        0: "🎉 Sunday Special: Buy 1 Get 1 Free on all coffee!",
        1: "💪 Monday: 10% off on all sandwiches!",
        2: "🍰 Tuesday: Free brownie with any coffee!",
        3: "☕ Wednesday: 20% off on all espresso!",
        4: "🍫 Thursday: Buy any dessert, get tea free!",
        5: "🎊 Friday: 15% off on all items!",
        6: "✨ Saturday: Free cheesecake on orders above ₹500!"
    };
    showMessage(specials[day] || "☕ Welcome to Cafe Delight!");
}

// 21. Add Item Rating
function addRating(itemId, rating) {
    const item = menu.find(i => i.id === itemId);
    if (item) {
        item.userRating = rating;
        showMessage(`⭐ You rated ${item.name} ${rating} stars!`);
    }
}

// 22. Share Cart Feature
function shareCart() {
    if (cart.length === 0) {
        showMessage("Add items to cart first!");
        return;
    }
    
    const items = cart.map(i => `${i.name} x${i.qty}`).join(", ");
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const message = `Check out my cafe order! 🍽️\n${items}\nTotal: ₹${total}`;
    
    navigator.clipboard.writeText(message);
    showMessage("📋 Cart copied to clipboard! Share with friends!");
}

// 23. Add Quick Order Buttons
function quickOrder(itemId) {
    addToCart(itemId);
    addToCart(itemId);
    showMessage("⭐ Quick order: 2 items added!");
}

// 24. Show Total Items in Cart
function getCartItemCount() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
}

// 25. Clear All Items
function clearAllItems() {
    if (cart.length === 0) {
        showMessage("Cart is already empty!");
        return;
    }
    cart = [];
    totalSavings = 0;
    appliedCoupon = null;
    updateCart();
    updateCartWithDetails();
    showMessage("🧹 Cart cleared!");
}

// 26. Add to Cart with Quantity
function addToCartWithQty(id, qty = 1) {
    const item = menu.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...item, qty: qty });
    }
    
    updateCart();
    updateCartWithDetails();
    showMessage(`${qty}x ${item.name} added!`);
}

// 27. Get Popular Items
function getPopularItems() {
    const popular = menu.filter(item => item.popular === true);
    return popular;
}

// 28. Show Recommendations
function showRecommendations() {
    const popular = getPopularItems();
    let recs = "🔥 RECOMMENDATIONS 🔥\n\n";
    popular.forEach(item => {
        recs += `${item.emoji} ${item.name} - ₹${item.price}\n`;
    });
    alert(recs);
}

// 29. Track User Stats
let userStats = {
    totalOrders: 0,
    totalSpent: 0,
    favoriteItem: null
};

function updateUserStats(total) {
    userStats.totalOrders++;
    userStats.totalSpent += total;
    
    // Find favorite item
    const itemCounts = {};
    cart.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
    });
    let maxCount = 0;
    for (let name in itemCounts) {
        if (itemCounts[name] > maxCount) {
            maxCount = itemCounts[name];
            userStats.favoriteItem = name;
        }
    }
}

// 30. Show User Stats
function showUserStats() {
    alert(`📊 YOUR STATS 📊\n\nTotal Orders: ${userStats.totalOrders}\nTotal Spent: ₹${userStats.totalSpent}\nFavorite Item: ${userStats.favoriteItem || "None yet"}`);
}

// ========== MODIFIED CHECKOUT FUNCTION ==========
// Replace your existing checkout function with this one
function enhancedCheckout() {
    if (cart.length === 0) {
        showMessage("Cart is empty!");
        return;
    }
    
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const gst = calculateGST(subtotal);
    const discount = totalSavings;
    const total = subtotal + gst - discount;
    
    // Update user stats
    updateUserStats(total);
    
    checkoutWithSummary();
}

// ========== ADD NEW UI ELEMENTS ==========
function addCouponInput() {
    const cartFooter = document.querySelector(".cart-footer") || document.querySelector(".cart-sidebar");
    if (cartFooter && !document.getElementById("couponInput")) {
        const couponHTML = `
            <div style="margin: 10px 0;">
                <input type="text" id="couponCode" placeholder="Enter coupon code" style="width: 70%; padding: 5px;">
                <button onclick="applyCoupon(document.getElementById('couponCode').value)" style="padding: 5px 10px;">Apply</button>
                <button onclick="removeCoupon()" style="padding: 5px 10px; margin-left: 5px;">Remove</button>
            </div>
        `;
        cartFooter.insertAdjacentHTML('afterbegin', couponHTML);
    }
}

// ========== INITIALIZE NEW FEATURES ==========
setTimeout(() => {
    addCouponInput();
    checkDailySpecial();
    
    // Add wishlist button to header
    const header = document.querySelector("header");
    if (header && !document.getElementById("wishlistBtn")) {
        const wishlistBtn = document.createElement("button");
        wishlistBtn.id = "wishlistBtn";
        wishlistBtn.textContent = "❤️ Wishlist (0)";
        wishlistBtn.style.cssText = "position: absolute; top: 10px; right: 10px; background: #c47a5c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;";
        wishlistBtn.onclick = showWishlist;
        header.style.position = "relative";
        header.appendChild(wishlistBtn);
    }
    
    // Add share cart button
    const cart = document.querySelector(".cart-sidebar");
    if (cart && !document.getElementById("shareCartBtn")) {
        const shareBtn = document.createElement("button");
        shareBtn.textContent = "📤 Share Cart";
        shareBtn.style.cssText = "margin-top: 10px; background: #e8bc9e; border: none; padding: 8px; width: 100%; cursor: pointer; border-radius: 5px;";
        shareBtn.onclick = shareCart;
        cart.querySelector(".checkout")?.insertAdjacentElement('afterend', shareBtn);
    }
    
    // Add recommendations button
    const menuTabs = document.querySelector(".menu-tabs");
    if (menuTabs && !document.getElementById("recommendBtn")) {
        const recBtn = document.createElement("button");
        recBtn.textContent = "🔥 Recommendations";
        recBtn.className = "tab-btn";
        recBtn.onclick = showRecommendations;
        menuTabs.appendChild(recBtn);
    }
}, 100);