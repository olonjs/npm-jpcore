/**
 * KERNEL: The Base Contract (MTRP)
 * Core is self-contained; structural types live here.
 */
export interface BaseSectionSettings {
  [key: string]: unknown;
}

export interface SectionDataRegistry {}
export interface SectionSettingsRegistry {}

export interface BaseSection<K extends keyof SectionDataRegistry> {
  id: string;
  type: K;
  data: SectionDataRegistry[K];
  settings?: K extends keyof SectionSettingsRegistry
    ? SectionSettingsRegistry[K]
    : BaseSectionSettings;
}

/** Structural shape used when no tenant has augmented the registries. */
export interface FallbackSection {
  id: string;
  type: string;
  data: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

/** Computed union of all registered section types. */
export type Section =
  keyof SectionDataRegistry extends never
    ? FallbackSection
    : { [K in keyof SectionDataRegistry]: BaseSection<K> }[keyof SectionDataRegistry];

export type SectionType = keyof SectionDataRegistry extends never ? string : keyof SectionDataRegistry;

export interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  isCta?: boolean;
  children?: MenuItem[];
}

export interface MenuConfig {
  main: MenuItem[];
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface PageConfig {
  id: string;
  slug: string;
  meta: PageMeta;
  sections: Section[];
  /** When `false`, Core does not render the global header from `site.json` for this page. Omitted = default (show if configured). */
  'global-header'?: boolean;
}

/** Whether the global `site.json` header should be rendered for this page. */
export function shouldRenderSiteGlobalHeader(page: PageConfig, site: SiteConfig): boolean {
  return site.header != null && page['global-header'] !== false;
}

export interface SiteIdentity {
  title: string;
  logoUrl?: string;
}

export interface SitePageEntry {
  slug: string;
  label: string;
}

export interface SiteConfig {
  identity: SiteIdentity;
  header?: Section;
  footer?: Section;
  pages: SitePageEntry[];
}

export interface ThemeTokenMap {
  [key: string]: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  [key: string]: string;
}

export interface ThemeFontFamily {
  primary: string;
  mono: string;
  display?: string;
  [key: string]: string | undefined;
}

export interface ThemeTypography {
  fontFamily: ThemeFontFamily;
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  [key: string]: string;
}

export interface ThemeTokens {
  colors: ThemeColors;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
}

export interface ThemeConfig {
  name: string;
  tokens: ThemeTokens;
}

/**
 * PROJECT STATE (The Universal Data Bundle)
 * Moved to Kernel to serve as SSOT for Engine and Persistence.
 */
export interface ProjectState {
  page: PageConfig;
  site: SiteConfig;
  menu: MenuConfig;
  theme: ThemeConfig;
}

export interface PageRendererProps {
  pageConfig: PageConfig;
  siteConfig: SiteConfig;
  menuConfig: MenuConfig;
  selectedId?: string | null;
}
