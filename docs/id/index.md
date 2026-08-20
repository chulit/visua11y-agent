---
layout: home

hero:
  name: Visua11y Agent
  text: Widget Aksesibilitas Web Universal
  tagline: Toolbar aksesibilitas open-source yang ringan dan tanpa dependensi untuk kepatuhan standar WCAG 2.1 & ramah disabilitas.
  image:
    src: /logo.webp
    alt: Banner Visua11y Agent
  actions:
    - theme: brand
      text: Mulai Panduan
      link: /id/guide/
    - theme: alt
      text: Demo Langsung
      link: https://chulit.github.io/visua11y-agent/demo/

features:
  - title: 🌐 53 Bahasa Bawaan
    details: Internasionalisasi instan dengan deteksi otomatis atribut HTML lang, dukungan RTL, dan API registrasi bahasa kustom.
  - title: ♿ Ramah Standar WCAG 2.1 & ADA
    details: Profil preset siap pakai untuk Disleksia, ADHD, Hambatan Motorik, Low Vision, Buta Warna, dan Perlindungan Epilepsi.
  - title: 🗣️ Navigasi Suara & Pembaca Layar
    details: Integrasi Web Speech API native untuk sintesis pembaca teks ke suara dan navigasi perintah suara.
  - title: 🎨 Tipografi & Penyesuaian Visual
    details: Kontrol penuh ukuran font, spasi baris/huruf, font ramah disleksia, mode kontras, dan pemilih palet warna kustom.
  - title: ⚡ Bebas Dependensi Runtime
    details: Murni TypeScript & CSS vanilla yang dikompilasi menjadi format distribusi ESM, CommonJS, dan UMD yang sangat cepat.
  - title: 🔌 Dukungan Framework Universal
    details: Integrasi mulus untuk React, Vue 3, Svelte, Next.js, Nuxt, Angular, atau cukup tag script CDN biasa.
---

<div class="home-content" style="max-width: 900px; margin: 40px auto 0; padding: 0 20px;">

## Solusi Aksesibilitas Web Ramah Disabilitas

**Visua11y Agent** adalah **widget aksesibilitas website** dan toolbar open-source zero-dependency yang dirancang untuk memudahkan setiap pengguna, termasuk penyandang disabilitas penglihatan, pendengaran, motorik, kognitif, dan neurodivergen.

Sebagai **alternatif gratis untuk UserWay dan AccessiBe**, Visua11y Agent berjalan 100% di sisi klien (client-side) tanpa pelacakan data privasi, tanpa biaya langganan bulanan, dan tanpa memperlambat performa situs Anda.

```html
<!-- Pasang Langsung via CDN Script Tag -->
<script
  src="https://cdn.jsdelivr.net/npm/visua11y-agent@latest/dist/visua11y-agent.umd.js"
  data-visua11y-agent-lang="id"
  data-visua11y-agent-position="bottom-right"
  defer
></script>
```

---

## Fitur Lengkap Widget Aksesibilitas

| Kategori Fitur | Fitur & Alat Bantu yang Tersedia |
| :--- | :--- |
| **Pembaca Layar & Audio** | **Pembaca Layar (Screen Reader)** berbasis Text-to-Speech Web Speech API, **Navigasi Suara (Voice Navigation)**, dan **Panduan Membaca (Reading Guide)**. |
| **Kontras & Penyesuaian Warna** | **Kontras Tinggi (High Contrast)**, Kontras Gelap, Kontras Terang, **Balik Warna (Invert Colors)**, Desaturasi Gambar, Monokrom, dan Penyesuaian Palet Warna Kustom. |
| **Simulasi & Filter Buta Warna** | Filter akurat untuk **Protanopia** (buta warna merah), **Deuteranopia** (buta warna hijau), **Tritanopia** (buta warna biru-kuning), dan **Achromatopsia** (total). |
| **Font & Tipografi Disleksia** | **Font Ramah Disleksia (OpenDyslexic)**, Penyesuaian Ukuran Font (100% s/d 200%), Spasi Huruf, Ketinggian Baris, Ketebalan Font, dan Penyorot Tautan/Judul. |
| **Ramah Motorik & Kognitif** | **Hentikan Animasi (Stop Animations)** untuk pencegahan kejang/epilepsi, **Kursor Besar (Big Cursor)**, dan mode fokus ADHD. |
| **Dukungan Multi-Bahasa** | **53 Bahasa Internasional** termasuk Bahasa Indonesia & Basa Daerah, dukungan teks RTL (Arab/Ibrani), dan API pendaftaran kamus kustom. |

---

## Pertanyaan yang Sering Diajukan (FAQ)

### Apakah Visua11y Agent memenuhi standar kepatuhan WCAG 2.1 & ADA?
Ya. Visua11y Agent dibangun mengacu pada panduan standar aksesibilitas internasional **WCAG 2.1 Level AA/AAA** serta standar **ADA Title III** untuk membantu pemilik situs web dan pengembang menciptakan website yang inklusif dan ramah disabilitas.

### Apakah widget ini benar-benar gratis dan open-source?
Ya, Visua11y Agent berlisensi **MIT License**. Anda bebas menggunakannya untuk proyek personal, komersial, instansi pemerintah, pendidikan, maupun enterprise tanpa biaya lisensi apa pun.

### Apa bedanya dengan widget berbayar seperti UserWay atau AccessiBe?
Visua11y Agent 100% transparan, bebas dependensi berat, tidak mengumpulkan data pribadi pengunjung untuk pelacakan iklan, dan dapat di-host sendiri (*self-hosted*) maupun melalui CDN publik.

### Framework apa saja yang didukung?
Mendukung seluruh framework modern seperti **React, Next.js, Vue (2 & 3), Nuxt, Svelte, Angular, Astro, Laravel, WordPress, dan HTML Vanilla**.

</div>
