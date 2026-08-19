# Pengenalan

Selamat datang di dokumentasi resmi Visua11y Agent, widget aksesibilitas ringan untuk website.

Visua11y Agent menambahkan toolbar aksesibilitas yang dapat disesuaikan ke situs Anda sehingga pengunjung dapat menyesuaikan kontras, tipografi, dan alat bantu interaksi sesuai permintaan. Pasang di stack apa pun, sesuaikan bahasanya, dan Anda siap berangkat.

## Fitur

-   **UI Multibahasa** – 53 locale bawaan siap pakai dengan deteksi otomatis atribut HTML lang, dukungan RTL, dan API registrasi kamus kustom.
-   **Profil Aksesibilitas** – 8 skenario preset standar WCAG/ADA (Hambatan Motorik, Tunanetra, Buta Warna, Disleksia, Low Vision, Kognitif & Belajar, Epilepsi & Kejang, ADHD) dengan memori status pintar.
-   **Simulasi Buta Warna** – Filter optik matematis SVG `feColorMatrix` presisi untuk Protanopia, Deuteranopia, Tritanopia, dan Achromatopsia.
-   **Penyesuaian Konten** – Penskalaan ukuran font (hingga 200%), ketebalan font, spasi huruf, tinggi baris, font OpenDyslexic, dan penyorotan judul serta tautan.
-   **Kontrol Warna & Kontras** – Mode kontras Gelap, Terang, Kontras Tinggi, inversi warna, saturasi (rendah/tinggi), mode monokrom, desaturasi gambar, dan generator palet warna kustom.
-   **Alat Membaca & Fokus** – Overlay panduan membaca, pembaca layar (Text-to-Speech), navigasi perintah suara, dan penekanan teks.
-   **Utilitas Gerakan & Kursor** – Hentikan semua animasi CSS/GIF dan perbesar kursor layar.
-   **Isolasi DOM Tingkat Root** – Dimount langsung ke `document.documentElement` untuk menjamin posisi fixed tanpa terpengaruh filter CSS atau scroll kontainer halaman.
-   **API & Hook Pengembang** – API komprehensif pada `createVisua11yAgent()` dan `window.Visua11yAgentPlugin` untuk integrasi skrip, framework, dan CMS.

## Struktur Menu

Menu aksesibilitas diatur ke dalam bagian-bagian berikut:

-   **Profil Aksesibilitas** – Preset skenario cepat dengan aktivasi satu klik.
-   **Penyesuaian Konten** – Alat tipografi termasuk ukuran font, ketebalan, spasi, tinggi baris, font disleksia, dan penyorotan elemen.
-   **Penyesuaian Warna** – Mode kontras, simulasi buta warna, inversi warna, saturasi, dan generator palet warna kustom.
-   **Alat Bantu** – Utilitas aksesibilitas termasuk pembaca layar, navigasi suara, kursor besar, penghenti animasi, dan panduan membaca.
-   **Pengaturan Widget** – Opsi konfigurasi ukuran tombol widget, posisi di layar, koordinat offset, dan pemilihan bahasa.
