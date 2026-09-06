import type { IconPickerPlacement } from "../types";

export interface PopoverPositionOptions {
  placement?: IconPickerPlacement;
  offset?: number;
  container?: HTMLElement;
}

export class PopoverPositioner {
  private reference: HTMLElement;
  private popover: HTMLElement;
  private options: Required<PopoverPositionOptions>;
  private handleUpdate: () => void;

  constructor(reference: HTMLElement, popover: HTMLElement, options: PopoverPositionOptions = {}) {
    this.reference = reference;
    this.popover = popover;
    this.options = {
      placement: options.placement || "auto",
      offset: options.offset ?? 6,
      container: options.container || document.body
    };

    this.handleUpdate = () => {
      if (this.popover.parentElement) {
        this.updatePosition();
      }
    };
  }

  public attach(): void {
    if (!this.popover.parentElement) {
      this.options.container.appendChild(this.popover);
    }
    this.updatePosition();
    window.addEventListener("resize", this.handleUpdate, { passive: true });
    window.addEventListener("scroll", this.handleUpdate, { passive: true, capture: true });
  }

  public detach(): void {
    window.removeEventListener("resize", this.handleUpdate);
    window.removeEventListener("scroll", this.handleUpdate, { capture: true });
    if (this.popover.parentElement) {
      this.popover.parentElement.removeChild(this.popover);
    }
  }

  public updatePosition(): void {
    let refRect = this.reference.getBoundingClientRect();
    if (refRect.width === 0 && refRect.height === 0) {
      const card = this.reference.closest(".menu-item-card");
      if (card) {
        const barIcon = card.querySelector<HTMLElement>(".menu-item-icon-preview");
        if (barIcon && barIcon.getBoundingClientRect().width > 0) {
          refRect = barIcon.getBoundingClientRect();
        }
      }
    }
    const popRect = this.popover.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const padding = 8;
    const offset = this.options.offset;

    const placement = this.options.placement;

    // Determine vertical direction if auto
    const spaceBelow = viewportHeight - refRect.bottom - offset - padding;
    const spaceAbove = refRect.top - offset - padding;

    let isTop: boolean;
    if (placement.startsWith("top")) {
      // flip to bottom if top has less space
      isTop = !(spaceAbove < popRect.height && spaceBelow > spaceAbove);
    } else if (placement.startsWith("bottom")) {
      // flip to top if bottom has less space
      isTop = spaceBelow < popRect.height && spaceAbove > spaceBelow;
    } else {
      // auto
      isTop = spaceBelow < 280 && spaceAbove > spaceBelow;
    }

    // Calculate Y
    let top = isTop ? refRect.top - popRect.height - offset : refRect.bottom + offset;

    // Constrain Y
    if (top < padding) {
      top = padding;
    } else if (top + popRect.height > viewportHeight - padding) {
      top = Math.max(padding, viewportHeight - popRect.height - padding);
    }

    // Calculate X
    let left = refRect.left;
    if (placement.endsWith("end")) {
      left = refRect.right - popRect.width;
    }

    // Constrain X within viewport
    if (left + popRect.width > viewportWidth - padding) {
      left = viewportWidth - popRect.width - padding;
    }
    if (left < padding) {
      left = padding;
    }

    this.popover.style.position = "fixed";
    this.popover.style.zIndex = "99999";
    this.popover.style.top = `${Math.round(top)}px`;
    this.popover.style.left = `${Math.round(left)}px`;
    this.popover.setAttribute("data-placement", isTop ? "top" : "bottom");
  }
}
