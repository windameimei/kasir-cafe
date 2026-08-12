// ===== DATA =====
const menuData = [
    { id: 1, name: 'Espresso', category: 'coffee', price: 18000, stock: 50, icon: 'fa-coffee' },
    { id: 2, name: 'Americano', category: 'coffee', price: 22000, stock: 45, icon: 'fa-mug-hot' },
    { id: 3, name: 'Cappuccino', category: 'coffee', price: 28000, stock: 40, icon: 'fa-mug-hot' },
    { id: 4, name: 'Latte', category: 'coffee', price: 30000, stock: 38, icon: 'fa-mug-hot' },
    { id: 5, name: 'Mocha', category: 'coffee', price: 32000, stock: 35, icon: 'fa-mug-hot' },
    { id: 6, name: 'Caramel Macchiato', category: 'coffee', price: 35000, stock: 30, icon: 'fa-mug-hot' },
    { id: 7, name: 'Cold Brew', category: 'coffee', price: 25000, stock: 25, icon: 'fa-glass-water' },
    { id: 8, name: 'Affogato', category: 'coffee', price: 28000, stock: 20, icon: 'fa-ice-cream' },
    { id: 9, name: 'Matcha Latte', category: 'noncoffee', price: 32000, stock: 30, icon: 'fa-leaf' },
    { id: 10, name: 'Chocolate', category: 'noncoffee', price: 28000, stock: 35, icon: 'fa-cookie' },
    { id: 11, name: 'Thai Tea', category: 'noncoffee', price: 22000, stock: 40, icon: 'fa-glass-water' },
    { id: 12, name: 'Lemon Tea', category: 'noncoffee', price: 18000, stock: 42, icon: 'fa-lemon' },
    { id: 13, name: 'Croissant', category: 'food', price: 25000, stock: 20, icon: 'fa-bread-slice' },
    { id: 14, name: 'Sandwich', category: 'food', price: 35000, stock: 15, icon: 'fa-burger' },
    { id: 15, name: 'Pancake', category: 'food', price: 30000, stock: 18, icon: 'fa-cookie' },
    { id: 16, name: 'Waffle', category: 'food', price: 28000, stock: 22, icon: 'fa-cookie' },
    { id: 17, name: 'French Fries', category: 'snack', price: 20000, stock: 30, icon: 'fa-bacon' },
    { id: 18, name: 'Onion Ring', category: 'snack', price: 18000, stock: 28, icon: 'fa-circle' },
    { id: 19, name: 'Cookies', category: 'snack', price: 15000, stock: 50, icon: 'fa-cookie-bite' },
    { id: 20, name: 'Brownies', category: 'snack', price: 22000, stock: 25, icon: 'fa-cookie' },
];

let cart = [];
let transactions = JSON.parse(localStorage.getItem('kasir_transactions') || '[]');
let currentCategory = 'all';
let searchQuery = '';

// ===== DOM ELEMENTS =====
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuToggle = document.getElementById('menuToggle');
const sidebarClose = document.getElementById('sidebarClose');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const dateDisplay = document.getElementById('dateDisplay');
const menuGrid = document.getElementById('menuGrid');
const categoryTabs = document.getElementById('categoryTabs');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const btnClearCart = document.getElementById('btnClearCart');
const btnCheckout = document.getElementById('btnCheckout');
const modalCheckout = document.getElementById('modalCheckout');
const modalReceipt = document.getElementById('modalReceipt');
const btnLogout = document.getElementById('btnLogout');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initDate();
    renderMenu();
    renderCart();
    renderMenuTable();
    renderHistory();
    renderStats();
    renderChart();
    setupEventListeners();
});

function checkSession() {
    const session = localStorage.getItem('kasir_session');
    if (!session) {
        window.location.href = 'index.html';
    }
}

function initDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('id-ID', options);
}

// ===== SIDEBAR =====
function toggleSidebar() {
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
}

// ===== NAVIGATION =====
function navigateTo(page) {
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');

    const titles = {
        kasir: 'Kasir',
        menu: 'Daftar Menu',
        riwayat: 'Riwayat Transaksi',
        laporan: 'Laporan Penjualan',
        pengaturan: 'Pengaturan'
    };
    pageTitle.textContent = titles[page] || 'Kasir';

    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

// ===== MENU RENDER =====
function renderMenu() {
    let filtered = menuData;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(item => item.category === currentCategory);
    }

    if (searchQuery) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    menuGrid.innerHTML = filtered.map(item => `
        <div class="menu-item" onclick="addToCart(${item.id})" title="Klik untuk menambahkan">
            <div class="menu-img">
                <i class="fas ${item.icon}"></i>
                ${item.stock < 10 ? '<span class="menu-badge">Stok Tipis</span>' : ''}
            </div>
            <div class="menu-info">
                <div class="menu-name">${item.name}</div>
                <div class="menu-price">${formatRupiah(item.price)}</div>
                <div class="menu-stock">Stok: ${item.stock}</div>
            </div>
        </div>
    `).join('');
}

// ===== CART =====
function addToCart(id) {
    const item = menuData.find(m => m.id === id);
    if (!item || item.stock <= 0) {
        showToast('Stok tidak tersedia', true);
        return;
    }

    const existing = cart.find(c => c.id === id);
    if (existing) {
        if (existing.qty < item.stock) {
            existing.qty++;
        } else {
            showToast('Stok tidak mencukupi', true);
            return;
        }
    } else {
        cart.push({ id: item.id, name: item.name, price: item.price, qty: 1, icon: item.icon });
    }

    renderCart();
    showToast(`${item.name} ditambahkan`);
}

function updateQty(id, delta) {
    const item = cart.find(c => c.id === id);
    const menuItem = menuData.find(m => m.id === id);

    if (!item) return;

    const newQty = item.qty + delta;
    if (newQty <= 0) {
        cart = cart.filter(c => c.id !== id);
    } else if (newQty <= menuItem.stock) {
        item.qty = newQty;
    } else {
        showToast('Stok tidak mencukupi', true);
        return;
    }

    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    renderCart();
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Keranjang masih kosong</p>
                <span>Tambahkan item dari menu</span>
            </div>
        `;
        cartCount.textContent = '0 item';
        btnCheckout.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-img">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatRupiah(item.price)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
        cartCount.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
        btnCheckout.disabled = false;
    }

    updateSummary();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;

    subtotalEl.textContent = formatRupiah(subtotal);
    taxEl.textContent = formatRupiah(tax);
    totalEl.textContent = formatRupiah(total);
}

// ===== CHECKOUT =====
function openCheckout() {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(total * 0.1);
    const grandTotal = total + tax;

    document.getElementById('paymentTotal').textContent = formatRupiah(grandTotal);
    document.getElementById('cashReceived').value = '';
    document.getElementById('changeAmount').textContent = 'Rp 0';
    document.querySelector('input[name="paymentMethod"][value="cash"]').checked = true;
    document.getElementById('paymentCash').style.display = 'block';

    modalCheckout.classList.add('show');
}

function closeCheckout() {
    modalCheckout.classList.remove('show');
}

function calculateChange() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(total * 0.1);
    const grandTotal = total + tax;
    const received = parseInt(document.getElementById('cashReceived').value) || 0;
    const change = received - grandTotal;

    document.getElementById('changeAmount').textContent = formatRupiah(Math.max(0, change));
    document.getElementById('changeAmount').style.color = change >= 0 ? 'var(--success)' : 'var(--error)';
}

function processPayment() {
    const method = document.querySelector('input[name="paymentMethod"]:checked').value;
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(total * 0.1);
    const grandTotal = total + tax;

    if (method === 'cash') {
        const received = parseInt(document.getElementById('cashReceived').value) || 0;
        if (received < grandTotal) {
            showToast('Uang diterima kurang dari total', true);
            return;
        }
    }

    // Create transaction
    const transaction = {
        id: 'INV-' + String(Date.now()).slice(-6),
        date: new Date().toISOString(),
        items: [...cart],
        subtotal: total,
        tax: tax,
        total: grandTotal,
        method: method,
        cashier: 'Admin',
        status: 'success'
    };

    transactions.unshift(transaction);
    localStorage.setItem('kasir_transactions', JSON.stringify(transactions));

    // Show receipt
    closeCheckout();
    showReceipt(transaction);

    // Clear cart
    cart = [];
    renderCart();
    renderHistory();
    renderStats();
    renderChart();
}

// ===== RECEIPT =====
function showReceipt(transaction) {
    document.getElementById('receiptNo').textContent = transaction.id;
    document.getElementById('receiptDate').textContent = new Date(transaction.date).toLocaleString('id-ID');
    document.getElementById('receiptCashier').textContent = transaction.cashier;
    document.getElementById('receiptSubtotal').textContent = formatRupiah(transaction.subtotal);
    document.getElementById('receiptTax').textContent = formatRupiah(transaction.tax);
    document.getElementById('receiptTotal').textContent = formatRupiah(transaction.total);

    const received = transaction.method === 'cash' 
        ? parseInt(document.getElementById('cashReceived').value) || transaction.total 
        : transaction.total;
    const change = received - transaction.total;

    document.getElementById('receiptPaid').textContent = formatRupiah(received);
    document.getElementById('receiptChange').textContent = formatRupiah(Math.max(0, change));

    document.getElementById('receiptItems').innerHTML = transaction.items.map(item => `
        <div class="receipt-item">
            <span class="receipt-item-name">${item.name}</span>
            <span class="receipt-item-detail">${item.qty}x ${formatRupiah(item.price)}</span>
            <span>${formatRupiah(item.price * item.qty)}</span>
        </div>
    `).join('');

    modalReceipt.classList.add('show');
}

function closeReceipt() {
    modalReceipt.classList.remove('show');
}

function printReceipt() {
    const content = document.getElementById('receiptPaper').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Struk ${document.getElementById('receiptNo').textContent}</title>
            <style>
                body { font-family: 'Courier New', monospace; width: 300px; margin: 0 auto; padding: 20px; }
                h2 { font-size: 18px; margin: 0 0 4px; }
                p { font-size: 11px; margin: 0; line-height: 1.5; color: #666; }
                .receipt-divider { text-align: center; color: #999; font-size: 12px; margin: 8px 0; }
                .receipt-info p { display: flex; justify-content: space-between; }
                .receipt-item { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
                .receipt-row { display: flex; justify-content: space-between; font-size: 11px; }
                .receipt-row.total { font-size: 14px; font-weight: bold; margin-top: 4px; }
            </style>
        </head>
        <body>${content}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ===== MENU TABLE =====
function renderMenuTable() {
    const tbody = document.getElementById('menuTableBody');
    tbody.innerHTML = menuData.map(item => `
        <tr>
            <td><div class="img-cell"><i class="fas ${item.icon}"></i></div></td>
            <td><strong>${item.name}</strong></td>
            <td><span class="status-badge status-success">${item.category}</span></td>
            <td class="price-cell">${formatRupiah(item.price)}</td>
            <td>${item.stock}</td>
            <td>
                <button class="btn-action" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-action" title="Hapus"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// ===== HISTORY =====
function renderHistory() {
    const tbody = document.getElementById('historyTableBody');
    const filterDate = document.getElementById('filterDate')?.value;

    let filtered = transactions;
    if (filterDate) {
        const filter = new Date(filterDate).toDateString();
        filtered = transactions.filter(t => new Date(t.date).toDateString() === filter);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted)">Belum ada transaksi</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.slice(0, 50).map(t => {
        const itemCount = t.items.reduce((sum, i) => sum + i.qty, 0);
        return `
            <tr>
                <td><strong>${t.id}</strong></td>
                <td>${new Date(t.date).toLocaleString('id-ID')}</td>
                <td>${itemCount} item</td>
                <td class="price-cell">${formatRupiah(t.total)}</td>
                <td>${t.method.toUpperCase()}</td>
                <td><span class="status-badge status-success">Sukses</span></td>
                <td>
                    <button class="btn-action" onclick="viewReceipt('${t.id}')" title="Lihat"><i class="fas fa-eye"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewReceipt(id) {
    const t = transactions.find(tr => tr.id === id);
    if (t) showReceipt(t);
}

// ===== STATS =====
function renderStats() {
    const today = new Date().toDateString();
    const todayTrans = transactions.filter(t => new Date(t.date).toDateString() === today);

    const income = todayTrans.reduce((sum, t) => sum + t.total, 0);
    const count = todayTrans.length;
    const avg = count > 0 ? Math.round(income / count) : 0;

    // Best seller
    const itemCounts = {};
    todayTrans.forEach(t => {
        t.items.forEach(i => {
            itemCounts[i.name] = (itemCounts[i.name] || 0) + i.qty;
        });
    });
    const bestSeller = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];

    document.getElementById('statIncome').textContent = formatRupiah(income);
    document.getElementById('statTransactions').textContent = count;
    document.getElementById('statAvg').textContent = formatRupiah(avg);
    document.getElementById('statBestSeller').textContent = bestSeller ? bestSeller[0] : '-';
}

// ===== CHART =====
function renderChart() {
    const days = 7;
    const labels = [];
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toDateString();
        labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }));

        const dayTotal = transactions
            .filter(t => new Date(t.date).toDateString() === dateStr)
            .reduce((sum, t) => sum + t.total, 0);
        data.push(dayTotal);
    }

    const maxVal = Math.max(...data, 1);
    const container = document.getElementById('chartBars');

    container.innerHTML = labels.map((label, i) => {
        const height = (data[i] / maxVal) * 100;
        return `
            <div class="chart-bar" style="height: ${Math.max(height, 5)}%">
                <span class="chart-bar-value">${formatRupiah(data[i])}</span>
                <span class="chart-bar-label">${label}</span>
            </div>
        `;
    }).join('');
}

// ===== UTILS =====
function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.className = isError ? 'toast error show' : 'toast show';
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Sidebar
    menuToggle.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(item.dataset.page);
        });
    });

    // Category tabs
    categoryTabs.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            renderMenu();
        });
    });

    // Search
    document.getElementById('searchMenu').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderMenu();
    });

    // Cart actions
    btnClearCart.addEventListener('click', () => {
        if (cart.length > 0 && confirm('Yakin ingin mengosongkan keranjang?')) {
            cart = [];
            renderCart();
        }
    });

    btnCheckout.addEventListener('click', openCheckout);

    // Modal checkout
    document.getElementById('closeCheckout').addEventListener('click', closeCheckout);
    document.getElementById('btnCancelPayment').addEventListener('click', closeCheckout);
    document.getElementById('btnConfirmPayment').addEventListener('click', processPayment);
    document.getElementById('cashReceived').addEventListener('input', calculateChange);

    // Payment method change
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('paymentCash').style.display = 
                e.target.value === 'cash' ? 'block' : 'none';
        });
    });

    // Receipt
    document.getElementById('btnCloseReceipt').addEventListener('click', closeReceipt);
    document.getElementById('btnPrintReceipt').addEventListener('click', printReceipt);

    // Logout
    btnLogout.addEventListener('click', () => {
        if (confirm('Yakin ingin keluar?')) {
            localStorage.removeItem('kasir_session');
            window.location.href = 'index.html';
        }
    });

    // Settings
    document.getElementById('settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Pengaturan berhasil disimpan');
    });

    // Filter history
    document.getElementById('btnFilter').addEventListener('click', renderHistory);

    // Chart period
    document.getElementById('chartPeriod').addEventListener('change', renderChart);
}
