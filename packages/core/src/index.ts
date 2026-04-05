/**
 * @olonjs/core - Public API (legacy alias: @jsonpages/core)
 */

// Conceptual surfaces for the future split.
export * as contract from './contract';
export * as kernel from './kernel';
export * as runtime from './runtime';
export * as studio from './studio';
export * as webmcp from './webmcp';

// Flat legacy surface kept intact for current tenants.
export * from './kernel';
export * from './studio/events';
export * from './lib/utils';
export * from './runtime';
export {
  applyValueAtSelectionPath,
  buildWebMcpToolName,
  createWebMcpToolInputSchema,
  ensureWebMcpRuntime,
  parseWebMcpMutationArgs,
  registerWebMcpTool,
  resolveWebMcpMutationData,
  type WebMcpMutationArgs,
} from './webmcp';

// Utils
export { resolveAssetUrl } from './runtime/assets/asset-resolver';
export { themeManager } from './runtime/theme/theme-manager';

// Admin
export { AdminSidebar, type LayerItem, type OnUpdateSection } from './studio/admin/AdminSidebar';
export { StudioStage } from './studio/admin/StudioStage';
export { PreviewEntry } from './studio/admin/PreviewEntry';
export { AddSectionLibrary } from './studio/admin/AddSectionLibrary';
export { FormFactory } from './studio/admin/FormFactory';
export { InputWidgets, type WidgetType } from './studio/admin/InputRegistry';
