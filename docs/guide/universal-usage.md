# Universal Usage Guide

Visua11y Agent now supports **multiple usage patterns** for maximum flexibility!

## 🎯 Method 1: Modern ES Module (Recommended)

```typescript
import { createVisua11yAgent } from 'visua11y-agent';

const plugin = createVisua11yAgent({
  lang: 'en',
  languages: ['en', 'id', 'ru'], // optional whitelist (auto-hides button if only 1 language)
  position: 'bottom-right',
  size: 'medium',        // overall widget (button + panel)
  buttonSize: 52,        // override trigger button only (px)
  iconSize: 28           // override icon only (px)
});

// Use the API
plugin.setWidgetSize('small');
plugin.setButtonSize(48);
plugin.setIconSize(26);
plugin.openMenu();
plugin.changeLanguage('en');

### Key Options

- `lang`: initial active language code (`'en'`, `'id'`, etc.).
- `languages`: optional array or comma-separated string of allowed languages (e.g. `['en', 'id']` or `'en,id'`). If only 1 language is specified, the language picker button is automatically hidden.
- `size`: overall widget preset (`default`, `small`, `medium`, `large`) or numeric px.
- `buttonSize`: override trigger button size only (px).
- `iconSize`: override trigger icon size only (px).
- `icon`: HTML string or selector (e.g., `#my-icon-template`) for custom icon.
```

## 🎯 Method 2: Default Import

```javascript
import visua11yAgent from 'visua11y-agent';

const plugin = visua11yAgent({
  options: {
    lang: 'en',
    position: 'bottom-right'
  }
});

plugin.setPosition('top-left');
```

## 🎯 Method 3: CDN with window (Auto-init)

```html
<script
  src="https://cdn.jsdelivr.net/npm/visua11y-agent/dist/visua11y-agent.umd.js"
  data-visua11y-agent-lang="en"
  data-visua11y-agent-position="bottom-right"
  defer
></script>

<script>
  // Automatically available on window
  window.Visua11yAgentPlugin.setWidgetSize('small');
</script>
```

## 🎯 Method 4: Vue 3 Composable

```javascript
// composables/useVisua11y.js
import { ref, onMounted } from 'vue';
import { createVisua11yAgent } from 'visua11y-agent';

export function useVisua11y(options = {}) {
  const plugin = ref(null);

  onMounted(() => {
    plugin.value = createVisua11yAgent(options);
  });

  return {
    setSize: (size) => plugin.value?.setWidgetSize(size),
    openMenu: () => plugin.value?.openMenu(),
    closeMenu: () => plugin.value?.closeMenu(),
    changeLanguage: (lang) => plugin.value?.changeLanguage(lang),
    getSettings: () => plugin.value?.getSettings()
  };
}
```

**Usage:**
```vue
<script setup>
import { useVisua11y } from '@/composables/useVisua11y';

const { setSize, openMenu, changeLanguage } = useVisua11y({
  lang: 'en',
  position: 'bottom-right'
});
</script>

<template>
  <button @click="setSize('small')">Small Widget</button>
  <button @click="openMenu()">Open Menu</button>
  <button @click="changeLanguage('en')">English</button>
</template>
```

## 🎯 Method 5: React Hook

```javascript
// hooks/useVisua11y.js
import { useEffect, useRef } from 'react';
import { createVisua11yAgent } from 'visua11y-agent';

export function useVisua11y(options = {}) {
  const pluginRef = useRef(null);

  useEffect(() => {
    pluginRef.current = createVisua11yAgent(options);
    
    return () => {
      // Cleanup if needed
      pluginRef.current = null;
    };
  }, []);

  return {
    setSize: (size) => pluginRef.current?.setWidgetSize(size),
    openMenu: () => pluginRef.current?.openMenu(),
    closeMenu: () => pluginRef.current?.closeMenu(),
    changeLanguage: (lang) => pluginRef.current?.changeLanguage(lang),
    getSettings: () => pluginRef.current?.getSettings()
  };
}
```

**Usage:**
```jsx
import { useVisua11y } from './hooks/useVisua11y';

function App() {
  const { setSize, openMenu, changeLanguage } = useVisua11y({
    lang: 'en',
    position: 'bottom-right'
  });

  return (
    <div>
      <button onClick={() => setSize('small')}>Small Widget</button>
      <button onClick={() => openMenu()}>Open Menu</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}
```

## 🎯 Method 6: Pinia Store (Vue)

```javascript
// stores/accessibility.js
import { defineStore } from 'pinia';
import { createVisua11yAgent } from 'visua11y-agent';

export const useAccessibilityStore = defineStore('accessibility', {
  state: () => ({
    plugin: null,
    isMenuOpen: false
  }),
  
  actions: {
    init(options = {}) {
      this.plugin = createVisua11yAgent({
        lang: 'en',
        position: 'bottom-right',
        ...options
      });
    },
    
    setSize(size) {
      this.plugin?.setWidgetSize(size);
    },
    
    openMenu() {
      this.plugin?.openMenu();
      this.isMenuOpen = true;
    },
    
    closeMenu() {
      this.plugin?.closeMenu();
      this.isMenuOpen = false;
    },
    
    changeLanguage(lang) {
      this.plugin?.changeLanguage(lang);
    },
    
    getCurrentSettings() {
      return this.plugin?.getSettings();
    }
  }
});
```

## 🎯 Method 7: React Context

```jsx
// contexts/AccessibilityContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { createVisua11yAgent } from 'visua11y-agent';

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children, options = {} }) {
  const [plugin, setPlugin] = useState(null);

  useEffect(() => {
    const instance = createVisua11yAgent({
      lang: 'en',
      position: 'bottom-right',
      ...options
    });
    setPlugin(instance);
  }, []);

  const value = {
    plugin,
    setSize: (size) => plugin?.setWidgetSize(size),
    openMenu: () => plugin?.openMenu(),
    closeMenu: () => plugin?.closeMenu(),
    changeLanguage: (lang) => plugin?.changeLanguage(lang),
    getSettings: () => plugin?.getSettings()
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
```

## ✨ Universal API Benefits

✅ **Flexible** - Choose the method that best fits your project  
✅ **Type-safe** - Full TypeScript support with autocomplete  
✅ **Framework-agnostic** - Works with Vue, React, Angular, Svelte, etc.  
✅ **Backward compatible** - Doesn't break existing code  
✅ **Tree-shakeable** - Bundlers can optimize efficiently  
✅ **SSR-friendly** - Safe for server-side rendering  
✅ **No globals required** - No need for `window` if you don't want it  

Visua11y Agent is now truly **universal**! 🚀
