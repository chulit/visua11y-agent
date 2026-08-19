# Daftar Fitur

Ikhtisar komprehensif seluruh alat aksesibilitas, profil preset, opsi kustomisasi, dan kapabilitas teknis yang tersedia di **Visua11y Agent**.

---

## 1. ♿ Profil Aksesibilitas Preset (WCAG 2.1 & ADA)
Preset satu-klik yang otomatis menyesuaikan kombinasi alat sesuai kebutuhan spesifik pengguna:

- **Hambatan Motorik (*Motor Impaired*)**: Mengaktifkan kursor besar, navigasi perintah suara, penghentian animasi, dan pembesaran ukuran font +10%.
- **Tunanetra (*Blind*)**: Mengaktifkan mode kontras tinggi, pembaca layar (Text-to-Speech), navigasi suara, dan pembesaran font +15%.
- **Buta Warna (*Color Blind*)**: Mengaktifkan simulasi optik Protanopia, font disleksia, dan penyorotan tautan.
- **Disleksia (*Dyslexia*)**: Mengaktifkan font khusus *OpenDyslexic*, spasi huruf lebih lebar, tinggi baris bertambah, dan teks tebal.
- **Penglihatan Rendah (*Low Vision*)**: Penskalaan font instan 130%, mode kontras gelap, font mudah dibaca, dan kursor besar.
- **Kognitif & Belajar (*Cognitive & Learning*)**: Penyorotan judul & tautan, overlay panduan membaca (*reading guide*), dan navigasi suara.
- **Epilepsi & Kejang (*Seizure & Epileptic*)**: Menghentikan seluruh animasi CSS/GIF, saturasi rendah, dan desaturasi gambar.
- **ADHD**: Overlay fokus panduan membaca untuk mengurangi distraksi visual, penyorotan teks, dan kontras yang menenangkan.

---

## 2. 👁️ Simulasi Buta Warna Optik (SVG `feColorMatrix`)
Filter matematis matriks warna optik SVG yang diterapkan secara presisi pada seluruh konten website:

- **Protanopia**: Simulasi bagi pengguna yang tidak sensitif terhadap warna merah.
- **Deuteranopia**: Simulasi bagi pengguna yang tidak sensitif terhadap warna hijau.
- **Tritanopia**: Simulasi bagi pengguna yang tidak sensitif terhadap warna biru.
- **Achromatopsia**: Simulasi buta warna total (*monochromacy* murni).

---

## 3. 📝 Penyesuaian Tipografi & Konten
- **Penskalaan Ukuran Font (*Font Scaling*)**: Menyesuaikan ukuran teks secara halus dari 100% hingga 200% dengan stepper ramah keyboard.
- **Ketebalan Font (*Font Weight*)**: Mode huruf tebal (*bold*) untuk meningkatkan keterbacaan.
- **Jarak Antar Baris (*Line Height*)**: Menambah jarak vertikal antar baris teks.
- **Jarak Antar Huruf (*Letter Spacing*)**: Melebarkan jarak horizontal antar karakter huruf.
- **Font Khusus Disleksia (*Dyslexia Font*)**: Mengganti font halaman dengan tipografi *OpenDyslexic*.
- **Font Mudah Dibaca (*Readable Font*)**: Mengganti font halaman ke tipografi sans-serif bersih (*system-ui*).
- **Sorot Tautan (*Highlight Links*)**: Memberikan outline kontras tinggi pada setiap elemen link `<a>`.
- **Sorot Judul (*Highlight Titles*)**: Memberikan penanda visual pada elemen heading (`h1`–`h6`).

---

## 4. 🎨 Mode Kontras & Penyesuaian Warna
- **Kontras Gelap (*Dark Contrast*)**: Tema latar belakang hitam pekat dengan teks terang.
- **Kontras Terang (*Light Contrast*)**: Tema latar belakang putih bersih dengan teks hitam kontras tinggi.
- **Kontras Tinggi (*High Contrast*)**: Memaksimalkan rasio kontras warna seluruh elemen sesuai standar WCAG AAA.
- **Inversi Warna (*Invert Colors*)**: Membalikkan seluruh spektrum warna pada halaman.
- **Saturasi Tinggi (*High Saturation*)**: Meningkatkan kecerahan dan intensitas warna.
- **Saturasi Rendah (*Low Saturation*)**: Mengurangi intensitas warna untuk kenyamanan mata.
- **Monokrom (*Monochrome*)**: Mengubah seluruh halaman menjadi tampilan skala abu-abu (*grayscale*).
- **Desaturasi Gambar (*Image Desaturation*)**: Menghilangkan warna pada seluruh gambar dan media tanpa mengubah teks.
- **Palet Warna Kustom (*Custom Color Palette*)**: Generator warna granular untuk memilih warna latar belakang, judul, dan teks utama secara bebas.

---

## 5. 🎙️ Alat Bantu Interaksi & Pembacaan
- **Pembaca Layar (*Screen Reader / TTS*)**: Sintesis Text-to-Speech bawaan browser menggunakan Web Speech API untuk membacakan teks yang dipilih.
- **Navigasi Suara (*Voice Navigation*)**: Integrasi Speech Recognition untuk mengontrol fungsi website dan widget lewat perintah suara (misal: *"open menu"*, *"scroll down"*, *"contrast"*).
- **Panduan Membaca (*Reading Guide*)**: Garis fokus horizontal yang mengikuti pergerakan kursor mouse untuk memandu pembacaan per baris.
- **Kursor Besar (*Big Cursor*)**: Kursor berukuran besar dengan visibilitas tinggi untuk pengguna penglihatan rendah.

---

## 6. 🛡️ Kenyamanan Sensorik & Gerakan
- **Hentikan Animasi (*Stop Animations*)**: Membekukan semua animasi CSS, transisi, dan efek melayang (*hover*).
- **Bekukan GIF Animasi (*Freeze Animated GIFs*)**: Menghentikan perulangan gambar GIF animasi untuk mencegah pusing atau kejang.

---

## 7. 🌐 Multibahasa & Internasionalisasi (i18n)
- **53 Bahasa Bawaan**: Mendukung 53 kamus terjemahan bahasa dunia siap pakai.
- **Deteksi Otomatis `html[lang]`**: Otomatis menyesuaikan bahasa widget dengan atribut bahasa situs web.
- **Dukungan RTL (*Right-to-Left*)**: Tampilan otomatis beradaptasi untuk bahasa Arab, Ibrani, Urdu, dan Farsi.
- **Whitelist Bahasa & Sembunyikan Otomatis**: Membatasi pilihan bahasa (`languages: ['id', 'en']`) dan otomatis menyembunyikan tombol pemilih bahasa jika hanya 1 bahasa yang aktif.
- **API Registrasi Bahasa Kustom**: Mendaftarkan kamus terjemahan kustom secara dinamis di runtime (`plugin.registerLanguage()`).

---

## 8. ⚙️ Posisi & Kustomisasi Tampilan Widget
- **8 Posisi Layar**: Ditempatkan di `bottom-right`, `bottom-left`, `top-right`, `top-left`, `center-left`, `center-right`, `top-center`, atau `bottom-center`.
- **Offset Koordinat Kustom**: Mengatur jarak margin piksel tombol pemicu dari tepi layar (`offset: [x, y]`).
- **Ukuran Fleksibel**: Pilihan preset ukuran (`small`, `medium`, `default`) atau ukuran piksel kustom untuk tombol dan ikon.
- **Kustomisasi Ikon**: Mengganti ikon default dengan markup HTML atau vektor SVG kustom.
- **Kontrol Footer**: Menyembunyikan atau menyesuaikan ukuran footer menu widget.
- **Penyimpanan Status Otomatis**: Sinkronisasi pengaturan ke `localStorage` dengan fallback *cookies*.
- **Reset Sekali Klik (*Reset All*)**: Mengembalikan seluruh pengaturan tampilan ke kondisi awal.

---

## 9. 🚀 Arsitektur Teknis & Performa
- **Zero Dependencies**: Murni JavaScript/TypeScript native tanpa pustaka eksternal.
- **Isolasi DOM Root**: Dimount langsung ke `document.documentElement` (`<html>`), kebal dari filter CSS halaman, transformasi, atau scroll kontainer `<body>`.
- **Dukungan Dual-Bundle**:
  - **Full Bundle**: Semua 53 bahasa ter-bundle untuk kemudahan implementasi tanpa konfigurasi.
  - **Slim Bundle (`visua11y-agent/slim`)**: Ukuran awal ekstra ringan dengan pemuatan bahasa secara dinamis (*lazy-loaded chunks*).
- **Kompatibilitas Framework Universal**: Mendukung React, Next.js, Vue 3, Nuxt, Angular, Svelte, dan CMS (WordPress, Shopify, Webflow).
