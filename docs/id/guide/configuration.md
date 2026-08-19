# Panduan Konfigurasi Lengkap

Visua11y Agent menyediakan opsi konfigurasi yang sangat fleksibel dan lengkap untuk framework JavaScript modern (Vue, React, Next.js, Nuxt, Svelte, Angular) maupun implementasi langsung melalui script-tag CDN.

---

## 🚀 Quick Start

::: code-group

```javascript [Vue 3 / React / Modern Bundlers]
import { createVisua11yAgent } from 'visua11y-agent';
// Atau versi lightweight: import { createVisua11yAgent } from 'visua11y-agent/slim';

const agent = createVisua11yAgent({
  lang: 'id',
  languages: ['id', 'en', 'es'],
  position: 'bottom-right',
  offset: [24, 24],
  size: 'medium',
  buttonSize: 56,
});
```

```html [HTML / CDN Script Tag]
<script
  src="https://cdn.jsdelivr.net/npm/visua11y-agent/dist/visua11y-agent.umd.js"
  data-visua11y-agent-lang="id"
  data-visua11y-agent-languages="id,en,es"
  data-visua11y-agent-position="bottom-right"
  data-visua11y-agent-offset="24,24"
  defer
></script>
```

:::

---

## 📋 Tabel Referensi Opsi Lengkap

Saat menginisialisasi `visua11y-agent`, Anda dapat memberikan opsi konfigurasi baik melalui `createVisua11yAgent(options)` maupun `visua11yAgent(options)`:

| Opsi | Tipe Data | Nilai Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| **`lang`** | `string` | `'en'` | Bahasa UI awal. Mendukung 53 bahasa dunia. Dinormalisasi secara otomatis (misal: `'id-ID'` &rarr; `'id'`). |
| **`languages`** | `string[]` \| `string` | `undefined` *(Semua 53)* | **Whitelist Bahasa**: Array atau teks dipisah koma untuk membatasi bahasa yang ditampilkan (misal: `['id', 'en']` atau `'id,en'`). Jika hanya 1 bahasa, tombol pemilih bahasa di header otomatis disembunyikan. |
| **`position`** | `string` | `'bottom-left'` | Posisi jangkar layar untuk floating trigger button. Mendukung 8 posisi: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'`, `'center-right'`, `'center-left'`, `'bottom-center'`, `'top-center'`. |
| **`offset`** | `number[]` \| `string` | `[20, 20]` | Jarak margin `[X, Y]` (dalam pixel) dari tepi layar. Dapat berupa array `[24, 24]` atau teks `'24,24'`. |
| **`size`** | `string` \| `number` | `'default'` | Preset ukuran widget: `'small'`, `'medium'`, `'default'` / `'large'`, atau nilai pixel numerik lebar panel drawer. |
| **`buttonSize`** | `number` | `58` | Diameter khusus tombol trigger launcher dalam pixel (misal: `48`, `56`, `64`). |
| **`icon`** | `string` | SVG default | Kustom markup SVG HTML, URL gambar, atau selector elemen template (misal: `'#custom-icon-template'`). |

---

## 🎯 Penjelasan Detail Setiap Opsi

### 1. `position` (Posisi Tombol Trigger)

Tempatkan tombol aksesibilitas melayang pada salah satu dari 8 titik sudut/sisi layar:

```text
┌────────────────────────────────────────────────────────┐
│ [top-left]            [top-center]         [top-right] │
│                                                        │
│ [center-left]                                  [center-right]
│                                                        │
│ [bottom-left]        [bottom-center]    [bottom-right] │
└────────────────────────────────────────────────────────┘
```

```javascript
createVisua11yAgent({
  position: 'bottom-right', // Direkomendasikan untuk visibilitas terbaik
});
```

### 2. `offset` (Jarak Margin dari Tepi Layar)

Mengatur jarak horizontal (X) dan vertikal (Y) dari batas viewport dalam pixel:

```javascript
createVisua11yAgent({
  position: 'bottom-right',
  offset: [30, 30], // 30px dari kanan, 30px dari bawah
});
```

### 3. `languages` (Whitelist Bahasa & Sembunyikan Otomatis)

Batasi daftar bahasa yang tersedia agar sesuai dengan bahasa yang didukung oleh website Anda:

```javascript
// Whitelist beberapa bahasa pilihan
createVisua11yAgent({
  languages: ['id', 'en', 'es'],
  lang: 'id', // Bahasa default aktif
});

// Mode Bahasa Tunggal:
// Jika hanya ditentukan tepat 1 bahasa, tombol pemilih bahasa
// pada header modal akan otomatis disembunyikan agar tampilan tetap rapi!
createVisua11yAgent({
  languages: ['id'],
});
```

### 4. `size` & `buttonSize` (Ukuran Widget & Tombol)

Menyesuaikan ukuran tombol pemicu dan panel menu drawer:

```javascript
createVisua11yAgent({
  size: 'medium',    // Preset ukuran panel ('small', 'medium', 'default')
  buttonSize: 52,    // Diameter tombol khusus dalam pixel
});
```

### 5. `icon` (Kustom Ikon Launcher)

Kustomisasi ikon tombol pemicu menggunakan inline SVG, URL file gambar, atau elemen template HTML:

::: code-group

```javascript [Inline SVG]
createVisua11yAgent({
  icon: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/>
  </svg>`
});
```

```javascript [URL Gambar / WebP]
createVisua11yAgent({
  icon: 'https://example.com/assets/accessibility-icon.webp'
});
```

```html [Template HTML]
<!-- HTML -->
<template id="my-a11y-icon">
  <span class="custom-badge">♿</span>
</template>

<!-- JS -->
<script>
createVisua11yAgent({
  icon: '#my-a11y-icon'
});
</script>
```

:::

---

## 🌐 Bahasa Kustom & Modifikasi Istilah Kamus

Visua11y Agent dilengkapi dengan engine internasionalisasi runtime yang memungkinkan Anda menambahkan bahasa baru, dialek lokal, atau istilah branding korporat.

### Mendaftarkan Bahasa Baru / Dialek Daerah

```javascript
import { createVisua11yAgent } from 'visua11y-agent';

const agent = createVisua11yAgent();

// Daftarkan Basa Jawa (jv)
agent.registerLanguage({
  code: 'jv',
  label: 'Basa Jawa (Javanese)',
  dictionary: {
    'Accessibility Menu': 'Menu Aksesibilitas',
    'Reset settings': 'Wangsulaken Sedaya Setelan',
    'Content Adjustments': 'Pangaturan Konten',
    'Color Adjustments': 'Pangaturan Werna',
    'Screen Reader': 'Pamaos Layar',
    'Voice Navigation': 'Navigasi Swara',
    'Custom Color': 'Werna Kustom',
    'Widget Position': 'Papan Widget',
    'Language': 'Basa',
    'Search languages': 'Padosi basa...',
    'Open Accessibility Menu': 'Bukak Menu Aksesibilitas',
    'Close Accessibility Menu': 'Tutup Menu Aksesibilitas',
  }
});

// Aktifkan bahasa yang baru didaftarkan
agent.changeLanguage('jv');
```

### Meng-override Istilah Kamus Tertentu (`merge: true`)

Gunakan `merge: true` untuk menimpa kata kunci tertentu tanpa perlu menulis ulang seluruh kamus:

```javascript
agent.registerLanguage({
  code: 'id',
  label: 'Bahasa Indonesia (Kustom)',
  merge: true,
  dictionary: {
    'Accessibility Menu': 'Pusat Inklusi Perusahaan',
    'Reset settings': 'Kembalikan Pengaturan Awal',
    'Screen Reader': 'Asisten Audio Cerdas',
  }
});
```

---

## ♿ Profil Preset Aksesibilitas (WCAG 2.1 / ADA)

Visua11y Agent menyediakan 8 profil kurasi yang langsung menerapkan kombinasi alat aksesibilitas secara bersamaan:

| ID Profil | Nama Profil | Penyesuaian yang Diterapkan |
| :--- | :--- | :--- |
| `motor-impaired` | **Motor Impaired** | Kursor penunjuk besar, navigasi suara, nonaktifkan animasi, ukuran font +10%. |
| `blind` | **Blind** | Mode kontras tinggi, pembaca layar TTS, navigasi suara, ukuran font +15%. |
| `color-blind` | **Color Blind** | Filter optik matriks SVG Protanopia, font OpenDyslexic, penyorotan tautan. |
| `dyslexia` | **Dyslexia** | Tipografi OpenDyslexic, spasi huruf ekstra, tinggi baris bertambah, judul tebal. |
| `low-vision` | **Low Vision** | Skala font 130%, tema kontras gelap, font keterbacaan tinggi, kursor besar. |
| `cognitive-learning`| **Cognitive & Learning** | Sorot judul & tautan, panduan fokus membaca, navigasi suara. |
| `seizure-epileptic` | **Seizure & Epileptic** | Bekukan seluruh animasi CSS/GIF, saturasi rendah, desaturasi media. |
| `adhd` | **ADHD** | Garis fokus panduan membaca, sorot judul/tautan, kontras menenangkan. |

```javascript
// Mengaktifkan profil secara programatis
agent.setProfile('color-blind');
```

---

## 🛠️ Metode API Programatis

Instance yang dikembalikan oleh `createVisua11yAgent()` (atau `window.Visua11yAgentPlugin`) menyediakan kendali runtime penuh:

```typescript
interface Visua11yAgentPlugin {
  // Kontrol Menu
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;

  // Bahasa & i18n
  changeLanguage: (code: string) => void;
  registerLanguage: (options: IRegisterLanguageOptions) => string;

  // Tampilan & Posisi
  setPosition: (position: string) => void;
  setOffset: (offset: number[] | string) => void;
  setWidgetSize: (size: string) => void;
  setIcon: (html?: string) => void;
  hideFooter: (hide: boolean) => void;
  setFooterSize: (size: 'small' | 'medium' | 'large') => void;

  // Alat Bantu & Profil
  toggleTool: (key: string, enable?: boolean) => void;
  setProfile: (profileId: string) => void;
  resetAll: () => void;
  getSettings: () => ISettings;
}
```

---

## 📡 Custom DOM Events

Anda dapat mendengarkan perubahan status widget di aplikasi Anda:

```javascript
// Dipicu saat bahasa aktif berubah
document.addEventListener('visua11y-agent:language:changed', (event) => {
  console.log('Bahasa diubah ke:', event.detail.code);
});

// Dipicu saat bahasa baru didaftarkan secara dinamis
document.addEventListener('visua11y-agent:languages:updated', (event) => {
  console.log('Daftar bahasa diperbarui dengan:', event.detail.code);
});
```

---

## 💾 Penyimpanan & State Persistence

Preferensi pengguna dan status alat bantu yang sedang aktif tersimpan secara otomatis di `localStorage` dengan kunci `visua11y-agent-settings`. Saat pengguna berpindah halaman atau me-refresh browser, seluruh pengaturan akan dipulihkan secara otomatis.

Untuk mengembalikan pengaturan pengguna kembali ke default pabrik secara programatis:
```javascript
agent.resetAll();
```
