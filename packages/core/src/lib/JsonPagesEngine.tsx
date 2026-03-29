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
import { exportProjectJSON, exportBakedHTML } from './persistence';
import type { JsonPagesConfig, SelectionPath } from './types-engine';
import type { PageConfig, SiteConfig, Section, MenuItem, ProjectState } from './kernel';
import { resolveHeaderMenuItems, resolveRuntimeConfig } from './config-resolver';

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
  const [bakedState, setBakedState] = useState<ProjectState | null>(null);

  useEffect(() => {
    const bakedScript = document.getElementById('jp-baked-state');
    if (bakedScript?.textContent) {
      try {
        const state = JSON.parse(bakedScript.textContent) as ProjectState;
        setBakedState(state);
        themeManager.setTheme(state.theme);
      } catch (e) {
        console.error('Failed to parse baked state', e);
      }
    }
  }, []);

  const activePages = bakedState
    ? { [bakedState.page.slug || slug]: bakedState.page }
    : pageRegistry;
  const activeSiteConfig = bakedState ? bakedState.site : siteConfig;
  const activeMenuConfig = bakedState ? bakedState.menu : menuConfig;
  const activeThemeConfig = bakedState ? bakedState.theme : themeConfig;
  const resolvedRuntime = useMemo(
    () =>
      resolveRuntimeConfig({
        pages: activePages,
        siteConfig: activeSiteConfig,
        themeConfig: activeThemeConfig,
        menuConfig: activeMenuConfig,
        refDocuments,
      }),
    [activePages, activeSiteConfig, activeThemeConfig, activeMenuConfig, refDocuments]
  );
  const pageConfig = bakedState
    ? resolvedRuntime.pages[bakedState.page.slug || slug]
    : resolvePageFromRegistry(resolvedRuntime.pages, slug);

  useEffect(() => {
    try {
      if (resolvedRuntime.themeConfig?.tokens) {
        themeManager.setTheme(resolvedRuntime.themeConfig);
      }
    } catch (e) {
      console.warn('[JsonPages] visitor theme resolution failed', e);
    }
  }, [resolvedRuntime.themeConfig]);

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
  siteConfig: SiteConfig;
  menuConfig: { main: MenuItem[] };
  themeConfig: JsonPagesConfig['themeConfig'];
  refDocuments?: JsonPagesConfig['refDocuments'];
  tenantCss: string;
  adminCss: string;
  addSectionConfig: JsonPagesConfig['addSection'];
  addableSectionTypes: string[];
  saveToFile?: (state: ProjectState, slug: string) => Promise<void>;
  hotSave?: (state: ProjectState, slug: string) => Promise<void>;
  showLegacySave?: boolean;
  showHotSave?: boolean;
  exportHTML: (state: ProjectState, slug: string, cleanHtml: string) => void;
}

const StudioRoute: React.FC<StudioRouteProps> = ({
  pageRegistry,
  siteConfig,
  menuConfig,
  themeConfig,
  refDocuments,
  tenantCss,
  adminCss,
  addSectionConfig,
  addableSectionTypes,
  saveToFile,
  hotSave,
  showLegacySave = true,
  showHotSave = false,
  exportHTML,
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

  const handleBakeResponse = useCallback(
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
      if (event.data.type === STUDIO_EVENTS.SEND_CLEAN_HTML) {
        if (!draftRef.current) return;
        const headerData = resolvedRuntime.siteConfig.header?.data;
        const projectState: ProjectState = {
          page: draftRef.current,
          site: globalDraftRef.current,
          menu: { main: resolveMenuMainFromHeaderData(headerData, menuConfig.main) },
          theme: resolvedRuntime.themeConfig,
        };
        exportHTML(projectState, slug, event.data.html);
        setHasChanges(false);
      }
    },
    [slug, handleReorderSection, exportHTML, resolvedRuntime.siteConfig, resolvedRuntime.themeConfig, menuConfig.main]
  );

  useEffect(() => {
    window.addEventListener('message', handleBakeResponse);
    return () => window.removeEventListener('message', handleBakeResponse);
  }, [handleBakeResponse]);

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

  const triggerBake = () => {
    const iframe = document.querySelector('iframe');
    iframe?.contentWindow?.postMessage({ type: STUDIO_EVENTS.REQUEST_CLEAN_HTML }, '*');
  };

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
                onExportHTML={triggerBake}
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
    exportJSON: config.persistence?.exportJSON ?? exportProjectJSON,
    exportHTML: config.persistence?.exportHTML ?? exportBakedHTML,
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
                  siteConfig={siteConfig}
                  menuConfig={menuConfig}
                  themeConfig={baseResolvedRuntime.themeConfig}
                  refDocuments={refDocuments}
                  tenantCss={tenantCss}
                  adminCss={adminCss}
                  addSectionConfig={addSectionConfig}
                  addableSectionTypes={addableSectionTypes}
                  saveToFile={persistence.saveToFile}
                  hotSave={persistence.hotSave}
                  showLegacySave={persistence.showLegacySave}
                  showHotSave={persistence.showHotSave}
                  exportHTML={persistence.exportHTML}
                />
              }
            />
            <Route
              path="/admin/*"
              element={
                <StudioRoute
                  pageRegistry={pageRegistry}
                  siteConfig={siteConfig}
                  menuConfig={menuConfig}
                  themeConfig={baseResolvedRuntime.themeConfig}
                  refDocuments={refDocuments}
                  tenantCss={tenantCss}
                  adminCss={adminCss}
                  addSectionConfig={addSectionConfig}
                  addableSectionTypes={addableSectionTypes}
                  saveToFile={persistence.saveToFile}
                  hotSave={persistence.hotSave}
                  showLegacySave={persistence.showLegacySave}
                  showHotSave={persistence.showHotSave}
                  exportHTML={persistence.exportHTML}
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