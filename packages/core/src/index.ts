/**
 * @olonjs/core — Public API (legacy alias: @jsonpages/core)
 */

// Lib: kernel, types, engine, renderers, context, events, utils, shared-types
export * from './lib/kernel';
export * from './lib/types-engine';
export * from './lib/events';
export * from './lib/utils';
export * from './lib/shared-types';
export { PageRenderer } from './lib/PageRenderer';
export { SectionRenderer } from './lib/SectionRenderer';
export { JsonPagesEngine } from './lib/JsonPagesEngine';
export { StudioProvider, useStudio } from './lib/StudioContext';
export { ConfigProvider, useConfig, type ConfigContextValue } from './lib/ConfigContext';
export { ThemeLoader } from './lib/ThemeLoader';
export { DefaultNotFound } from './lib/DefaultNotFound';
export {
  resolveHeaderMenuItems,
  resolveRuntimeConfig,
  resolveSectionMenuItems,
} from './lib/config-resolver';

// Utils
export { themeManager } from './utils/theme-manager';
export { resolveAssetUrl } from './utils/asset-resolver';

// Admin
export { AdminSidebar, type LayerItem, type OnUpdateSection } from './admin/AdminSidebar';
export { StudioStage } from './admin/StudioStage';
export { PreviewEntry } from './admin/PreviewEntry';
export { AddSectionLibrary } from './admin/AddSectionLibrary';
export { FormFactory } from './admin/FormFactory';
export { InputWidgets, type WidgetType } from './admin/InputRegistry';