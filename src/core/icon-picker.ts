import type { IconItem, IconPickerOptions, IconSetDefinition } from "../types";
import { builtInIconSets } from "../iconsets/index";
import { createPopoverTemplate, renderTabs, type TemplateElements } from "../dom/template";
import { PopoverPositioner } from "./popover";
import { IconGrid } from "./grid";
import { loadIconFont } from "./font-loader";

export class IconPicker {
  private target: HTMLElement;
  private inputElement: HTMLInputElement | null = null;
  private options: Required<Omit<IconPickerOptions, "container" | "onSelect" | "onOpen" | "onClose">> & {
    container?: HTMLElement | string;
    onSelect?: (icon: IconItem) => void;
    onOpen?: () => void;
    onClose?: () => void;
  };

  private sets: IconSetDefinition[] = [];
  private activeSetId = "";
  private currentSearch = "";
  private currentValue = "";
  private isOpen = false;

  private dom: TemplateElements;
  private positioner: PopoverPositioner;
  private grid: IconGrid;

  private outsideClickListener: (e: MouseEvent) => void;
  private keydownListener: (e: KeyboardEvent) => void;
  private targetClickListener: (e: MouseEvent) => void;

  constructor(target: HTMLElement | string, options: IconPickerOptions = {}) {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) {
      throw new Error(`[IconPicker] Target element "${target}" not found.`);
    }
    this.target = el;
    if (el instanceof HTMLInputElement) {
      this.inputElement = el;
    } else {
      this.inputElement = el.querySelector<HTMLInputElement>("input");
    }

    // Resolve icon sets
    const rawSets = options.iconSets || ["mdi", "fa", "bi", "tabler", "remix", "boxicons", "lucide"];
    for (const item of rawSets) {
      if (typeof item === "string") {
        const resolved = builtInIconSets[item.toLowerCase()];
        if (resolved && !this.sets.some((s) => s.id === resolved.id)) {
          this.sets.push(resolved);
        }
      } else if (item && typeof item === "object" && item.id) {
        this.sets.push(item);
      }
    }

    if (this.sets.length === 0) {
      this.sets.push(builtInIconSets.mdi);
    }

    const defaultSetId =
      options.defaultSet && this.sets.some((s) => s.id === options.defaultSet) ? options.defaultSet : this.sets[0].id;

    this.options = {
      theme: options.theme || "default",
      placement: options.placement || "bottom-start",
      iconSets: this.sets,
      defaultSet: defaultSetId,
      searchPlaceholder: options.searchPlaceholder || "Search icons...",
      value: options.value || (this.inputElement ? this.inputElement.value : ""),
      container: options.container,
      showTabs: options.showTabs ?? true,
      showFooter: options.showFooter ?? true,
      closeOnSelect: options.closeOnSelect ?? true,
      emptyText: options.emptyText || "No icons found matching your search",
      itemsPerPage: options.itemsPerPage || 120,
      loadFonts: options.loadFonts ?? true,
      fontUrls: options.fontUrls || {},
      onSelect: options.onSelect,
      onOpen: options.onOpen,
      onClose: options.onClose
    };

    this.activeSetId = this.options.defaultSet;
    this.currentValue = this.options.value;

    if (this.options.loadFonts) {
      loadIconFont(this.activeSetId, this.options.fontUrls);
      if (this.currentValue) {
        for (const s of this.sets) {
          if (s.prefix && this.currentValue.startsWith(s.prefix)) {
            loadIconFont(s.id, this.options.fontUrls);
            break;
          }
        }
      }
    }

    // Create DOM structure
    this.dom = createPopoverTemplate(this.options.theme, this.options.searchPlaceholder, this.options.emptyText);

    if (!this.options.showFooter) {
      this.dom.footer.style.display = "none";
    }

    // Resolve container
    let containerEl = document.body;
    if (this.options.container) {
      if (typeof this.options.container === "string") {
        const c = document.querySelector<HTMLElement>(this.options.container);
        if (c) containerEl = c;
      } else if (this.options.container instanceof HTMLElement) {
        containerEl = this.options.container;
      }
    }

    // Initialize Positioner
    this.positioner = new PopoverPositioner(this.target, this.dom.root, {
      placement: this.options.placement,
      container: containerEl
    });

    // Initialize Grid
    this.grid = new IconGrid({
      container: this.dom.grid,
      bodyElement: this.dom.body,
      emptyElement: this.dom.emptyState,
      chunkSize: this.options.itemsPerPage,
      onSelect: (icon) => this.handleIconSelect(icon)
    });

    // Event listeners
    const inputGroup = this.target.closest(".input-group");

    this.outsideClickListener = (e: MouseEvent) => {
      if (!this.isOpen) return;
      const clicked = e.target as Node | null;
      if (!clicked) return;
      if (this.dom.root.contains(clicked)) return;
      if (this.target.contains(clicked)) return;
      if (inputGroup && inputGroup.contains(clicked)) return;
      const card = this.target.closest('.menu-item-card');
      const barIcon = card?.querySelector('.menu-item-icon-preview');
      if (barIcon && barIcon.contains(clicked)) return;
      this.close();
    };

    this.keydownListener = (e: KeyboardEvent) => {
      if (!this.isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        this.close();
      }
    };

    this.targetClickListener = (e: MouseEvent) => {
      e.stopPropagation();
      this.toggle();
    };

    this.bindEvents(inputGroup);
    this.updatePreview(this.currentValue);
  }

  private bindEvents(inputGroup: Element | null): void {
    this.target.addEventListener("click", this.targetClickListener);
    this.target.addEventListener("focus", () => {
      if (!this.isOpen) this.open();
    });

    const card = this.target.closest('.menu-item-card');
    if (card) {
      const barIcon = card.querySelector<HTMLElement>('.menu-item-icon-preview');
      if (barIcon) {
        barIcon.style.cursor = 'pointer';
        barIcon.setAttribute('role', 'button');
        barIcon.title = 'Click to change icon';
        barIcon.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggle();
        });
      }
    }

    if (inputGroup) {
      const addons = inputGroup.querySelectorAll<HTMLElement>('.input-group-text, button:not([type="submit"])');
      addons.forEach((addon) => {
        addon.style.cursor = "pointer";
        addon.addEventListener("click", this.targetClickListener);
      });
    }

    // Search input
    this.dom.searchInput.addEventListener("input", () => {
      const val = this.dom.searchInput.value.trim().toLowerCase();
      this.currentSearch = val;
      this.dom.searchClearBtn.style.display = val ? "flex" : "none";
      this.filterIcons();
    });

    this.dom.searchClearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.dom.searchInput.value = "";
      this.currentSearch = "";
      this.dom.searchClearBtn.style.display = "none";
      this.filterIcons();
      this.dom.searchInput.focus();
    });

    // Footer clear button
    this.dom.clearSelectionBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.setValue("");
      if (this.options.closeOnSelect) {
        this.close();
      }
    });

    // Prevent clicks inside popover from propagating to outside listener
    this.dom.root.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  private filterIcons(): void {
    const activeSet = this.sets.find((s) => s.id === this.activeSetId);
    if (!activeSet) return;

    let filtered = activeSet.icons;
    if (this.currentSearch) {
      filtered = activeSet.icons.filter((name) => name.toLowerCase().includes(this.currentSearch));
    }

    this.grid.setIcons(filtered, activeSet, this.currentValue);
  }

  private handleIconSelect(icon: IconItem): void {
    this.setValue(icon.className);
    if (this.options.onSelect) {
      this.options.onSelect(icon);
    }
    if (this.options.closeOnSelect) {
      this.close();
    }
  }

  public setValue(val: string): void {
    this.currentValue = val;
    if (this.inputElement) {
      this.inputElement.value = val;
      this.inputElement.dispatchEvent(new Event("input", { bubbles: true }));
      this.inputElement.dispatchEvent(new Event("change", { bubbles: true }));
    }
    this.updatePreview(val);
    this.grid.setSelectedValue(val);
  }

  public getValue(): string {
    return this.currentValue;
  }

  private updatePreview(val: string): void {
    if (val) {
      this.dom.previewIcon.className = `iconpicker-preview-icon ${val}`;
      this.dom.previewIcon.style.display = "inline-block";
      this.dom.previewName.textContent = val;
    } else {
      this.dom.previewIcon.className = "iconpicker-preview-icon";
      this.dom.previewIcon.style.display = "none";
      this.dom.previewName.textContent = "None selected";
    }

    // If target has an icon preview sibling, update it too
    const previewEl = this.target.parentElement?.querySelector<HTMLElement>(
      "[data-icon-preview], .icon-preview, i.input-group-text"
    );
    if (previewEl) {
      const iconTag = previewEl.tagName === "I" ? previewEl : previewEl.querySelector("i");
      if (iconTag) {
        iconTag.className = val || "mdi mdi-emoticon-outline";
      }
    }
  }

  public open(): void {
    if (this.isOpen) return;
    this.isOpen = true;

    // Render tabs if enabled
    if (this.options.showTabs) {
      renderTabs(this.dom.tabsContainer, this.sets, this.activeSetId, (setId) => {
        this.activeSetId = setId;
        if (this.options.loadFonts) {
          loadIconFont(setId, this.options.fontUrls);
        }
        renderTabs(this.dom.tabsContainer, this.sets, this.activeSetId, (s) => (this.activeSetId = s));
        this.filterIcons();
      });
    }

    // Attach to DOM and calculate position
    this.positioner.attach();
    this.filterIcons();

    requestAnimationFrame(() => {
      this.positioner.updatePosition();
    });

    setTimeout(() => {
      if (this.isOpen) {
        document.addEventListener("click", this.outsideClickListener);
      }
    }, 20);
    document.addEventListener("keydown", this.keydownListener);

    setTimeout(() => {
      this.dom.searchInput.focus();
    }, 50);

    if (this.options.onOpen) {
      this.options.onOpen();
    }
  }

  public close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.positioner.detach();
    document.removeEventListener("click", this.outsideClickListener);
    document.removeEventListener("keydown", this.keydownListener);

    if (this.options.onClose) {
      this.options.onClose();
    }
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public destroy(): void {
    this.close();
    this.target.removeEventListener("click", this.targetClickListener);
    this.grid.destroy();
    this.positioner.detach();
  }
}
