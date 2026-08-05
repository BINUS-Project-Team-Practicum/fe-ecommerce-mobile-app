# Ecommerce Marketplace Mobile App

Aplikasi Expo/React Native untuk memenuhi bagian **Mobile App (React Native)** pada tugas project lab: daftar produk, detail produk, integrasi backend API, serta login dengan penyimpanan JWT aman di perangkat.

## Menjalankan aplikasi

1. Salin konfigurasi lingkungan: `cp .env.example .env`.
2. Isi `EXPO_PUBLIC_API_URL` dengan URL backend API Anda. Untuk perangkat fisik, gunakan IP LAN komputer, bukan `localhost`.
3. Instal dependensi: `npm install`.
4. Jalankan: `npm start`.
5. Scan QR code dari terminal memakai Expo Go, atau gunakan `npm run android` / `npm run ios`.

## Kontrak API yang digunakan

- `GET /products` — respons dapat berupa array produk, `{ products: [...] }`, atau `{ data: [...] }`.
- `POST /auth/login` — body: `{ "email", "password" }`; respons token dapat berupa `token`, `accessToken`, atau `data.token`.

Token JWT disimpan menggunakan `expo-secure-store`, bukan penyimpanan biasa. Sesuaikan endpoint/struktur respons di `src/api/client.js` jika backend Anda berbeda.
