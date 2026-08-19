# Features List

A comprehensive overview of all accessibility tools, profiles, customization options, and technical capabilities available in **Visua11y Agent**.

---

## 1. ♿ Preset Accessibility Profiles (WCAG 2.1 & ADA)
One-click presets that instantly tailor tool combinations for specific user needs:

- **Motor Impaired**: Activates oversized cursor, voice command navigation, animation halt, and +10% font size scaling.
- **Blind**: Activates high contrast mode, screen reader helper (Text-to-Speech), voice navigation, and +15% font size scaling.
- **Color Blind**: Activates optical Protanopia filter matrix, OpenDyslexic font, and link highlighters.
- **Dyslexia**: Activates the specialized *OpenDyslexic* typeface, increased letter spacing, higher line height, and bold text weight.
- **Low Vision**: Scales text to 130%, enables dark contrast mode, readable font, and an oversized cursor.
- **Cognitive & Learning**: Highlights titles and links, enables reading guide focus bar, and activates voice navigation.
- **Seizure & Epileptic**: Halts all CSS/GIF animations, lowers saturation, and desaturates media/images.
- **ADHD**: Provides a reading guide focus overlay to minimize visual distractions, highlights text elements, and applies calming contrast.

---

## 2. 👁️ Optical Color Blindness Simulation (SVG `feColorMatrix`)
Precision mathematical color matrix filters applied seamlessly to webpage content:

- **Protanopia**: Red-blindness simulation.
- **Deuteranopia**: Green-blindness simulation.
- **Tritanopia**: Blue-blindness simulation.
- **Achromatopsia**: Complete color blindness (monochromacy).

---

## 3. 📝 Typography & Content Adjustments
- **Font Scaling**: Smoothly adjust text size from 100% up to 200% with keyboard-friendly steppers.
- **Font Weight**: Toggle bold weights across all text elements for improved readability.
- **Line Height**: Increase vertical distance between lines of text.
- **Letter Spacing**: Widen horizontal spacing between individual characters.
- **Dyslexia Font**: Apply the specialized *OpenDyslexic* typeface across the entire page.
- **Readable Font**: Swap page fonts to clean, legible sans-serif typography (`system-ui`).
- **Highlight Links**: Apply high-contrast outline borders to all clickable `<a>` links.
- **Highlight Titles**: Apply distinct visual badges to all heading elements (`h1`–`h6`).

---

## 4. 🎨 Color & Contrast Modes
- **Dark Contrast**: Deep dark background mode with bright, legible text.
- **Light Contrast**: Crisp clean white background with high-contrast dark text.
- **High Contrast**: Maximizes contrast ratios across all page elements to satisfy WCAG AAA standards.
- **Invert Colors**: Reverses the entire page color spectrum.
- **High Saturation**: Increases color vibrancy and intensity.
- **Low Saturation**: Calms color vibrancy for light-sensitive users.
- **Monochrome**: Converts the whole webpage into pure grayscale.
- **Image Desaturation**: Converts all `<img>`, `<picture>`, and video media to grayscale without affecting text colors.
- **Custom Color Palette**: Granular color generator allowing users to pick custom hues and hex values for backgrounds, headings, and body text.

---

## 5. 🎙️ Assistive Interaction & Reading Tools
- **Screen Reader Helper (TTS)**: Built-in Text-to-Speech synthesis using the native Web Speech API to read aloud selected or hovered text.
- **Voice Navigation**: Speech Recognition integration allowing users to control website actions and widget settings via spoken commands (e.g., *"open menu"*, *"scroll down"*, *"contrast"*).
- **Reading Guide**: A sleek horizontal focus ruler that follows cursor movement to assist per-line reading focus.
- **Big Cursor**: High-visibility oversized cursor for low-vision and motor-impaired visitors.

---

## 6. 🛡️ Sensory & Motion Comfort
- **Stop Animations**: Freezes all CSS animations, transitions, and hover motion.
- **Freeze Animated GIFs**: Disables looping GIF imagery to prevent sensory overload and seizure triggers.

---

## 7. 🌐 Internationalization (i18n) & Multilingual UI
- **53 Global Languages**: Pre-bundled with 53 comprehensive translation dictionaries.
- **Automated `html[lang]` Detection**: Automatically adopts the host website's language attribute on initialization.
- **RTL Direction Support**: Automatic layout mirroring for right-to-left languages (Arabic, Hebrew, Persian, Urdu).
- **Language Whitelisting & Auto-hide**: Restrict available choices via `languages: ['en', 'id']`; auto-hides the language switcher when only 1 language is specified.
- **Dynamic Dictionary Registration**: Add or override translations at runtime via `plugin.registerLanguage()`.

---

## 8. ⚙️ Widget Positioning & UI Customization
- **8 Screen Anchors**: Place the floating launcher at `bottom-right`, `bottom-left`, `top-right`, `top-left`, `center-left`, `center-right`, `top-center`, or `bottom-center`.
- **Custom Pixel Offsets**: Fine-tune margin distance from screen edges (`offset: [x, y]`).
- **Flexible Sizing**: Choose presets (`small`, `medium`, `default`) or explicit pixel dimensions for launcher buttons and icons.
- **Custom Launcher Icon**: Replace the default icon with custom HTML markup or SVG vectors.
- **Footer Controls**: Hide or adjust the size of the menu panel footer.
- **Automatic State Persistence**: Synchronizes settings to `localStorage` with cookie fallbacks.
- **One-Click Reset**: Instant reset button to restore all original webpage styles and defaults.

---

## 9. 🚀 Technical Architecture & Performance
- **Zero Dependencies**: Pure native TypeScript/JavaScript without external runtime libraries.
- **Root DOM Isolation**: Mounted to `document.documentElement` (`<html>`), ensuring immunity to page CSS transforms, filters, and container overflow scrolls.
- **Dual Bundle Support**:
  - **Full Bundle**: All 53 locales pre-packaged for zero-config deployments.
  - **Slim Bundle (`visua11y-agent/slim`)**: Ultra-lightweight initial footprint with dynamic on-demand locale chunk loading.
- **Universal Framework Compatibility**: Works out of the box with React, Next.js, Vue 3, Nuxt, Angular, Svelte, and CMS platforms (WordPress, Shopify, Webflow).
