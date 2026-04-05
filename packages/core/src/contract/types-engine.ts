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
  showLegacySave?: boolean;
  showHotSave?: boolean;
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
