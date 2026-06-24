/* script.js */

// --- MENU DATA ---
const menuData = [
    { id: 1, name: "Traditional Chicken Mandi", price: 300, desc: "Fragrant rice with slow-cooked tender chicken.", img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80" },
    { id: 2, name: "Traditional Mutton Mandi", price: 350, desc: "Authentic Arabian style with juicy mutton.", img: "https://images.unsplash.com/photo-1542314831-c6a4d14272ed?w=500&q=80" },
    { id: 3, name: "Special Family Mandi Platter", price: 900, desc: "A royal platter featuring mixed meats, perfect for 4.", img: "https://images.unsplash.com/photo-1565557613262-b8f80459588b?w=500&q=80" },
    { id: 4, name: "Chilli Chicken", price: 240, desc: "Spicy Indo-Chinese style chicken bites.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80" },
    { id: 5, name: "Chicken 65", price: 260, desc: "Classic deep-fried spicy chicken.", img: "https://images.unsplash.com/photo-1599487405270-8e12eb2fea11?w=500&q=80" },
    { id: 6, name: "Chicken Majestic", price: 260, desc: "Tender chicken strips tossed in yogurt and spices.", img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&q=80" },
    { id: 7, name: "Paneer 65", price: 250, desc: "Spicy and tangy fried paneer cubes.", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&q=80" },
    { id: 8, name: "Babycorn Chilli", price: 220, desc: "Crispy babycorn tossed in chili sauce.", img: "https://images.unsplash.com/photo-1626779836885-3b91fa8cc50c?w=500&q=80" }
];

// --- STATE MANAGEMENT ---
let cart = [];
let orderType = 'delivery'; // 'delivery' or 'pickup'
const WA_NUMBER = "918121213533"; 

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    renderMenu();
    setupTimeSlots();
});

// Render Menu Cards
function renderMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = menuData.map(item => `
        <div class="bg-black/40 backdrop-blur-sm border border-gold/20 rounded-xl overflow-hidden hover:border-gold/60 transition group">
            <div class="h-48 overflow-hidden">
                <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
            </div>
            <div class="p-5">
                <h3 class="font-serif text-xl text-gold mb-1">${item.name}</h3>
                <p class="text-offwhite/60 text-sm mb-4 h-10">${item.desc}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-lg text-white">₹${item.price}</span>
                    <button onclick="addToCart(${item.id})" class="bg-gold/10 border border-gold text-gold text-xs px-4 py-2 rounded uppercase tracking-wider hover:bg-gold hover:text-darkbrown transition">
                        + Add to Order
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- CART LOGIC ---
function addToCart(id) {
    const item = menuData.find(m => m.id === id);
    const existing = cart.find(c => c.id === id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    updateCartUI();
    
    // Auto-open cart on first add
    if (cart.length === 1) toggleCart(true);
}

function updateQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== id);
    }
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const checkoutForm = document.getElementById('checkout-form');
    
    // Update badge count
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = totalItems;

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-offwhite/40 text-center italic mt-10">Your basket is empty.</p>`;
        checkoutForm.classList.add('hidden');
        document.getElementById('cart-subtotal').innerText = `₹ 0`;
        document.getElementById('cart-gst').innerText = `₹ 0`;
        document.getElementById('cart-total').innerText = `₹ 0`;
        return;
    }

    checkoutForm.classList.remove('hidden');
    container.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center bg-black/50 p-3 rounded-lg border border-white/5">
            <div>
                <h4 class="text-gold text-sm font-bold">${item.name}</h4>
                <p class="text-offwhite/60 text-xs">₹${item.price} x ${item.qty}</p>
            </div>
            <div class="flex items-center gap-3 bg-darkbrown rounded border border-gold/30 px-2 py-1">
                <button onclick="updateQty(${item.id}, -1)" class="text-gold hover:text-white px-1">-</button>
                <span class="text-sm font-bold w-4 text-center">${item.qty}</span>
                <button onclick="updateQty(${item.id}, 1)" class="text-gold hover:text-white px-1">+</button>
            </div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const gst = Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + gst;

    document.getElementById('cart-subtotal').innerText = `₹ ${subtotal}`;
    document.getElementById('cart-gst').innerText = `₹ ${gst}`;
    document.getElementById('cart-total').innerText = `₹ ${total}`;
}

// --- DRAWER & UI TOGGLES ---
function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-overlay');
    
    if (forceOpen || drawer.classList.contains('translate-x-full')) {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    } else {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

function setOrderType(type) {
    orderType = type;
    const tabDel = document.getElementById('tab-delivery');
    const tabPick = document.getElementById('tab-pickup');
    const fieldsDel = document.getElementById('delivery-fields');

    if (type === 'delivery') {
        tabDel.className = "flex-1 py-2 text-sm text-darkbrown font-bold bg-gold rounded-md transition";
        tabPick.className = "flex-1 py-2 text-sm text-offwhite/60 font-bold hover:text-white transition";
        fieldsDel.classList.remove('hidden');
    } else {
        tabPick.className = "flex-1 py-2 text-sm text-darkbrown font-bold bg-gold rounded-md transition";
        tabDel.className = "flex-1 py-2 text-sm text-offwhite/60 font-bold hover:text-white transition";
        fieldsDel.classList.add('hidden');
    }
}

// --- WHATSAPP GENERATORS ---
function sendOrder() {
    if (cart.length === 0) return alert("Your cart is empty!");

    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    
    if (!name || !phone) return alert("Please enter your name and mobile number.");

    let addressStr = "Pickup from Restaurant";
    if (orderType === 'delivery') {
        const address = document.getElementById('order-address').value;
        const area = document.getElementById('order-area').value;
        if (!address || !area) return alert("Please enter complete delivery address.");
        addressStr = `${address}, ${area}, Hanamkonda`;
    }

    let itemsText = cart.map(item => `▪ ${item.qty}x ${item.name} (₹${item.price * item.qty})`).join('\n');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;

    const message = `*MAJESTY MANDI HOUSE - NEW ORDER*\n\n` +
                    `*Type:* ${orderType.toUpperCase()}\n` +
                    `*Name:* ${name}\n` +
                    `*Phone:* ${phone}\n` +
                    `*Address:* ${addressStr}\n\n` +
                    `*ORDER DETAILS:*\n${itemsText}\n\n` +
                    `Subtotal: ₹${subtotal}\n` +
                    `GST (5%): ₹${gst}\n` +
                    `*GRAND TOTAL: ₹${total}*`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// --- RESERVATION LOGIC ---
let selectedTime = "1:00 PM";

function setupTimeSlots() {
    const btns = document.querySelectorAll('.time-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btns.forEach(b => b.classList.remove('active-time'));
            e.target.classList.add('active-time');
            selectedTime = e.target.innerText;
        });
    });
}

function submitReservation() {
    const guests = document.getElementById('res-guests').value;
    const date = document.getElementById('res-date').value;
    const name = document.getElementById('res-name').value;
    const phone = document.getElementById('res-phone').value;
    const occasion = document.getElementById('res-occasion').value;

    if (!date || !name || !phone) return alert("Please fill all required fields.");

    const message = `*TABLE RESERVATION REQUEST*\n\n` +
                    `*Name:* ${name}\n` +
                    `*Phone:* ${phone}\n` +
                    `*Guests:* ${guests}\n` +
                    `*Date:* ${date}\n` +
                    `*Time:* ${selectedTime}\n` +
                    `*Occasion:* ${occasion}\n\n` +
                    `Please confirm my booking.`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}
