# Konfigurasi

Kontrol widget melalui atribut `data-visua11y-agent-*` pada tag script atau dengan memanggil helper pada `window.Visua11yAgentPlugin` setelah dimuat.

## Contoh Quick Start

```html
<script
  src="https://unpkg.com/visua11y-agent"
  data-visua11y-agent-lang="id"
  data-visua11y-agent-position="bottom-right"
  data-visua11y-agent-offset="24,24"
  defer
></script>
```

## Atribut Script
 
| Atribut                        | Deskripsi                                                                                                          | Contoh                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `data-visua11y-agent-lang`     | Atur bahasa UI default.                                                                                            | `data-visua11y-agent-lang="id"`                   |
| `data-visua11y-agent-languages`| Batasi bahasa yang tersedia (dipisah koma). Jika hanya 1 bahasa, tombol bahasa di header otomatis disembunyikan.    | `data-visua11y-agent-languages="id,en,es"`        |
| `data-visua11y-agent-position` | Pilih di mana launcher muncul (`bottom-right`, `bottom-left`, `top-right`, `top-left`, dll.).                       | `data-visua11y-agent-position="bottom-right"`     |
| `data-visua11y-agent-offset`   | Sesuaikan offset launcher (`x,y`).                                                                                 | `data-visua11y-agent-offset="24,24"`              |
| `data-visua11y-agent-size`     | Ubah preset ukuran tombol (`default`, `medium`, `small`).                                                          | `data-visua11y-agent-size="medium"`               |
| `data-visua11y-agent-icon`     | Berikan HTML kustom, URL gambar, atau selector template untuk ikon launcher.                                       | `data-visua11y-agent-icon="<span>♿️</span>"`      |

## Opsi Konfigurasi JavaScript (NPM / Frameworks)

Saat mengimpor `visua11y-agent` atau `visua11y-agent/slim` pada React, Vue, Next.js, atau Vite, Anda dapat mengonfigurasi widget menggunakan `createVisua11yAgent` atau `visua11yAgent`:

```javascript
import { createVisua11yAgent } from 'visua11y-agent';
// Atau jika menggunakan slim: import { createVisua11yAgent } from 'visua11y-agent/slim';

const agent = createVisua11yAgent({
  lang: 'id',
  languages: ['id', 'en', 'es'],
  position: 'bottom-right',
  offset: [24, 24],
  size: 'medium',
  buttonSize: 56,
  icon: '<svg viewBox="0 0 24 24">...</svg>',
});
```

### Tabel Referensi Opsi Lengkap

| Opsi | Tipe Data | Nilai Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| **`lang`** | `string` | `'en'` | Bahasa antarmuka default (contoh: `'id'`, `'en'`, `'es'`). |
| **`languages`** | `string[]` \| `string` | `undefined` (Semua 53) | **Whitelist Bahasa**: Array atau teks dipisah koma untuk membatasi pilihan bahasa (contoh: `['id', 'en']` atau `'id,en'`). |
| **`position`** | `string` | `'bottom-left'` | Posisi floating trigger button: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'`, `'center-right'`, `'center-left'`, `'bottom-center'`, `'top-center'`. |
| **`offset`** | `number[]` \| `string` | `[20, 20]` | Jarak margin `[X, Y]` dalam pixel dari tepi layar. |
| **`size`** | `string` \| `number` | `'default'` | Preset ukuran widget / drawer panel: `'small'`, `'medium'`, `'default'` / `'large'`. |
| **`buttonSize`** | `number` | `58` | Ukuran diameter trigger button dalam pixel (contoh: `48`, `56`, `64`). |
| **`icon`** | `string` | SVG bawaan | Kustom ikon launcher button: string SVG, URL gambar, atau selector template (contoh: `'#my-icon'`). |

## Whitelist Bahasa & Sembunyikan Otomatis Bahasa Tunggal

Anda dapat membatasi daftar bahasa yang tersedia di dalam widget menggunakan whitelist:

```javascript
import { createVisua11yAgent } from 'visua11y-agent';

// Whitelist beberapa bahasa pilihan
createVisua11yAgent({
  languages: ['id', 'en', 'es'],
  lang: 'id',
});

// Bahasa tunggal: Tombol ikon bahasa di header modal otomatis disembunyikan
createVisua11yAgent({
  languages: ['id'],
});
```

## Bahasa Kustom & Modifikasi Kamus Terjemahan

Daftarkan bahasa kustom, dialek daerah, atau ubah istilah bisnis pada kamus yang sudah ada:

```javascript
import { createVisua11yAgent } from 'visua11y-agent';

const agent = createVisua11yAgent();

// 1. Daftarkan bahasa kustom / dialek baru
agent.registerLanguage({
  code: 'jv',
  label: 'Basa Jawa (Javanese)',
  dictionary: {
    'Accessibility Menu': 'Menu Aksesibilitas',
    'Reset settings': 'Wangsulaken Sedaya Setelan',
    'Screen Reader': 'Pamaos Layar',
  }
});

// 2. Override istilah tertentu (misal: istilah enterprise / brand)
agent.registerLanguage({
  code: 'id',
  label: 'Bahasa Indonesia (Kustom)',
  merge: true, // Menggabungkan dengan kamus bawaan yang ada
  dictionary: {
    'Accessibility Menu': 'Pusat Inklusi Perusahaan',
  }
});
```

## Profil Aksesibilitas

Visua11y Agent menyediakan 8 profil preset standar WCAG/ADA yang tersimpan otomatis di `localStorage`:

| Profil | Deskripsi & Penyesuaian Alat |
| :--- | :--- |
| `Motor Impaired` | Kursor besar, navigasi suara, hentikan animasi, ukuran font +10%. |
| `Blind` | Kontras tinggi, pembaca layar, navigasi suara, ukuran font +15%. |
| `Color Blind` | Filter optik matriks Protanopia, font disleksia, penyorotan tautan. |
| `Dyslexia` | Font OpenDyslexic, spasi huruf ekstra, tinggi baris bertambah, teks tebal. |
| `Low Vision` | Penskalaan font 130%, kontras gelap, font mudah dibaca, kursor besar. |
| `Cognitive & Learning` | Penyorotan judul & tautan, panduan membaca, navigasi suara. |
| `Seizure & Epileptic` | Hentikan semua animasi CSS/GIF, saturasi rendah, desaturasi gambar. |
| `ADHD` | Overlay fokus panduan membaca, penyorotan konten, kontras menenangkan. |

## Helper JavaScript

| Helper                                                 | Deskripsi                                         | Contoh                                                                                                                                        |
| ------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `window.Visua11yAgentPlugin.setIcon(html)`             | Ganti ikon launcher floating.                     | `Visua11yAgentPlugin.setIcon("<span>🌈</span>")`                                                                                              |
| `window.Visua11yAgentPlugin.changeLanguage(code)`      | Ubah bahasa UI saat runtime.                      | `Visua11yAgentPlugin.changeLanguage("id")`                                                                                                    |
| `window.Visua11yAgentPlugin.registerLanguage(options)` | Daftarkan terjemahan baru secara langsung.        | `Visua11yAgentPlugin.registerLanguage({ code: "id", label: "Bahasa Indonesia", dictionary: { "Accessibility Menu": "Menu Aksesibilitas" } })` |
| `window.Visua11yAgentPlugin.setWidgetSize(size)`     | Ubah ukuran tombol widget.                        | `Visua11yAgentPlugin.setWidgetSize("small")`                                                                                                  |
| `window.Visua11yAgentPlugin.setPosition(position)`     | Pindahkan widget ke posisi baru.                  | `Visua11yAgentPlugin.setPosition("top-left")`                                                                                                 |
| `window.Visua11yAgentPlugin.setOffset(offset)`         | Sesuaikan offset widget.                          | `Visua11yAgentPlugin.setOffset("50,50")`                                                                                                      |
| `window.Visua11yAgentPlugin.openMenu()`                | Buka menu aksesibilitas.                          | `Visua11yAgentPlugin.openMenu()`                                                                                                              |
| `window.Visua11yAgentPlugin.closeMenu()`               | Tutup menu aksesibilitas.                         | `Visua11yAgentPlugin.closeMenu()`                                                                                                             |
| `window.Visua11yAgentPlugin.toggleTool(key, enable)`   | Toggle alat tertentu on atau off.                 | `Visua11yAgentPlugin.toggleTool("high-contrast", true)`                                                                                       |
| `window.Visua11yAgentPlugin.setProfile(profileId)`     | Atur profil aksesibilitas aktif.                  | `Visua11yAgentPlugin.setProfile("blind")`                                                                                                     |
| `window.Visua11yAgentPlugin.getSettings()`             | Dapatkan objek pengaturan pengguna saat ini.      | `console.log(Visua11yAgentPlugin.getSettings())`                                                                                              |
| `window.Visua11yAgentPlugin.hideFooter(hide)`          | Sembunyikan atau tampilkan footer menu.           | `Visua11yAgentPlugin.hideFooter(true)`                                                                                                        |
| `window.Visua11yAgentPlugin.setFooterSize(size)`       | Atur ukuran footer menu.                          | `Visua11yAgentPlugin.setFooterSize("small")`                                                                                                  |
| `window.Visua11yAgentPlugin.resetAll()`                | Kembalikan default widget dan hapus pengaturan.   | `Visua11yAgentPlugin.resetAll()`                                                                                                              |

Lihat `demo/index.html` untuk contoh praktis.
