# IconPicker

Floating popover icon picker with multi-pack support and real-time search.

---

## Features

- Floating popover with auto-positioning and collision flip.
- Built-in framework themes: Aksara UI, Bootstrap 5, Tailwind CSS, and Default.
- Multi-pack support: MDI, FontAwesome 6 Free, Bootstrap Icons, Tabler Icons, Remix Icon, Boxicons, and Lucide.
- Lazy chunk rendering for smooth scrolling across 7,000+ icons.
- Instant search and filtering.
- On-demand webfont loading.
- Zero runtime dependencies.

---

## Installation

```bash
npm install @abydahana/iconpicker
```

Or using yarn / pnpm:

```bash
yarn add @abydahana/iconpicker
pnpm add @abydahana/iconpicker
```

---

## Framework Integration

### 1. Aksara UI

```ts
import "@abydahana/aksara-ui/css";
import "@abydahana/iconpicker/css";
import { IconPicker } from "@abydahana/iconpicker";
```

```html
<div class="input-group input-group-sm">
  <span class="input-group-text" role="button" title="Choose icon">
    <i class="menu-item-input-icon-preview mdi mdi-view-dashboard-outline"></i>
  </span>
  <input
    type="text"
    id="menu-icon-input"
    class="form-control form-control-sm"
    value="mdi mdi-view-dashboard-outline"
    placeholder="e.g. mdi mdi-home"
  />
</div>
```

```ts
const input = document.getElementById("menu-icon-input") as HTMLInputElement;

new IconPicker(input, {
  theme: "aksara",
  iconSets: ["mdi"],
  defaultSet: "mdi",
  placement: "bottom-start",
  onSelect(icon) {
    const preview = input.parentElement?.querySelector(".menu-item-input-icon-preview");
    if (preview) {
      preview.className = `menu-item-input-icon-preview ${icon.className}`;
    }
  }
});
```

---

### 2. Bootstrap 5

```ts
import "bootstrap/dist/css/bootstrap.min.css";
import "@abydahana/iconpicker/css";
import { IconPicker } from "@abydahana/iconpicker";
```

```html
<div class="input-group">
  <span class="input-group-text">
    <i class="bi bi-star"></i>
  </span>
  <input
    type="text"
    id="bs-icon-input"
    class="form-control"
    placeholder="Select icon"
    value="bi bi-star"
  />
</div>
```

```ts
new IconPicker("#bs-icon-input", {
  theme: "bootstrap",
  iconSets: ["bi", "fa"],
  defaultSet: "bi",
  placement: "bottom-start",
  onSelect(icon) {
    console.log("Selected icon:", icon.className);
  }
});
```

---

### 3. Tailwind CSS

```css
@import "tailwindcss";
@import "@abydahana/iconpicker/css";
```

```html
<div class="relative flex items-center rounded-lg shadow-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden max-w-sm">
  <div class="flex items-center justify-center pl-3 text-slate-500">
    <i class="lucide lucide-heart text-base"></i>
  </div>
  <input
    type="text"
    id="tailwind-icon-input"
    class="w-full py-2 pl-3 pr-4 text-sm text-slate-900 dark:text-slate-100 bg-transparent border-0 focus:outline-none"
    placeholder="Pick icon..."
    value="lucide lucide-heart"
  />
</div>
```

```ts
import { IconPicker } from "@abydahana/iconpicker";

new IconPicker("#tailwind-icon-input", {
  theme: "tailwind",
  iconSets: ["lucide", "tabler", "remix"],
  defaultSet: "lucide",
  placement: "bottom-start"
});
```

---

### 4. Vanilla JavaScript / HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Icon Picker Demo</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@abydahana/iconpicker/dist/iconpicker.css" />
</head>
<body>
  <div style="margin: 40px;">
    <input type="text" id="plain-icon" placeholder="Click to choose icon..." />
  </div>

  <script type="module">
    import { IconPicker } from "https://cdn.jsdelivr.net/npm/@abydahana/iconpicker/dist/index.js";

    new IconPicker("#plain-icon", {
      theme: "default",
      iconSets: ["mdi", "bi", "boxicons"],
      defaultSet: "mdi"
    });
  </script>
</body>
</html>
```

---

## Supported Icon Sets

| Identifier | Name | Total Icons | Class Prefix / Output Format |
|---|---|---|---|
| `mdi` | Material Design Icons | 7,448 | `mdi mdi-{name}` |
| `fa` | FontAwesome 6 Free | 1,895 | `fa-solid fa-{name}` / `fa-brands fa-{name}` |
| `bi` | Bootstrap Icons | 2,050 | `bi bi-{name}` |
| `tabler` | Tabler Icons | 4,879 | `ti ti-{name}` |
| `remix` | Remix Icon | 2,892 | `ri-{name}` |
| `boxicons` | Boxicons | 814 | `bx bx-{name}` |
| `lucide` | Lucide Icons | 1,807 | `lucide lucide-{name}` |

When passing a single set (e.g. `iconSets: ["mdi"]`), the tab bar automatically hides.

---

## Options

```ts
interface IconPickerOptions {
  theme?: "aksara" | "bootstrap" | "tailwind" | "default";
  placement?: "bottom-start" | "bottom-end" | "bottom" | "top-start" | "top-end" | "top" | "auto";
  iconSets?: (string | IconSetDefinition)[];
  defaultSet?: string;
  searchPlaceholder?: string;
  value?: string;
  container?: HTMLElement | string;
  showTabs?: boolean;
  showFooter?: boolean;
  closeOnSelect?: boolean;
  emptyText?: string;
  itemsPerPage?: number;
  loadFonts?: boolean;
  fontUrls?: Record<string, string>;
  onSelect?: (icon: IconItem) => void;
  onOpen?: () => void;
  onClose?: () => void;
}
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `theme` | `string` | `'default'` | Theme preset (`'aksara'`, `'bootstrap'`, `'tailwind'`, `'default'`). |
| `placement` | `string` | `'bottom-start'` | Popover position relative to target element. |
| `iconSets` | `array` | `['mdi', 'fa', ...]` | Array of icon set IDs or custom definitions. |
| `defaultSet` | `string` | `'mdi'` | Initial active tab. |
| `searchPlaceholder` | `string` | `'Search icons...'` | Search input placeholder. |
| `value` | `string` | `''` | Initial selected class name. |
| `container` | `HTMLElement \| string` | `document.body` | Element where popover is appended. |
| `showTabs` | `boolean` | `true` | Show/hide icon set tabs (auto-hidden when <= 1 set). |
| `showFooter` | `boolean` | `true` | Show/hide selected icon preview footer. |
| `closeOnSelect` | `boolean` | `true` | Close popover when an icon is picked. |
| `emptyText` | `string` | `'No icons found...'` | Message when no search results match. |
| `itemsPerPage` | `number` | `120` | Virtualized chunk size when scrolling. |
| `loadFonts` | `boolean` | `true` | Auto-inject CDN stylesheets when switching tabs. |
| `fontUrls` | `object` | `{}` | Custom CDN font URLs per set. |
| `onSelect` | `function` | `undefined` | Callback: `(icon: IconItem) => void`. |
| `onOpen` | `function` | `undefined` | Callback when popover opens. |
| `onClose` | `function` | `undefined` | Callback when popover closes. |

---

## Methods

```ts
const picker = new IconPicker("#icon-input", options);

picker.open();
picker.close();
picker.toggle();
picker.getValue();
picker.setValue("mdi mdi-check");
picker.destroy();
```

---

## Custom Icon Sets

```ts
import { IconPicker } from "@abydahana/iconpicker";

const customSet = {
  id: "custom",
  title: "My Custom Icons",
  prefix: "app-icon-",
  formatter: (name: string) => `app-icon app-icon-${name}`,
  icons: ["home", "profile", "settings", "download"]
};

new IconPicker("#my-input", {
  iconSets: [customSet, "mdi"],
  defaultSet: "custom"
});
```

---

## License

MIT © Aby Dahana
