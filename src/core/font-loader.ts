const DEFAULT_FONT_URLS: Record<string, string> = {
  mdi: "https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css",
  fa: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
  fontawesome: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
  bi: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
  bootstrap: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
  tabler: "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css",
  ti: "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css",
  remix: "https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css",
  ri: "https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css",
  boxicons: "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css",
  bx: "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
};

const loadedFonts = new Set<string>();

export function loadIconFont(setId: string, customUrls?: Record<string, string>): void {
  if (typeof document === "undefined") return;

  const normalized = setId.toLowerCase();
  const url = customUrls?.[normalized] || DEFAULT_FONT_URLS[normalized];
  if (!url || loadedFonts.has(normalized)) return;

  // Check if link already exists in head
  const selector = `link[data-iconpicker-font="${normalized}"]`;
  if (document.querySelector(selector)) {
    loadedFonts.add(normalized);
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.setAttribute("data-iconpicker-font", normalized);

  document.head.appendChild(link);
  loadedFonts.add(normalized);
}
