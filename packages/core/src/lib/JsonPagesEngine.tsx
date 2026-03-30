/**
 * Sovereign Shell: routing, state, and Admin layout live in the Engine.
 * Enterprise: error boundary, defensive config, and safe init to avoid black screen.
 */
import React, { useEffect, useState, useCallback, useRef, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { PageRenderer } from './PageRenderer';
import { StudioProvider } from './StudioContext';
import { ConfigProvider } from './ConfigContext';
import { ThemeLoader } from './ThemeLoader';
import { AdminSidebar, type LayerItem } from '../admin/AdminSidebar';
import { StudioStage } from '../admin/StudioStage';
import { PreviewEntry } from '../admin/PreviewEntry';
import { AddSectionLibrary } from '../admin/AddSectionLibrary';
import { DefaultNotFound } from './DefaultNotFound';
import { themeManager } from '../utils/theme-manager';
import { STUDIO_EVENTS } from './events';
import type { JsonPagesConfig, SelectionPath } from './types-engine';
import type { PageConfig, SiteConfig, Section, MenuItem, ProjectState } from './kernel';
import { resolveHeaderMenuItems, resolveRuntimeConfig } from './config-resolver';
import {
  buildWebMcpToolName,
  createWebMcpToolInputSchema,
  ensureWebMcpRuntime,
  parseWebMcpToolName,
  registerWebMcpTool,
  resolveWebMcpMutationData,
  type WebMcpMutationArgs,
} from './webmcp-bridge';

import defaultAdminCss from '../admin/admin-skin.css?inline';

export interface JsonPagesEngineProps {
  config: JsonPagesConfig;
}

/** Fallback admin CSS when inline import is unavailable (e.g. SSR or bundler edge case). */
const FALLBACK_ADMIN_CSS = `
:root { --background: #0f172a; --foreground: #f1f5f9; }
body { background-color: var(--background); color: var(--foreground); }
`;

/**
 * Engine-level error boundary: prevents black screen on any render error and surfaces a visible error UI.
 */
class EngineErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[JsonPages Engine]', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>
            JsonPages Engine Error
          </h1>
          <pre
            style={{
              maxWidth: '100%',
              overflow: 'auto',
              padding: 16,
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 8,
              fontSize: 12,
              marginTop: 8,
            }}
          >
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function normalizeSlugSegments(value: string): string {
  return value
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

function resolveSlugFromPathname(pathname: string, prefix = ''): string {
  const normalizedPrefix = normalizeSlugSegments(prefix);
  const normalizedPath = pathname.replace(/\/+/g, '/');
  let remainder = normalizedPath;

  if (normalizedPrefix) {
    const prefixedPath = `/${normalizedPrefix}`;
    if (remainder === prefixedPath) {
      remainder = '/';
    } else if (remainder.startsWith(`${prefixedPath}/`)) {
      remainder = remainder.slice(prefixedPath.length);
    }
  }

  const slug = normalizeSlugSegments(remainder);
  return slug || 'home';
}

function resolvePageFromRegistry(
  pageRegistry: Record<string, PageConfig>,
  requestedSlug: string
): PageConfig | undefined {
  const normalized = normalizeSlugSegments(requestedSlug) || 'home';
  return pageRegistry[normalized];
}

function resolveMenuMainFromHeaderData(
  headerData: unknown,
  fallbackMain: MenuItem[]
): MenuItem[] {
  return resolveHeaderMenuItems(headerData, fallbackMain);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function syncHeadLink(rel: string, href: string) {
  if (typeof document === 'undefined') return;
  const selector = `link[rel="${rel}"]`;
  let link = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function syncWebMcpJsonLd(title: string, description: string, url: string) {
  if (typeof document === 'undefined') return;
  const scriptId = 'olonjs-webmcp-jsonld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
  });
}

function buildPageManifestHref(slug: string) {
  return `/mcp-manifests/${slug}.json`;
}

function buildPageContractHref(slug: string) {
  return `/schemas/${slug}.schema.json`;
}

interface VisitorRouteProps {
  pageRegistry: Record<string, PageConfig>;
  siteConfig: SiteConfig;
  menuConfig: { main: MenuItem[] };
  themeConfig: JsonPagesConfig['themeConfig'];
  refDocuments?: JsonPagesConfig['refDocuments'];
  tenantCss: string;
  adminCss: string;
  NotFoundComponent: React.ComponentType;
}

const VisitorRoute: React.FC<VisitorRouteProps> = ({
  pageRegistry,
  siteConfig,
  menuConfig,
  themeConfig,
  refDocuments,
  tenantCss,
  adminCss,
  NotFoundComponent,
}) => {
  const location = useLocation();
  const slug = resolveSlugFromPathname(location.pathname);
  const resolvedRuntime = useMemo(
    () =>
      resolveRuntimeConfig({
        pages: pageRegistry,
        siteConfig,
        themeConfig,
        menuConfig,
        refDocuments,
      }),
    [pageRegistry, siteConfig, themeConfig, menuConfig, refDocuments]
  );
  const pageConfig = resolvePageFromRegistry(resolvedRuntime.pages, slug);

  useEffect(() => {
    try {
      if (resolvedRuntime.themeConfig?.tokens) {
        themeManager.setTheme(resolvedRuntime.themeConfig);
      }
    } catch (e) {
      console.warn('[JsonPages] visitor theme resolution failed', e);
    }
  }, [resolvedRuntime.themeConfig]);

  useEffect(() => {
    if (!pageConfig) return;
    const title = typeof pageConfig.meta?.title === 'string' ? pageConfig.meta.title : slug;
    const description = typeof pageConfig.meta?.description === 'string' ? pageConfig.meta.description : '';
    syncHeadLink('mcp-manifest', buildPageManifestHref(slug));
    syncHeadLink('olon-contract', buildPageContractHref(slug));
    syncWebMcpJsonLd(title, description, slug === 'home' ? '/' : `/${slug}`);
  }, [pageConfig, slug]);

  if (!pageConfig) return <NotFoundComponent />;

  return (
    <ThemeLoader mode="tenant" tenantCss={tenantCss} adminCss={adminCss}>
      <StudioProvider mode="visitor">
        <PageRenderer
          pageConfig={pageConfig}
          siteConfig={resolvedRuntime.siteConfig}
          menuConfig={resolvedRuntime.menuConfig}
        />
      </StudioProvider>
    </ThemeLoader>
  );
};

interface StudioRouteProps {
  pageRegistry: Record<string, PageConfig>;
  schemas: JsonPagesConfig['schemas'];
  siteConfig: SiteConfig;
  menuConfig: { main: MenuItem[] };
  themeConfig: JsonPagesConfig['themeConfig'];
  refDocuments?: JsonPagesConfig['refDocuments'];
  tenantCss: string;
  adminCss: string;
  addSectionConfig: JsonPagesConfig['addSection'];
  addableSectionTypes: string[];
  webMcp?: JsonPagesConfig['webmcp'];
  saveToFile?: (state: ProjectState, slug: string) => Promise<void>;
  hotSave?: (state: ProjectState, slug: string) => Promise<void>;
  showLegacySave?: boolean;
  showHotSave?: boolean;
}

const StudioRoute: React.FC<StudioRouteProps> = ({
  pageRegistry,
  schemas,
  siteConfig,
  menuConfig,
  themeConfig,
  refDocuments,
  tenantCss,
  adminCss,
  addSectionConfig,
  addableSectionTypes,
  webMcp,
  saveToFile,
  hotSave,
  showLegacySave = true,
  showHotSave = false,
}) => {
  const location = useLocation();
  const slug = resolveSlugFromPathname(location.pathname, 'admin');
  const navigate = useNavigate();
  const pageSlugs = Object.keys(pageRegistry).sort((a, b) =>
    a === 'home' ? -1 : b === 'home' ? 1 : a.localeCompare(b)
  );
  const [draft, setDraft] = useState<PageConfig | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccessFeedback, setSaveSuccessFeedback] = useState(false);
  const [hotSaveSuccessFeedback, setHotSaveSuccessFeedback] = useState(false);
  const [hotSaveInProgress, setHotSaveInProgress] = useState(false);
  const [globalDraft, setGlobalDraft] = useState<SiteConfig>(() => {
    try {
      const base = JSON.parse(JSON.stringify(siteConfig ?? {})) as SiteConfig;
      if (!base.identity) base.identity = { title: 'Site' };
      if (!base.pages) base.pages = [];
      return base;
    } catch {
      return {
        identity: { title: 'Site' },
        pages: [],
      } as SiteConfig;
    }
  });
  const [selected, setSelected] = useState<{ id: string; type: string; scope: string } | null>(null);
  const [expandedItemPath, setExpandedItemPath] = useState<Array<{ fieldKey: string; itemId?: string }> | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [scrollToSectionId, setScrollToSectionId] = useState<string | null>(null);
  const [addSectionLibraryOpen, setAddSectionLibraryOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const resolvedRuntime = useMemo(
    () =>
      resolveRuntimeConfig({
        pages: draft ? { [slug]: draft } : {},
        siteConfig: globalDraft,
        themeConfig,
        menuConfig,
        refDocuments,
      }),
    [draft, globalDraft, themeConfig, menuConfig, refDocuments, slug]
  );
  const resolvedDraft = draft ? resolvedRuntime.pages[slug] ?? draft : null;
  const draftRef = useRef<PageConfig | null>(draft);
  const globalDraftRef = useRef<SiteConfig>(globalDraft);
  const sidebarMin = 360;
  const sidebarMax = 920;

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    globalDraftRef.current = globalDraft;
  }, [globalDraft]);

  const handleResizeStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const handleEl = e.currentTarget as HTMLElement;
    handleEl.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    const onPointerMove = (moveEvent: PointerEvent) => {
      const delta = startX - moveEvent.clientX;
      const next = Math.min(sidebarMax, Math.max(sidebarMin, startWidth + delta));
      setSidebarWidth(next);
    };
    const onPointerUp = () => {
      handleEl.releasePointerCapture(e.pointerId);
      handleEl.removeEventListener('pointermove', onPointerMove);
      handleEl.removeEventListener('pointerup', onPointerUp);
      handleEl.removeEventListener('pointercancel', onPointerUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    handleEl.addEventListener('pointermove', onPointerMove);
    handleEl.addEventListener('pointerup', onPointerUp);
    handleEl.addEventListener('pointercancel', onPointerUp);
  }, [sidebarWidth]);

  const allLayers: LayerItem[] = draft
    ? [
        ...(globalDraft.header ? [{ id: globalDraft.header.id, type: globalDraft.header.type, scope: 'global' as const, title: 'Header' }] : []),
        ...draft.sections.map((s) => ({
          id: s.id,
          type: s.type,
          scope: 'local' as const,
          title: (s.data as Record<string, unknown>)?.title as string | undefined ?? (s.data as Record<string, unknown>)?.titleHighlight as string | undefined,
        })),
        ...(globalDraft.footer ? [{ id: globalDraft.footer.id, type: globalDraft.footer.type, scope: 'global' as const, title: 'Footer' }] : []),
      ]
    : [];

  useEffect(() => {
    const data = resolvePageFromRegistry(pageRegistry, slug);
    if (data) setDraft(JSON.parse(JSON.stringify(data)));
    setSelected(null);
    setExpandedItemPath(null);
    setHasChanges(false);
  }, [slug, pageRegistry]);

  const handleResetToFile = useCallback(() => {
    const data = resolvePageFromRegistry(pageRegistry, slug);
    if (data) setDraft(JSON.parse(JSON.stringify(data)));
    setSelected(null);
    setExpandedItemPath(null);
    setHasChanges(false);
  }, [slug, pageRegistry]);

  const handleReorderSection = useCallback(
    (sectionId: string, newIndex: number, currentDraft: PageConfig) => {
      const sections = [...currentDraft.sections];
      const currentIndex = sections.findIndex((s) => s.id === sectionId);
      if (currentIndex === -1 || newIndex < 0 || newIndex >= sections.length) return;
      const [removed] = sections.splice(currentIndex, 1);
      const insertIndex = newIndex > currentIndex ? newIndex - 1 : newIndex;
      sections.splice(Math.min(insertIndex, sections.length), 0, removed);
      setDraft({ ...currentDraft, sections });
      setHasChanges(true);
    },
    []
  );

  const handleStudioMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === STUDIO_EVENTS.SECTION_SELECT) {
        setSelected(event.data.section);
        const itemPath = event.data.itemPath;
        if (Array.isArray(itemPath) && itemPath.length > 0) {
          setExpandedItemPath((itemPath as SelectionPath).map((s) => ({
            fieldKey: s.fieldKey,
            ...(s.itemId != null ? { itemId: String(s.itemId) } : {}),
          })));
        } else {
          setExpandedItemPath(null);
        }
      }
      if (event.data.type === STUDIO_EVENTS.INLINE_FIELD_UPDATE) {
        const sectionId = typeof event.data.sectionId === 'string' ? event.data.sectionId : null;
        const fieldKey = typeof event.data.fieldKey === 'string' ? event.data.fieldKey : null;
        if (sectionId && fieldKey) {
          setDraft((prev) => {
            if (!prev) return prev;
            const nextDraft: PageConfig = {
              ...prev,
              sections: prev.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      data: {
                        ...(section.data as Record<string, unknown>),
                        [fieldKey]: event.data.value,
                      },
                    } as Section
                  : section
              ),
            };
            draftRef.current = nextDraft;
            return nextDraft;
          });
          setHasChanges(true);
        }
      }
      if (event.data.type === STUDIO_EVENTS.ACTIVE_SECTION_CHANGED) {
        setActiveSectionId(event.data.activeSectionId ?? null);
      }
      if (event.data.type === 'jsonpages:section-reorder' && draftRef.current) {
        const { sectionId, newIndex } = event.data as { sectionId?: string; newIndex?: number };
        if (typeof sectionId === 'string' && typeof newIndex === 'number' && newIndex >= 0) {
          handleReorderSection(sectionId, newIndex, draftRef.current);
        }
      }
      if (event.data.type === STUDIO_EVENTS.WEBMCP_TOOL_CALL) {
        const requestId = typeof event.data.requestId === 'string' ? event.data.requestId : crypto.randomUUID();
        const toolName = typeof event.data.toolName === 'string' ? event.data.toolName : '';
        void handleWebMcpToolCall(toolName, event.data.args)
          .then((result) => {
            window.postMessage(
              { type: STUDIO_EVENTS.WEBMCP_TOOL_RESULT, requestId, toolName, result, ok: true },
              window.location.origin
            );
          })
          .catch((error: unknown) => {
            const message = error instanceof Error ? error.message : String(error);
            window.postMessage(
              {
                type: STUDIO_EVENTS.WEBMCP_TOOL_RESULT,
                requestId,
                toolName,
                ok: false,
                error: message,
              },
              window.location.origin
            );
          });
      }
    },
    [handleReorderSection, handleWebMcpToolCall]
  );

  useEffect(() => {
    window.addEventListener('message', handleStudioMessage);
    return () => window.removeEventListener('message', handleStudioMessage);
  }, [handleStudioMessage]);

  useEffect(() => {
    if (!webMcp?.enabled) return;
    ensureWebMcpRuntime();

    const currentDraft = draftRef.current;
    if (!currentDraft) return;

    const sectionTypes = Array.from(
      new Set([
        ...(globalDraftRef.current.header ? [globalDraftRef.current.header.type] : []),
        ...(globalDraftRef.current.footer ? [globalDraftRef.current.footer.type] : []),
        ...currentDraft.sections.map((section) => section.type),
      ])
    );

    const unregisterFns = sectionTypes.map((sectionType) =>
      registerWebMcpTool({
        name: buildWebMcpToolName(sectionType),
        description: `Update a ${sectionType} section in OlonJS Studio and persist immediately to file.`,
        inputSchema: createWebMcpToolInputSchema(sectionType),
        execute: (args) => handleWebMcpToolCall(buildWebMcpToolName(sectionType), args),
      })
    );

    return () => {
      for (const unregister of unregisterFns) unregister();
    };
  }, [webMcp?.enabled, slug, draft, globalDraft, handleWebMcpToolCall]);

  const handleRequestScrollToSection = useCallback((sectionId: string) => {
    const layer = allLayers.find((l) => l.id === sectionId);
    if (layer) setSelected({ id: layer.id, type: layer.type, scope: layer.scope });
    setExpandedItemPath(null);
    setScrollToSectionId(sectionId);
  }, [allLayers]);

  const handleScrollRequested = useCallback(() => {
    setScrollToSectionId(null);
  }, []);

  const handleDeleteSection = useCallback(
    (sectionId: string) => {
      setDraft((prev) => {
        if (!prev) return prev;
        return { ...prev, sections: prev.sections.filter((s) => s.id !== sectionId) };
      });
      setHasChanges(true);
      setSelected((prev) => (prev?.id === sectionId ? null : prev));
    },
    []
  );

  const handleUpdate = (newData: Record<string, unknown>) => {
    if (!selected || !draft) return;
    setHasChanges(true);
    if (selected.scope === 'global') {
      if (selected.type === 'header' && globalDraft.header != null) {
        setGlobalDraft({ ...globalDraft, header: { ...globalDraft.header, data: newData } as Section });
      } else if (selected.type === 'footer' && globalDraft.footer != null) {
        setGlobalDraft({ ...globalDraft, footer: { ...globalDraft.footer, data: newData } as Section });
      }
    } else {
      const updatedSections = draft.sections.map((s) =>
        s.id === selected.id ? ({ ...s, data: newData } as Section) : s
      );
      setDraft({ ...draft, sections: updatedSections });
    }
  };

  const handleUpdateSection = useCallback(
    (sectionId: string, scope: 'global' | 'local', _sectionType: string, newData: Record<string, unknown>) => {
      setHasChanges(true);
      if (scope === 'global') {
        if (globalDraft.header?.id === sectionId) {
          setGlobalDraft({ ...globalDraft, header: { ...globalDraft.header!, data: newData } as Section });
        } else if (globalDraft.footer?.id === sectionId) {
          setGlobalDraft({ ...globalDraft, footer: { ...globalDraft.footer!, data: newData } as Section });
        }
      } else if (draft) {
        const updatedSections = draft.sections.map((s) =>
          s.id === sectionId ? ({ ...s, data: newData } as Section) : s
        );
        setDraft({ ...draft, sections: updatedSections });
      }
    },
    [draft, globalDraft]
  );

  const requestInlineFlush = useCallback(async () => {
    const iframe = document.querySelector('iframe');
    if (!iframe?.contentWindow) return;
    const requestId = crypto.randomUUID();
    await new Promise<void>((resolve) => {
      let settled = false;
      const onMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === STUDIO_EVENTS.INLINE_FLUSHED && event.data?.requestId === requestId) {
          settled = true;
          window.removeEventListener('message', onMessage);
          resolve();
        }
      };
      window.addEventListener('message', onMessage);
      iframe.contentWindow?.postMessage({ type: STUDIO_EVENTS.REQUEST_INLINE_FLUSH, requestId }, '*');
      window.setTimeout(() => {
        if (settled) return;
        window.removeEventListener('message', onMessage);
        resolve();
      }, 400);
    });
  }, []);

  const persistProjectState = useCallback(
    async (nextDraft: PageConfig, nextGlobalDraft: SiteConfig) => {
      if (!saveToFile) {
        throw new Error('saveToFile is not configured for this tenant.');
      }

      const resolvedSaveRuntime = resolveRuntimeConfig({
        pages: { [slug]: nextDraft },
        siteConfig: nextGlobalDraft,
        themeConfig,
        menuConfig,
        refDocuments,
      });
      const headerData = resolvedSaveRuntime.siteConfig.header?.data;
      const projectState: ProjectState = {
        page: nextDraft,
        site: nextGlobalDraft,
        menu: { main: resolveMenuMainFromHeaderData(headerData, menuConfig.main) },
        theme: resolvedSaveRuntime.themeConfig,
      };

      await saveToFile(projectState, slug);
      setHasChanges(false);
      setSaveSuccessFeedback(true);
      if (typeof window !== 'undefined') {
        window.setTimeout(() => setSaveSuccessFeedback(false), 2500);
      }
    },
    [saveToFile, slug, themeConfig, menuConfig, refDocuments]
  );

  const executeWebMcpMutation = useCallback(
    async (sectionType: string, rawArgs: unknown) => {
      if (!saveToFile) {
        throw new Error('WebMCP requires saveToFile persistence in Studio mode.');
      }

      if (!isRecord(rawArgs) || typeof rawArgs.sectionId !== 'string') {
        throw new Error('WebMCP mutation requires a sectionId.');
      }

      const args = rawArgs as unknown as WebMcpMutationArgs;
      const normalizedSlug = typeof args.slug === 'string' ? normalizeSlugSegments(args.slug) : slug;
      if (normalizedSlug !== slug) {
        throw new Error(`WebMCP slug mismatch. Active Studio slug is "${slug}", received "${normalizedSlug}".`);
      }

      await requestInlineFlush();

      const currentDraft = draftRef.current;
      const currentGlobalDraft = globalDraftRef.current;
      if (!currentDraft) {
        throw new Error('Studio draft is not ready yet.');
      }

      const schema = schemas[sectionType];
      if (!schema || typeof schema.parse !== 'function') {
        throw new Error(`Missing schema for section type "${sectionType}".`);
      }

      const scope = args.scope === 'global' ? 'global' : 'local';
      let nextDraft = currentDraft;
      let nextGlobalDraft = currentGlobalDraft;

      if (scope === 'global') {
        const targetSection =
          currentGlobalDraft.header?.id === args.sectionId
            ? currentGlobalDraft.header
            : currentGlobalDraft.footer?.id === args.sectionId
              ? currentGlobalDraft.footer
              : null;

        if (!targetSection) {
          throw new Error(`Global section "${args.sectionId}" was not found.`);
        }
        if (targetSection.type !== sectionType) {
          throw new Error(`Section "${args.sectionId}" is type "${targetSection.type}", not "${sectionType}".`);
        }

        const currentData = isRecord(targetSection.data) ? targetSection.data : {};
        const nextData = resolveWebMcpMutationData(currentData, args);
        const parsedData = schema.parse(nextData) as Record<string, unknown>;
        const nextSection = { ...targetSection, data: parsedData } as Section;
        nextGlobalDraft = {
          ...currentGlobalDraft,
          ...(targetSection.type === 'header' ? { header: nextSection } : { footer: nextSection }),
        };
        globalDraftRef.current = nextGlobalDraft;
        setGlobalDraft(nextGlobalDraft);
      } else {
        const targetSection = currentDraft.sections.find((section) => section.id === args.sectionId);
        if (!targetSection) {
          throw new Error(`Local section "${args.sectionId}" was not found in page "${slug}".`);
        }
        if (targetSection.type !== sectionType) {
          throw new Error(`Section "${args.sectionId}" is type "${targetSection.type}", not "${sectionType}".`);
        }

        const currentData = isRecord(targetSection.data) ? targetSection.data : {};
        const nextData = resolveWebMcpMutationData(currentData, args);
        const parsedData = schema.parse(nextData) as Record<string, unknown>;

        nextDraft = {
          ...currentDraft,
          sections: currentDraft.sections.map((section) =>
            section.id === args.sectionId ? ({ ...section, data: parsedData } as Section) : section
          ),
        };
        draftRef.current = nextDraft;
        setDraft(nextDraft);
      }

      setSelected({ id: args.sectionId, type: sectionType, scope });
      setExpandedItemPath(Array.isArray(args.itemPath) ? args.itemPath : null);
      setHasChanges(true);

      await persistProjectState(nextDraft, nextGlobalDraft);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              ok: true,
              slug,
              sectionId: args.sectionId,
              sectionType,
              scope,
            }),
          },
        ],
        isError: false,
      };
    },
    [saveToFile, slug, requestInlineFlush, schemas, persistProjectState]
  );

  async function handleWebMcpToolCall(toolName: string, rawArgs: unknown) {
    const sectionType = parseWebMcpToolName(toolName);
    if (!sectionType) {
      throw new Error(`Unknown WebMCP tool "${toolName}".`);
    }
    return executeWebMcpMutation(sectionType, rawArgs);
  }

  const handleSaveToFile = async () => {
    if (!saveToFile) return;
    await requestInlineFlush();
    const currentDraft = draftRef.current;
    const currentGlobalDraft = globalDraftRef.current;
    if (!currentDraft) return;
    const resolvedSaveRuntime = resolveRuntimeConfig({
      pages: { [slug]: currentDraft },
      siteConfig: currentGlobalDraft,
      themeConfig,
      menuConfig,
      refDocuments,
    });
    const headerData = resolvedSaveRuntime.siteConfig.header?.data;
    const projectState: ProjectState = {
      page: currentDraft,
      site: currentGlobalDraft,
      menu: { main: resolveMenuMainFromHeaderData(headerData, menuConfig.main) },
      theme: resolvedSaveRuntime.themeConfig,
    };
    saveToFile(projectState, slug).then(() => {
      setHasChanges(false);
      setSaveSuccessFeedback(true);
      if (typeof window !== 'undefined') {
        window.setTimeout(() => setSaveSuccessFeedback(false), 2500);
      }
    }).catch((err) => {
      console.error('[JsonPages] saveToFile failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Save to file failed: ${msg}`);
    });
  };

  const handleHotSave = async () => {
    if (!hotSave) return;
    await requestInlineFlush();
    const currentDraft = draftRef.current;
    const currentGlobalDraft = globalDraftRef.current;
    if (!currentDraft) return;
    const resolvedHotSaveRuntime = resolveRuntimeConfig({
      pages: { [slug]: currentDraft },
      siteConfig: currentGlobalDraft,
      themeConfig,
      menuConfig,
      refDocuments,
    });
    const headerData = resolvedHotSaveRuntime.siteConfig.header?.data;
    const projectState: ProjectState = {
      page: currentDraft,
      site: currentGlobalDraft,
      menu: { main: resolveMenuMainFromHeaderData(headerData, menuConfig.main) },
      theme: resolvedHotSaveRuntime.themeConfig,
    };

    setHotSaveInProgress(true);
    hotSave(projectState, slug).then(() => {
      setHasChanges(false);
      setHotSaveSuccessFeedback(true);
      if (typeof window !== 'undefined') {
        window.setTimeout(() => setHotSaveSuccessFeedback(false), 2500);
      }
    }).catch((err) => {
      console.error('[JsonPages] hotSave failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Hot save failed: ${msg}`);
    }).finally(() => {
      setHotSaveInProgress(false);
    });
  };

  const handleAddSection = (sectionType: string) => {
    if (!draft) return;
    const defaultData =
      addSectionConfig?.getDefaultSectionData?.(sectionType) ?? {};
    const newSection = {
      id: crypto.randomUUID(),
      type: sectionType,
      data: defaultData,
      settings: undefined,
    } as Section;
    setDraft({
      ...draft,
      sections: [...draft.sections, newSection],
    });
    setHasChanges(true);
    setSelected({ id: newSection.id, type: sectionType, scope: 'local' });
  };

  useEffect(() => {
    const currentPage = resolvedDraft ?? draft;
    const title = typeof currentPage?.meta?.title === 'string' ? currentPage.meta.title : slug;
    const description = typeof currentPage?.meta?.description === 'string' ? currentPage.meta.description : '';
    syncHeadLink('mcp-manifest', buildPageManifestHref(slug));
    syncHeadLink('olon-contract', buildPageContractHref(slug));
    syncWebMcpJsonLd(title, description, `/admin${slug === 'home' ? '' : `/${slug}`}`);
  }, [draft, resolvedDraft, slug]);

  if (!draft) return <div>Loading Studio...</div>;

  const sidebarData =
    selected?.scope === 'global'
      ? {
          sections: [resolvedRuntime.siteConfig.header, resolvedRuntime.siteConfig.footer].filter(
            (s): s is Section => s != null
          ),
        }
      : (resolvedDraft ?? draft);

  const allSectionsData: Section[] = [
    ...(resolvedRuntime.siteConfig.header ? [resolvedRuntime.siteConfig.header] : []),
    ...((resolvedDraft ?? draft)?.sections ?? []),
    ...(resolvedRuntime.siteConfig.footer ? [resolvedRuntime.siteConfig.footer] : []),
  ];

  return (
    <ThemeLoader mode="admin" tenantCss={tenantCss} adminCss={adminCss}>
      <StudioProvider mode="studio">
        <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden">
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <main className="flex-1 min-w-0 relative bg-zinc-900/50 overflow-hidden">
              <StudioStage
                draft={resolvedDraft ?? draft}
                globalDraft={resolvedRuntime.siteConfig}
                menuConfig={resolvedRuntime.menuConfig}
                themeConfig={resolvedRuntime.themeConfig}
                slug={slug}
                selectedId={selected?.id}
                scrollToSectionId={scrollToSectionId}
                onScrollRequested={handleScrollRequested}
              />
            </main>
            <div
              className="flex shrink-0 relative h-full z-10"
              style={{ width: sidebarWidth, minWidth: sidebarMin, maxWidth: sidebarMax }}
            >
              <div
                role="separator"
                aria-label="Resize inspector"
                className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-primary/40 active:bg-primary/60 transition-colors shrink-0"
                style={{ zIndex: 9999 }}
                onPointerDown={handleResizeStart}
              />
              <AdminSidebar
                selectedSection={selected}
                pageData={sidebarData}
                allSectionsData={allSectionsData}
                onUpdate={handleUpdate}
                onUpdateSection={handleUpdateSection}
                onClose={() => { setSelected(null); setExpandedItemPath(null); }}
                expandedItemPath={expandedItemPath}
                onReorderSection={
                  draft
                    ? (sectionId, newIndex) => handleReorderSection(sectionId, newIndex, draft)
                    : undefined
                }
                allLayers={allLayers}
                activeSectionId={activeSectionId}
                onRequestScrollToSection={handleRequestScrollToSection}
                onDeleteSection={draft ? handleDeleteSection : undefined}
                onAddSection={
                  addableSectionTypes.length > 0
                    ? () => setAddSectionLibraryOpen(true)
                    : undefined
                }
                hasChanges={hasChanges}
                onSaveToFile={saveToFile != null ? handleSaveToFile : undefined}
                saveSuccessFeedback={saveSuccessFeedback}
                onHotSave={hotSave != null ? handleHotSave : undefined}
                hotSaveSuccessFeedback={hotSaveSuccessFeedback}
                hotSaveInProgress={hotSaveInProgress}
                showLegacySave={showLegacySave}
                showHotSave={showHotSave}
                onResetToFile={handleResetToFile}
                pageSlugs={pageSlugs}
                currentSlug={slug}
                onPageChange={
                  pageSlugs.length > 1
                    ? (s) => {
                        const nextSlug = normalizeSlugSegments(s);
                        navigate(nextSlug === 'home' ? '/admin' : `/admin/${nextSlug}`);
                      }
                    : undefined
                }
              />
            </div>
          </div>
          <AddSectionLibrary
            open={addSectionLibraryOpen}
            onClose={() => setAddSectionLibraryOpen(false)}
            sectionTypes={addableSectionTypes}
            sectionTypeLabels={addSectionConfig?.sectionTypeLabels}
            onSelect={handleAddSection}
          />
        </div>
      </StudioProvider>
    </ThemeLoader>
  );
};

interface PreviewRouteProps {
  tenantCss: string;
  adminCss: string;
}

const PreviewRoute: React.FC<PreviewRouteProps> = ({ tenantCss, adminCss }) => (
  <ThemeLoader mode="tenant" tenantCss={tenantCss} adminCss={adminCss}>
    <PreviewEntry />
  </ThemeLoader>
);

export function JsonPagesEngine({ config }: JsonPagesEngineProps) {
  const {
    registry = {},
    schemas = {},
    pages: pageRegistry = {},
    siteConfig,
    themeConfig,
    menuConfig,
    refDocuments,
    themeCss,
    addSection: addSectionConfig,
    NotFoundComponent = DefaultNotFound,
  } = config;

  const addableSectionTypes: string[] =
    addSectionConfig?.addableSectionTypes ??
    (Object.keys(schemas).filter((t) => t !== 'header' && t !== 'footer') as string[]);

  const persistence = {
    saveToFile: config.persistence?.saveToFile,
    hotSave: config.persistence?.hotSave,
    showLegacySave: config.persistence?.showLegacySave ?? true,
    showHotSave: config.persistence?.showHotSave ?? false,
  };

  const tenantCss =
    typeof themeCss?.tenant === 'string' ? themeCss.tenant : '';
  const adminCss =
    typeof themeCss?.admin === 'string'
      ? themeCss.admin
      : typeof defaultAdminCss === 'string'
        ? defaultAdminCss
        : FALLBACK_ADMIN_CSS;
  const baseResolvedRuntime = useMemo(
    () =>
      resolveRuntimeConfig({
        pages: pageRegistry,
        siteConfig,
        themeConfig,
        menuConfig,
        refDocuments,
      }),
    [pageRegistry, siteConfig, themeConfig, menuConfig, refDocuments]
  );

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    try {
      if (baseResolvedRuntime.themeConfig?.tokens) {
        themeManager.setTheme(baseResolvedRuntime.themeConfig);
      }
    } catch (e) {
      console.warn('[JsonPages] setTheme failed', e);
    }
    setIsReady(true);
  }, [baseResolvedRuntime.themeConfig]);

  if (!isReady) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 14,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <EngineErrorBoundary>
      <ConfigProvider
        config={{
          registry,
          schemas,
          tenantId: config.tenantId ?? 'default',
          assets: config.assets,
          overlayDisabledSectionTypes: config.overlayDisabledSectionTypes,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <VisitorRoute
                  pageRegistry={pageRegistry}
                  siteConfig={siteConfig}
                  menuConfig={menuConfig}
                  themeConfig={baseResolvedRuntime.themeConfig}
                  refDocuments={refDocuments}
                  tenantCss={tenantCss}
                  adminCss={adminCss}
                  NotFoundComponent={NotFoundComponent}
                />
              }
            />
            <Route
              path="/*"
              element={
                <VisitorRoute
                  pageRegistry={pageRegistry}
                  siteConfig={siteConfig}
                  menuConfig={menuConfig}
                  themeConfig={baseResolvedRuntime.themeConfig}
                  refDocuments={refDocuments}
                  tenantCss={tenantCss}
                  adminCss={adminCss}
                  NotFoundComponent={NotFoundComponent}
                />
              }
            />
            <Route
              path="/admin"
              element={
                <StudioRoute
                  pageRegistry={pageRegistry}
                  schemas={schemas}
                  siteConfig={siteConfig}
                  menuConfig={menuConfig}
                  themeConfig={baseResolvedRuntime.themeConfig}
                  refDocuments={refDocuments}
                  tenantCss={tenantCss}
                  adminCss={adminCss}
                  addSectionConfig={addSectionConfig}
                  addableSectionTypes={addableSectionTypes}
                  webMcp={config.webmcp}
                  saveToFile={persistence.saveToFile}
                  hotSave={persistence.hotSave}
                  showLegacySave={persistence.showLegacySave}
                  showHotSave={persistence.showHotSave}
                />
              }
            />
            <Route
              path="/admin/*"
              element={
                <StudioRoute
                  pageRegistry={pageRegistry}
                  schemas={schemas}
                  siteConfig={siteConfig}
                  menuConfig={menuConfig}
                  themeConfig={baseResolvedRuntime.themeConfig}
                  refDocuments={refDocuments}
                  tenantCss={tenantCss}
                  adminCss={adminCss}
                  addSectionConfig={addSectionConfig}
                  addableSectionTypes={addableSectionTypes}
                  webMcp={config.webmcp}
                  saveToFile={persistence.saveToFile}
                  hotSave={persistence.hotSave}
                  showLegacySave={persistence.showLegacySave}
                  showHotSave={persistence.showHotSave}
                />
              }
            />
            <Route
              path="/admin/preview"
              element={<PreviewRoute tenantCss={tenantCss} adminCss={adminCss} />}
            />
            <Route
              path="/admin/preview/*"
              element={<PreviewRoute tenantCss={tenantCss} adminCss={adminCss} />}
            />
            <Route path="*" element={<NotFoundComponent />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </EngineErrorBoundary>
  );
}