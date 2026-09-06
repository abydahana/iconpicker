import type { IconPickerTheme, IconSetDefinition } from "../types";

export interface TemplateElements {
  root: HTMLElement;
  header: HTMLElement;
  searchInput: HTMLInputElement;
  searchClearBtn: HTMLButtonElement;
  tabsContainer: HTMLElement;
  body: HTMLElement;
  grid: HTMLElement;
  emptyState: HTMLElement;
  footer: HTMLElement;
  previewIcon: HTMLElement;
  previewName: HTMLElement;
  clearSelectionBtn: HTMLButtonElement;
}

export function createPopoverTemplate(
  theme: IconPickerTheme = "default",
  searchPlaceholder = "Search icons...",
  emptyText = "No icons found matching your search"
): TemplateElements {
  const root = document.createElement("div");
  root.className = `iconpicker-popover iconpicker-theme-${theme}`;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "false");

  // Header
  const header = document.createElement("div");
  header.className = "iconpicker-header";

  // Search input wrapper
  const searchWrapper = document.createElement("div");
  searchWrapper.className = "iconpicker-search-wrapper";

  const searchIcon = document.createElement("span");
  searchIcon.className = "iconpicker-search-icon";
  searchIcon.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `;

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.className = "iconpicker-search-input";
  searchInput.placeholder = searchPlaceholder;
  searchInput.autocomplete = "off";
  searchInput.spellcheck = false;

  const searchClearBtn = document.createElement("button");
  searchClearBtn.type = "button";
  searchClearBtn.className = "iconpicker-search-clear";
  searchClearBtn.title = "Clear search";
  searchClearBtn.style.display = "none";
  searchClearBtn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;

  searchWrapper.appendChild(searchIcon);
  searchWrapper.appendChild(searchInput);
  searchWrapper.appendChild(searchClearBtn);
  header.appendChild(searchWrapper);

  // Tabs container
  const tabsContainer = document.createElement("div");
  tabsContainer.className = "iconpicker-tabs";
  header.appendChild(tabsContainer);

  // Body
  const body = document.createElement("div");
  body.className = "iconpicker-body";

  const grid = document.createElement("div");
  grid.className = "iconpicker-grid";
  grid.setAttribute("role", "listbox");

  const emptyState = document.createElement("div");
  emptyState.className = "iconpicker-empty";
  emptyState.textContent = emptyText;
  emptyState.style.display = "none";

  body.appendChild(grid);
  body.appendChild(emptyState);

  // Footer
  const footer = document.createElement("div");
  footer.className = "iconpicker-footer";

  const previewWrapper = document.createElement("div");
  previewWrapper.className = "iconpicker-selected-preview";

  const previewIcon = document.createElement("i");
  previewIcon.className = "iconpicker-preview-icon";

  const previewName = document.createElement("span");
  previewName.className = "iconpicker-preview-name";
  previewName.textContent = "None selected";

  previewWrapper.appendChild(previewIcon);
  previewWrapper.appendChild(previewName);

  const clearSelectionBtn = document.createElement("button");
  clearSelectionBtn.type = "button";
  clearSelectionBtn.className = "iconpicker-btn-clear";
  clearSelectionBtn.textContent = "Clear";

  footer.appendChild(previewWrapper);
  footer.appendChild(clearSelectionBtn);

  root.appendChild(header);
  root.appendChild(body);
  root.appendChild(footer);

  return {
    root,
    header,
    searchInput,
    searchClearBtn,
    tabsContainer,
    body,
    grid,
    emptyState,
    footer,
    previewIcon,
    previewName,
    clearSelectionBtn
  };
}

export function renderTabs(
  container: HTMLElement,
  sets: IconSetDefinition[],
  activeSetId: string,
  onSelectSet: (setId: string) => void
): void {
  container.innerHTML = "";
  if (sets.length <= 1) {
    container.style.display = "none";
    return;
  }
  container.style.display = "flex";

  for (const set of sets) {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `iconpicker-tab ${set.id === activeSetId ? "is-active" : ""}`;
    tab.setAttribute("data-set-id", set.id);
    tab.title = set.title;

    const label = document.createElement("span");
    label.className = "iconpicker-tab-label";
    label.textContent = set.title;

    const count = document.createElement("span");
    count.className = "iconpicker-tab-count";
    count.textContent = `${set.icons.length}`;

    tab.appendChild(label);
    tab.appendChild(count);

    tab.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelectSet(set.id);
    });

    container.appendChild(tab);
  }
}
