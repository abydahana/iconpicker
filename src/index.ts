export * from "./types";
export * from "./core/icon-picker";
export * from "./core/popover";
export * from "./core/grid";
export * from "./core/font-loader";
export * from "./iconsets/index";

import { IconPicker } from "./core/icon-picker";
import type { IconPickerOptions } from "./types";

/**
 * Helper factory function
 */
export function createIconPicker(target: HTMLElement | string, options?: IconPickerOptions): IconPicker {
  return new IconPicker(target, options);
}

export default IconPicker;
