/**
 * @olonjs/core - Public API (legacy alias: @jsonpages/core)
 */

// Conceptual surfaces for the future split.
export * as contract from './contract';
export * as kernel from './kernel';
export * as runtime from './runtime';
export * as webmcp from './webmcp';

// Flat legacy surface kept intact for current tenants.
export * from './kernel';
export * from './lib/events';
export * from './lib/utils';
export * from './runtime';
export {
  applyValueAtSelectionPath,
  buildWebMcpToolName,
  createWebMcpToolInputSchema,
  ensureWebMcpRuntime,
  registerWebMcpTool,
  resolveWebMcpMutationData,
  type WebMcpMutationArgs,
} from './lib/webmcp-bridge';

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
