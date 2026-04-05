/**
 * Conceptual public surface for WebMCP/browser bridge concerns.
 *
 * The browser runtime and the published contracts still live in the same
 * package today, but this barrel gives them a clean future seam.
 */
export {
  applyValueAtSelectionPath,
  buildWebMcpToolName,
  createWebMcpToolInputSchema,
  ensureWebMcpRuntime,
  parseWebMcpMutationArgs,
  registerWebMcpTool,
  resolveWebMcpMutationData,
  type WebMcpMutationArgs,
} from '../lib/webmcp-bridge';
export {
  buildLlmsTxt,
  buildPageContract,
  buildPageContractHref,
  buildPageManifest,
  buildPageManifestHref,
  buildSiteManifest,
} from '../contract/webmcp-contracts';
export type {
  BuildPageContractInput,
  BuildSiteManifestInput,
  OlonJsPageContract,
  OlonJsPageManifest,
  OlonJsSiteManifestIndex,
  WebMcpSectionInstance,
  WebMcpToolContract,
} from '../contract/webmcp-contracts';
