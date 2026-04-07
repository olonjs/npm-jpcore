/**
 * Engine contract: Core must not import from src/components or src/data.
 */
import type React from 'react';
import type { MenuConfig, PageConfig, ProjectState, SiteConfig, ThemeConfig } from './kernel';

export interface SelectionPathSegment {
  fieldKey: string;
  itemId?: string;
}

export type SelectionPath = SelectionPathSegment[];

export interface PersistenceConfig {
  saveToFile?: (state: ProjectState, slug: string) => Promise<void>;
  hotSave?: (state: ProjectState, slug: string) => Promise<void>;
  coldSave?: (state: ProjectState, slug: string) => Promise<void>;
  showLocalSave?: boolean;
  showHotSave?: boolean;
  showColdSave?: boolean;
  flushUploadedAssets?: (urls: string[]) => Promise<Record<string, string>>;
}

export interface ThemeCssConfig {
  tenant: string;
  admin?: string;
}

export interface AddSectionConfig {
  addableSectionTypes?: string[];
  sectionTypeLabels?: Record<string, string>;
  getDefaultSectionData?: (sectionType: string) => Record<string, unknown>;
}

export interface LibraryImageEntry {
  id: string;
  url: string;
  alt: string;
  tags?: string[];
}

export interface AssetsConfig {
  assetsBaseUrl?: string;
  assetsManifest?: LibraryImageEntry[];
  /**
   * Uploads an image and returns the final canonical URL that must be persisted in JSON.
   *
   * Valid examples:
   * - /assets/images/foo.png
   * - /assets/tenant-a/foo.png
   * - https://cdn.example.com/foo.png
   *
   * Invalid examples:
   * - public/assets/foo.png
   * - C:\\foo\\bar.png
   * - data:image/png;base64,...
   */
  onAssetUpload?: (file: File) => Promise<string>;
}

export interface WebMcpConfig {
  enabled?: boolean;
  namespace?: string;
}

export interface JsonPagesConfig {
  tenantId: string;
  registry: Record<string, React.ComponentType<unknown>>;
  schemas: Record<string, { parse: (v: unknown) => unknown; shape?: Record<string, unknown> }>;
  pages: Record<string, PageConfig>;
  siteConfig: SiteConfig;
  themeConfig: ThemeConfig;
  menuConfig: MenuConfig;
  refDocuments?: Record<string, unknown>;
  persistence?: Partial<PersistenceConfig>;
  themeCss: ThemeCssConfig;
  NotFoundComponent?: React.ComponentType;
  addSection?: AddSectionConfig;
  assets?: AssetsConfig;
  overlayDisabledSectionTypes?: string[];
  webmcp?: WebMcpConfig;
}
