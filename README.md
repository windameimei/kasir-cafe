☕ KopiKita - Sistem Kasir Cafe

Aplikasi kasir cafe modern berbasis HTML, CSS, dan JavaScript murni. Siap deploy ke Vercel.

## ✨ Fitur

- **Halaman Login Admin** - Autentikasi sederhana dengan session localStorage
- **Dashboard Kasir** - Tampilan menu, keranjang belanja, dan pembayaran
- **Manajemen Menu** - Daftar lengkap produk dengan kategori
- **Riwayat Transaksi** - Catatan semua penjualan
- **Laporan & Statistik** - Grafik penjualan harian
- **Struk Digital** - Cetak struk langsung dari browser
- **Responsive** - Bisa digunakan di desktop, tablet, maupun mobile

## 🔐 Default Login

| Field    | Value     |
|----------|-----------|
| Username | `admin`   |
| Password | `admin123`|

## 📁 Struktur Folder

```
kasir-cafe/
├── index.html          # Halaman Login
├── dashboard.html      # Dashboard Kasir
├── css/
│   ├── login.css       # Styling Login
│   └── style.css       # Styling Dashboard
├── js/
│   ├── login.js        # Logic Login
│   └── main.js         # Logic Dashboard
└── README.md
```

## 🚀 Deploy ke Vercel

### Langkah 1: Buat Repository GitHub

1. Buka [github.com](https://github.com) dan login
2. Klik tombol **New** (tanda +) → **New repository**
3. Isi **Repository name**: `kasir-cafe` (atau nama lain)
4. Pilih **Public**
5. Klik **Create repository**

### Langkah 2: Upload File ke GitHub

**Cara A - Via Upload (Cepat):**
1. Di halaman repository baru, klik **uploading an existing file**
2. Drag & drop semua file project (index.html, dashboard.html, folder css/, folder js/)
3. Scroll ke bawah, isi commit message: `Initial commit`
4. Klik **Commit changes**

**Cara B - Via Git (Rekomendasi):**
```bash
# 1. Buka terminal, masuk ke folder project
cd kasir-cafe

# 2. Inisialisasi Git
git init

# 3. Tambahkan semua file
git add .

# 4. Commit
git commit -m "Initial commit"

# 5. Tambahkan remote (ganti USERNAME dengan username GitHub kamu)
git remote add origin https://github.com/USERNAME/kasir-cafe.git

# 6. Push ke GitHub
git branch -M main
git push -u origin main
```

### Langkah 3: Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login (bisa pakai akun GitHub)
2. Klik tombol **Add New...** → **Project**
3. Pilih repository `kasir-cafe` dari daftar
4. Klik **Import**
5. Di halaman konfigurasi:
   - **Framework Preset**: Pilih `Other`
   - **Root Directory**: Biarkan `./`
   - **Build Command**: Biarkan kosong
   - **Output Directory**: Biarkan kosong
6. Klik **Deploy**
7. Tunggu 1-2 menit, lalu klik **Visit** untuk melihat hasilnya!

### Langkah 4: Custom Domain (Opsional)

1. Di dashboard Vercel, pilih project `kasir-cafe`
2. Klik tab **Settings** → **Domains**
3. Masukkan domain yang kamu inginkan
4. Ikuti instruksi konfigurasi DNS

## 📝 Catatan Penting

- Data transaksi tersimpan di **localStorage** browser (tidak permanen)
- Untuk produksi, tambahkan backend (Node.js, PHP, dll) + database
- Gunakan HTTPS saat deploy ke production untuk keamanan

## 🎨 Kustomisasi

### Ganti Warna Tema
Edit file `css/style.css` dan `css/login.css`, ubah variabel CSS:
```css
:root {
    --primary: #6B4F3A;      /* Warna utama */
    --accent: #C4A882;       /* Warna aksen */
    --bg: #F5F0EB;           /* Background */
}
```

### Tambah Menu
Edit array `menuData` di file `js/main.js`:
```javascript
{ 
    id: 21, 
    name: 'Nama Menu Baru', 
    category: 'coffee', 
    price: 25000, 
    stock: 30, 
    icon: 'fa-coffee' 
}
```

### Ganti Nama Toko
Edit di file `dashboard.html` bagian sidebar dan `js/main.js` bagian receipt.

## 📄 Lisensi

Free to use. Dibuat untuk kebutuhan pembelajaran.
