import type { IconItem, IconSetDefinition } from "../types";

export interface GridOptions {
  container: HTMLElement;
  bodyElement: HTMLElement;
  emptyElement: HTMLElement;
  chunkSize?: number;
  onSelect: (icon: IconItem) => void;
}

export class IconGrid {
  private container: HTMLElement;
  private bodyElement: HTMLElement;
  private emptyElement: HTMLElement;
  private chunkSize: number;
  private onSelect: (icon: IconItem) => void;

  private currentIcons: string[] = [];
  private currentSet: IconSetDefinition | null = null;
  private renderedCount = 0;
  private selectedValue = "";
  private scrollListener: () => void;

  constructor(options: GridOptions) {
    this.container = options.container;
    this.bodyElement = options.bodyElement;
    this.emptyElement = options.emptyElement;
    this.chunkSize = options.chunkSize || 120;
    this.onSelect = options.onSelect;

    this.scrollListener = () => {
      const { scrollTop, clientHeight, scrollHeight } = this.bodyElement;
      if (scrollTop + clientHeight >= scrollHeight - 150) {
        this.renderNextChunk();
      }
    };

    this.bodyElement.addEventListener("scroll", this.scrollListener, { passive: true });
  }

  public setIcons(icons: string[], set: IconSetDefinition, selectedValue = ""): void {
    this.currentIcons = icons;
    this.currentSet = set;
    this.selectedValue = selectedValue;
    this.renderedCount = 0;
    this.container.innerHTML = "";
    this.bodyElement.scrollTop = 0;

    if (icons.length === 0) {
      this.emptyElement.style.display = "block";
      this.container.style.display = "none";
      return;
    }

    this.emptyElement.style.display = "none";
    this.container.style.display = "grid";
    this.renderNextChunk();
  }

  public setSelectedValue(val: string): void {
    this.selectedValue = val;
    const buttons = this.container.querySelectorAll<HTMLButtonElement>(".iconpicker-item");
    for (const btn of buttons) {
      const iconClass = btn.getAttribute("data-icon-class");
      if (iconClass === val) {
        btn.classList.add("is-selected");
        btn.setAttribute("aria-selected", "true");
      } else {
        btn.classList.remove("is-selected");
        btn.removeAttribute("aria-selected");
      }
    }
  }

  private renderNextChunk(): void {
    if (!this.currentSet || this.renderedCount >= this.currentIcons.length) {
      return;
    }

    const nextBatch = this.currentIcons.slice(this.renderedCount, this.renderedCount + this.chunkSize);

    const fragment = document.createDocumentFragment();

    for (const iconName of nextBatch) {
      const className = this.currentSet.formatter
        ? this.currentSet.formatter(iconName)
        : `${this.currentSet.prefix}${iconName}`;

      const isSelected = className === this.selectedValue;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `iconpicker-item ${isSelected ? "is-selected" : ""}`;
      btn.title = iconName;
      btn.setAttribute("aria-label", iconName);
      btn.setAttribute("role", "option");
      btn.setAttribute("data-icon-name", iconName);
      btn.setAttribute("data-icon-class", className);
      if (isSelected) {
        btn.setAttribute("aria-selected", "true");
      }

      const iconEl = document.createElement("i");
      iconEl.className = className;
      iconEl.setAttribute("aria-hidden", "true");

      btn.appendChild(iconEl);

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.onSelect({
          name: iconName,
          className,
          set: this.currentSet!.id
        });
      });

      fragment.appendChild(btn);
    }

    this.container.appendChild(fragment);
    this.renderedCount += nextBatch.length;
  }

  public destroy(): void {
    this.bodyElement.removeEventListener("scroll", this.scrollListener);
  }
}
