/**
 * Engine contract: Core must not import from src/components or src/data.
 */
import type React from 'react';
import type { PageConfig, SiteConfig, ThemeConfig, MenuConfig, ProjectState } from './kernel';

/** v1.3 strict Studio path segment (root -> leaf). */
export interface SelectionPathSegment {
  fieldKey: string;
  itemId?: string;
}

/** v1.3 strict Studio path for field/item focus synchronization. */
export type SelectionPath = SelectionPathSegment[];

/** Persistence API; defaults provided by Core, overridable by Tenant. */
export interface PersistenceConfig {
  exportJSON: (state: ProjectState, slug: string) => Promise<void>;
  exportHTML: (state: ProjectState, slug: string, cleanHtml: string) => void;
  /**
   * Optional. Save current state to repo files (e.g. POST to /api/save-to-file); server writes
   * src/data/config/*.json and src/data/pages/<slug>.json. No git push.
   */
  saveToFile?: (state: ProjectState, slug: string) => Promise<void>;
  /**
   * Optional. If provided, flushes in-memory /uploaded-assets/ blobs to disk and returns oldUrl -> newUrl map.
   * Omit when uploads write directly to disk (e.g. public/assets/images) and section data already stores final URLs.
   */
  flushUploadedAssets?: (urls: string[]) => Promise<Record<string, string>>;
}

/** Theme CSS: tenant (required), admin (optional). */
export interface ThemeCssConfig {
  tenant: string;
  admin?: string;
}

/**
 * Optional config for the "Add section" library (tenant-agnostic).
 * Section types are derived from registry/schemas; tenant can customize labels and defaults.
 */
export interface AddSectionConfig {
  /** Section types that can be added to a page (order preserved). If omitted, derived from schemas excluding header/footer. */
  addableSectionTypes?: string[];
  /** Display label per section type. If omitted, type id is humanized (e.g. "feature-grid" → "Feature grid"). */
  sectionTypeLabels?: Record<string, string>;
  /** Default data for a new section of the given type. Required for add-section to produce valid sections. */
  getDefaultSectionData?: (sectionType: string) => Record<string, unknown>;
}

/** Image entry for the Image Picker Library tab (from tenant assets or manifest). */
export interface LibraryImageEntry {
  id: string;
  url: string;
  alt: string;
  tags?: string[];
}

/** Optional config for the Image Picker (gallery from assets, save to assets). */
export interface AssetsConfig {
  /** Base URL for assets (e.g. "/assets"). Used to resolve library image URLs and display gallery. */
  assetsBaseUrl?: string;
  /** Library images for the picker "Libreria" tab. Tenant can build from public/assets or provide a static list. */
  assetsManifest?: LibraryImageEntry[];
  /** Optional: upload file to tenant assets and return the public URL. If omitted, upload tab uses data URL. */
  onAssetUpload?: (file: File) => Promise<string>;
}

/** Single entry point configuration for the JsonPages Engine. */
export interface JsonPagesConfig {
  /** Unique identifier for the tenant (used for asset resolution) */
  tenantId: string;
  /** Component map: section type -> React component. */
  registry: Record<string, React.ComponentType<unknown>>;
  /** Zod schemas map: section type -> schema. */
  schemas: Record<string, { parse: (v: unknown) => unknown; shape?: Record<string, unknown> }>;
  /** Page slug -> page config. */
  pages: Record<string, PageConfig>;
  siteConfig: SiteConfig;
  themeConfig: ThemeConfig;
  menuConfig: MenuConfig;
  /** Optional persistence; Core provides defaults if omitted. */
  persistence?: Partial<PersistenceConfig>;
  /** CSS strings for ThemeLoader. */
  themeCss: ThemeCssConfig;
  /** Optional 404 component. */
  NotFoundComponent?: React.ComponentType;
  /** Optional "Add section" library config (labels, addable types, default data). */
  addSection?: AddSectionConfig;
  /** Optional assets config for Image Picker (gallery, upload target). */
  assets?: AssetsConfig;
}