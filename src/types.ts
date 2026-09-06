export interface IconItem {
  name: string;
  className: string;
  set: string;
  keywords?: string[];
}

export interface IconSetDefinition {
  id: string;
  title: string;
  prefix: string;
  formatter?: (name: string) => string;
  icons: string[];
}

export type IconPickerTheme = "aksara" | "bootstrap" | "tailwind" | "default";
export type IconPickerPlacement = "bottom-start" | "bottom-end" | "bottom" | "top-start" | "top-end" | "top" | "auto";

export interface IconPickerOptions {
  theme?: IconPickerTheme;
  placement?: IconPickerPlacement;
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
