#!/bin/bash
set -e # Termina se c'è un errore

echo "Inizio ricostruzione progetto..."

mkdir -p "src"
echo "Creating src/App.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/App.tsx"
/**
 * Thin Entry Point (Tenant).
 * Data from getHydratedData (file-backed or draft); assets from public/assets/images.
 * Supports Hybrid Persistence: Local Filesystem (Dev) or Cloud Bridge (Prod).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JsonPagesEngine } from '@olonjs/core';
import type { JsonPagesConfig, LibraryImageEntry, ProjectState } from '@olonjs/core';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { addSectionConfig } from '@/lib/addSectionConfig';
import { getHydratedData } from '@/lib/draftStorage';
import type { SiteConfig, ThemeConfig, MenuConfig, PageConfig } from '@/types';
import type { DeployPhase, StepId } from '@/types/deploy';
import { DEPLOY_STEPS } from '@/lib/deploySteps';
import { startCloudSaveStream } from '@/lib/cloudSaveStream';
import siteData from '@/data/config/site.json';
import themeData from '@/data/config/theme.json';
import menuData from '@/data/config/menu.json';
import { getFilePages } from '@/lib/getFilePages';
import { DopaDrawer } from '@/components/save-drawer/DopaDrawer';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeProvider } from '@/components/ThemeProvider';

import tenantCss from './index.css?inline';

// Cloud Configuration (Injected by Vercel/Netlify Env Vars)
const CLOUD_API_URL =
  import.meta.env.VITE_OLONJS_CLOUD_URL ?? import.meta.env.VITE_JSONPAGES_CLOUD_URL;
const CLOUD_API_KEY =
  import.meta.env.VITE_OLONJS_API_KEY ?? import.meta.env.VITE_JSONPAGES_API_KEY;

const themeConfig = themeData as unknown as ThemeConfig;
const menuConfig: MenuConfig = { main: [] };
const refDocuments = {
  'menu.json': menuData,
  'config/menu.json': menuData,
  'src/data/config/menu.json': menuData,
} satisfies NonNullable<JsonPagesConfig['refDocuments']>;
const TENANT_ID = 'alpha';

const filePages = getFilePages();
const fileSiteConfig = siteData as unknown as SiteConfig;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ASSET_UPLOAD_MAX_RETRIES = 2;
const ASSET_UPLOAD_TIMEOUT_MS = 20_000;
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

interface CloudSaveUiState {
  isOpen: boolean;
  phase: DeployPhase;
  currentStepId: StepId | null;
  doneSteps: StepId[];
  progress: number;
  errorMessage?: string;
  deployUrl?: string;
}

type ContentMode = 'cloud' | 'error';
type ContentStatus = 'ok' | 'empty_namespace' | 'legacy_fallback';

type ContentResponse = {
  ok?: boolean;
  siteConfig?: unknown;
  pages?: unknown;
  items?: unknown;
  error?: string;
  code?: string;
  correlationId?: string;
  contentStatus?: ContentStatus;
  usedUnscopedFallback?: boolean;
  namespace?: string;
  namespaceMatchedKeys?: number;
};

type CachedCloudContent = {
  keyFingerprint: string;
  savedAt: number;
  siteConfig: unknown | null;
  pages: Record<string, unknown>;
};

const CLOUD_CACHE_KEY = 'jp_cloud_content_cache_v1';
const CLOUD_CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeApiBase(raw: string): string {
  return raw.trim().replace(/\/+$/, '');
}

function buildApiCandidates(raw: string): string[] {
  const base = normalizeApiBase(raw);
  const withApi = /\/api\/v1$/i.test(base) ? base : `${base}/api/v1`;
  const candidates = [withApi, base];
  return Array.from(new Set(candidates.filter(Boolean)));
}

function getInitialData() {
  return getHydratedData(TENANT_ID, filePages, fileSiteConfig);
}

function getInitialCloudSaveUiState(): CloudSaveUiState {
  return {
    isOpen: false,
    phase: 'idle',
    currentStepId: null,
    doneSteps: [],
    progress: 0,
  };
}

function stepProgress(doneSteps: StepId[]): number {
  return Math.round((doneSteps.length / DEPLOY_STEPS.length) * 100);
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function normalizeRouteSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, '-')
    .replace(/^\/+|\/+$/g, '') || 'home';
}

function coercePageConfig(slug: string, value: unknown): PageConfig | null {
  let input = value;
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }
  if (!isObjectRecord(input) || !Array.isArray(input.sections)) return null;

  const inputMeta = isObjectRecord(input.meta) ? input.meta : {};
  const normalizedSlug = asString(input.slug, slug);
  const normalizedId = asString(input.id, `${normalizedSlug}-page`);
  const title = asString(inputMeta.title, normalizedSlug);
  const description = asString(inputMeta.description, '');

  return {
    id: normalizedId,
    slug: normalizedSlug,
    meta: { title, description },
    sections: input.sections as PageConfig['sections'],
    ...(typeof input['global-header'] === 'boolean' ? { 'global-header': input['global-header'] } : {}),
  };
}

function coerceSiteConfig(value: unknown): SiteConfig | null {
  let input = value;
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }
  if (!isObjectRecord(input)) return null;
  if (!isObjectRecord(input.identity)) return null;
  if (!Array.isArray(input.pages)) return null;

  return input as unknown as SiteConfig;
}

function toPagesRecord(value: unknown): Record<string, PageConfig> | null {
  const directPage = coercePageConfig('home', value);
  if (directPage) {
    const directSlug = normalizeRouteSlug(asString(directPage.slug, 'home'));
    return { [directSlug]: { ...directPage, slug: directSlug } };
  }

  if (!isObjectRecord(value)) return null;
  const next: Record<string, PageConfig> = {};
  for (const [rawKey, payload] of Object.entries(value)) {
    const rawKeyTrimmed = rawKey.trim();
    const slugFromNamespacedKey = rawKeyTrimmed.match(/^t_[a-z0-9-]+_page_(.+)$/i)?.[1];
    const slug = normalizeRouteSlug(slugFromNamespacedKey ?? rawKeyTrimmed);
    const page = coercePageConfig(slug, payload);
    if (!page) continue;
    next[slug] = { ...page, slug };
  }
  return next;
}

function normalizePageRegistry(value: unknown): Record<string, PageConfig> {
  if (!isObjectRecord(value)) return {};
  const normalized: Record<string, PageConfig> = {};

  for (const [registrySlug, rawPageValue] of Object.entries(value)) {
    const canonicalSlug = normalizeRouteSlug(registrySlug);
    const direct = coercePageConfig(canonicalSlug, rawPageValue);
    if (direct) {
      // Canonical key comes from registry/path, not from page JSON internal slug.
      normalized[canonicalSlug] = { ...direct, slug: canonicalSlug };
      continue;
    }

    const nested = toPagesRecord(rawPageValue);
    if (nested && Object.keys(nested).length > 0) {
      Object.assign(normalized, nested);
    }
  }

  return normalized;
}

function extractContentSources(payload: ContentResponse | Record<string, unknown>): {
  pagesSource: unknown;
  siteSource: unknown;
} {
  // Canonical contract: { pages, siteConfig }
  if (isObjectRecord(payload) && isObjectRecord(payload.pages)) {
    return { pagesSource: payload.pages, siteSource: payload.siteConfig };
  }

  // Edge public JSON contract: { digest, updatedAt, items: { ... } }
  if (isObjectRecord(payload) && isObjectRecord(payload.items)) {
    const items = payload.items;
    let siteSource: unknown = null;
    const pageEntries: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(items)) {
      if (/(_config_site|config_site|config:site)$/i.test(key)) {
        siteSource = value;
        continue;
      }
      if (/(_page_|^page_|page:)/i.test(key)) {
        pageEntries[key] = value;
      }
    }
    return { pagesSource: pageEntries, siteSource };
  }

  // Raw map fallback: treat payload object itself as page map.
  return { pagesSource: payload, siteSource: null };
}

type CloudLoadFailure = {
  reasonCode: string;
  message: string;
  correlationId?: string;
};

function isCloudLoadFailure(value: unknown): value is CloudLoadFailure {
  return (
    isObjectRecord(value) &&
    typeof value.reasonCode === 'string' &&
    typeof value.message === 'string'
  );
}

function toCloudLoadFailure(value: unknown): CloudLoadFailure {
  if (isCloudLoadFailure(value)) return value;
  if (value instanceof Error) {
    return { reasonCode: 'CLOUD_LOAD_FAILED', message: value.message };
  }
  return { reasonCode: 'CLOUD_LOAD_FAILED', message: 'Cloud content unavailable.' };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function backoffDelayMs(attempt: number): number {
  const base = 250 * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 120);
  return base + jitter;
}

function logBootstrapEvent(event: string, details: Record<string, unknown>) {
  console.info('[boot]', { event, at: new Date().toISOString(), ...details });
}

function cloudFingerprint(apiBase: string, apiKey: string): string {
  return `${normalizeApiBase(apiBase)}::${apiKey.slice(-8)}`;
}

function normalizeSlugForCache(slug: string): string {
  return (
    slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9/_-]/g, '-')
      .replace(/^\/+|\/+$/g, '') || 'home'
  );
}

function readCachedCloudContent(fingerprint: string): CachedCloudContent | null {
  try {
    const raw = localStorage.getItem(CLOUD_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedCloudContent;
    if (!parsed || parsed.keyFingerprint !== fingerprint) return null;
    if (!parsed.savedAt || Date.now() - parsed.savedAt > CLOUD_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedCloudContent(entry: CachedCloudContent): void {
  try {
    localStorage.setItem(CLOUD_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // non-blocking cache path
  }
}

function buildThemeFontVarsCss(input: unknown): string {
  if (!isObjectRecord(input)) return '';
  const tokens = isObjectRecord(input.tokens) ? input.tokens : null;
  const typography = tokens && isObjectRecord(tokens.typography) ? tokens.typography : null;
  const fontFamily = typography && isObjectRecord(typography.fontFamily) ? typography.fontFamily : null;
  const primary = typeof fontFamily?.primary === 'string' ? fontFamily.primary : "'Instrument Sans', system-ui, sans-serif";
  const serif = typeof fontFamily?.serif === 'string' ? fontFamily.serif : "'Instrument Serif', Georgia, serif";
  const mono = typeof fontFamily?.mono === 'string' ? fontFamily.mono : "'JetBrains Mono', monospace";
  return `:root{--theme-font-primary:${primary};--theme-font-serif:${serif};--theme-font-mono:${mono};}`;
}

function setTenantPreviewReady(ready: boolean): void {
  if (typeof window !== 'undefined') {
    (window as Window & { __TENANT_PREVIEW_READY__?: boolean }).__TENANT_PREVIEW_READY__ = ready;
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.dataset.previewReady = ready ? '1' : '0';
  }
}

function App() {
  const isCloudMode = Boolean(CLOUD_API_URL && CLOUD_API_KEY);
  const localInitialData = useMemo(() => (isCloudMode ? null : getInitialData()), [isCloudMode]);
  const localInitialPages = useMemo(() => {
    if (!localInitialData) return {};
    const normalized = normalizePageRegistry(localInitialData.pages as unknown);
    return Object.keys(normalized).length > 0 ? normalized : localInitialData.pages;
  }, [localInitialData]);
  const [pages, setPages] = useState<Record<string, PageConfig>>(localInitialPages);

  // GitHub Pages sub-directory routing fix.
  // BrowserRouter (in @olonjs/core) has no basename and reads window.location.pathname
  // raw, including the Vite base prefix. e.g. with base '/core/', visiting
  // /core/index → resolveSlugFromPathname returns 'core/index' → no page found → 404.
  // Adding base-prefixed aliases lets the registry match without changing the URL.
  const pagesWithBaseAliases = useMemo<Record<string, PageConfig>>(() => {
    const viteBase = import.meta.env.BASE_URL; // '/core/' in prod, '/' or './' in dev
    if (!viteBase || viteBase === '/' || viteBase === './') return pages;
    const base = viteBase.replace(/^\/|\/$/g, ''); // '/core/' → 'core'
    if (!base) return pages;
    const aliased: Record<string, PageConfig> = { ...pages };
    for (const [slug, page] of Object.entries(pages)) {
      aliased[`${base}/${slug}`] = page; // 'core/docs' → docs config
      if (slug === 'home') {
        aliased[base] = page;                // /core/  → home (slug 'core')
        aliased[`${base}/index`] = page;     // /core/index → home (GH Pages index alias)
      }
    }
    return aliased;
  }, [pages]);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(
    localInitialData?.siteConfig ?? fileSiteConfig
  );
  const [assetsManifest, setAssetsManifest] = useState<LibraryImageEntry[]>([]);
  const [cloudSaveUi, setCloudSaveUi] = useState<CloudSaveUiState>(getInitialCloudSaveUiState);
  const [contentMode, setContentMode] = useState<ContentMode>('cloud');
  const [contentFallback, setContentFallback] = useState<CloudLoadFailure | null>(null);
  const [showTopProgress, setShowTopProgress] = useState(false);
  const [hasInitialCloudResolved, setHasInitialCloudResolved] = useState(!isCloudMode);
  const [bootstrapRunId, setBootstrapRunId] = useState(0);
  const activeCloudSaveController = useRef<AbortController | null>(null);
  const contentLoadInFlight = useRef<Promise<void> | null>(null);
  const pendingCloudSave = useRef<{ state: ProjectState; slug: string } | null>(null);
  const cloudApiCandidates = useMemo(
    () => (isCloudMode && CLOUD_API_URL ? buildApiCandidates(CLOUD_API_URL) : []),
    [isCloudMode, CLOUD_API_URL]
  );

  const loadAssetsManifest = useCallback(async (): Promise<void> => {
    if (isCloudMode && CLOUD_API_URL && CLOUD_API_KEY) {
      const apiBases = cloudApiCandidates.length > 0 ? cloudApiCandidates : [normalizeApiBase(CLOUD_API_URL)];
      for (const apiBase of apiBases) {
        try {
          const res = await fetch(`${apiBase}/assets/list?limit=200`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${CLOUD_API_KEY}`,
            },
          });
          const body = (await res.json().catch(() => ({}))) as { items?: LibraryImageEntry[] };
          if (!res.ok) continue;
          const items = Array.isArray(body.items) ? body.items : [];
          setAssetsManifest(items);
          return;
        } catch {
          // try next candidate
        }
      }
      setAssetsManifest([]);
      return;
    }

    fetch('/api/list-assets')
      .then((r) => (r.ok ? r.json() : []))
      .then((list: LibraryImageEntry[]) => setAssetsManifest(Array.isArray(list) ? list : []))
      .catch(() => setAssetsManifest([]));
  }, [isCloudMode, CLOUD_API_URL, CLOUD_API_KEY, cloudApiCandidates]);

  useEffect(() => {
    void loadAssetsManifest();
  }, [loadAssetsManifest]);

  useEffect(() => {
    return () => {
      activeCloudSaveController.current?.abort();
    };
  }, []);

  useEffect(() => {
    setTenantPreviewReady(false);
    return () => {
      setTenantPreviewReady(false);
    };
  }, []);

  useEffect(() => {
    if (!isCloudMode || !CLOUD_API_URL || !CLOUD_API_KEY) {
      setContentMode('cloud');
      setContentFallback(null);
      setShowTopProgress(false);
      setHasInitialCloudResolved(true);
      logBootstrapEvent('boot.local.ready', { mode: 'local' });
      return;
    }
    if (contentLoadInFlight.current) {
      return;
    }

    const controller = new AbortController();
    const maxRetryAttempts = 2;
    const startedAt = Date.now();
    const primaryApiBase = cloudApiCandidates[0] ?? normalizeApiBase(CLOUD_API_URL);
    const fingerprint = cloudFingerprint(primaryApiBase, CLOUD_API_KEY);
    const cached = readCachedCloudContent(fingerprint);
    const cachedPages = cached ? toPagesRecord(cached.pages) : null;
    const cachedSite = cached ? coerceSiteConfig(cached.siteConfig) : null;
    const hasCachedFallback = Boolean((cachedPages && Object.keys(cachedPages).length > 0) || cachedSite);
    if (cached) {
      logBootstrapEvent('boot.cloud.cache_hit', { ageMs: Date.now() - cached.savedAt });
    }
    setContentMode('cloud');
    setContentFallback(null);
    setShowTopProgress(true);
    setHasInitialCloudResolved(false);
    logBootstrapEvent('boot.start', { mode: 'cloud', apiCandidates: cloudApiCandidates.length });

    const loadCloudContent = async () => {
      try {
        let payload: ContentResponse | null = null;
        let lastFailure: CloudLoadFailure | null = null;

        for (const apiBase of cloudApiCandidates) {
          for (let attempt = 0; attempt <= maxRetryAttempts; attempt += 1) {
            try {
              const res = await fetch(`${apiBase}/content`, {
                method: 'GET',
                cache: 'no-store',
                headers: {
                  Authorization: `Bearer ${CLOUD_API_KEY}`,
                },
                signal: controller.signal,
              });

              const contentType = (res.headers.get('content-type') || '').toLowerCase();
              if (!contentType.includes('application/json')) {
                lastFailure = {
                  reasonCode: 'NON_JSON_RESPONSE',
                  message: `Non-JSON response from ${apiBase}/content`,
                };
                break;
              }

              const parsed = (await res.json().catch(() => ({}))) as ContentResponse;
              if (!res.ok) {
                lastFailure = {
                  reasonCode: parsed.code || `HTTP_${res.status}`,
                  message: parsed.error || `Cloud content read failed: ${res.status} (${apiBase}/content)`,
                  correlationId: parsed.correlationId,
                };
                if (isRetryableStatus(res.status) && attempt < maxRetryAttempts) {
                  await sleep(backoffDelayMs(attempt));
                  continue;
                }
                break;
              }

              payload = parsed;
              break;
            } catch (error: unknown) {
              if (controller.signal.aborted) throw error;
              const message = error instanceof Error ? error.message : 'Network error';
              lastFailure = {
                reasonCode: 'NETWORK_TRANSIENT',
                message: `${message} (${apiBase}/content)`,
              };
              if (attempt < maxRetryAttempts) {
                await sleep(backoffDelayMs(attempt));
                continue;
              }
            }
          }
          if (payload) {
            break;
          }
        }

        if (!payload) {
          throw (
            lastFailure || {
              reasonCode: 'CLOUD_ENDPOINT_UNREACHABLE',
              message: 'Cloud content endpoint not reachable as JSON.',
            }
          );
        }

        const { pagesSource, siteSource } = extractContentSources(payload);
        const remotePages = toPagesRecord(pagesSource);
        const remoteSite = coerceSiteConfig(siteSource);
        const remotePageCount = remotePages ? Object.keys(remotePages).length : 0;
        if (remotePageCount === 0 && !remoteSite) {
          throw {
            reasonCode: payload.contentStatus === 'empty_namespace' ? 'EMPTY_NAMESPACE' : 'EMPTY_PAYLOAD',
            message: 'Cloud payload is empty for this tenant namespace.',
            correlationId: payload.correlationId,
          } satisfies CloudLoadFailure;
        }
        if (import.meta.env.DEV) {
          console.info('[content] cloud diagnostics', {
            contentStatus: payload.contentStatus ?? 'ok',
            namespace: payload.namespace,
            namespaceMatchedKeys: payload.namespaceMatchedKeys,
            usedUnscopedFallback: payload.usedUnscopedFallback,
            correlationId: payload.correlationId,
          });
        }
        if (remotePages && remotePageCount > 0) {
          setPages(remotePages);
        }
        if (remoteSite) {
          setSiteConfig(remoteSite);
        }
        writeCachedCloudContent({
          keyFingerprint: fingerprint,
          savedAt: Date.now(),
          siteConfig: remoteSite ?? null,
          pages: (remotePages ?? {}) as Record<string, unknown>,
        });
        setContentMode('cloud');
        setContentFallback(null);
        setHasInitialCloudResolved(true);
        logBootstrapEvent('boot.cloud.success', {
          mode: 'cloud',
          elapsedMs: Date.now() - startedAt,
          contentStatus: payload.contentStatus ?? 'ok',
          correlationId: payload.correlationId ?? null,
        });
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        const failure = toCloudLoadFailure(error);
        if (hasCachedFallback) {
          if (cachedPages && Object.keys(cachedPages).length > 0) {
            setPages(cachedPages);
          }
          if (cachedSite) {
            setSiteConfig(cachedSite);
          }
          setContentMode('cloud');
          setContentFallback({
            reasonCode: 'CLOUD_REFRESH_FAILED',
            message: failure.message,
            correlationId: failure.correlationId,
          });
          setHasInitialCloudResolved(true);
        } else {
          setContentMode('error');
          setContentFallback(failure);
          setHasInitialCloudResolved(true);
        }
        logBootstrapEvent('boot.cloud.error', {
          mode: 'cloud',
          elapsedMs: Date.now() - startedAt,
          reasonCode: failure.reasonCode,
          correlationId: failure.correlationId ?? null,
        });
      }
    };

    let inFlight: Promise<void> | null = null;
    inFlight = loadCloudContent().finally(() => {
      setShowTopProgress(false);
      if (contentLoadInFlight.current === inFlight) {
        contentLoadInFlight.current = null;
      }
    });
    contentLoadInFlight.current = inFlight;
    return () => controller.abort();
  }, [isCloudMode, CLOUD_API_KEY, CLOUD_API_URL, cloudApiCandidates, bootstrapRunId]);

  const runCloudSave = useCallback(
    async (
      payload: { state: ProjectState; slug: string },
      rejectOnError: boolean
    ): Promise<void> => {
      if (!CLOUD_API_URL || !CLOUD_API_KEY) {
        const noCloudError = new Error('Cloud mode is not configured.');
        if (rejectOnError) throw noCloudError;
        return;
      }

      pendingCloudSave.current = payload;
      activeCloudSaveController.current?.abort();
      const controller = new AbortController();
      activeCloudSaveController.current = controller;

      setCloudSaveUi({
        isOpen: true,
        phase: 'running',
        currentStepId: null,
        doneSteps: [],
        progress: 0,
      });

      try {
        await startCloudSaveStream({
          apiBaseUrl: CLOUD_API_URL,
          apiKey: CLOUD_API_KEY,
          path: `src/data/pages/${payload.slug}.json`,
          content: payload.state.page,
          message: `Content update for ${payload.slug} via Visual Editor`,
          signal: controller.signal,
          onStep: (event) => {
            setCloudSaveUi((prev) => {
              if (event.status === 'running') {
                return {
                  ...prev,
                  isOpen: true,
                  phase: 'running',
                  currentStepId: event.id,
                  errorMessage: undefined,
                };
              }

              if (prev.doneSteps.includes(event.id)) {
                return prev;
              }

              const nextDone = [...prev.doneSteps, event.id];
              return {
                ...prev,
                isOpen: true,
                phase: 'running',
                currentStepId: event.id,
                doneSteps: nextDone,
                progress: stepProgress(nextDone),
              };
            });
          },
          onDone: (event) => {
            const completed = DEPLOY_STEPS.map((step) => step.id);
            setCloudSaveUi({
              isOpen: true,
              phase: 'done',
              currentStepId: 'live',
              doneSteps: completed,
              progress: 100,
              deployUrl: event.deployUrl,
            });
          },
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Cloud save failed.';
        setCloudSaveUi((prev) => ({
          ...prev,
          isOpen: true,
          phase: 'error',
          errorMessage: message,
        }));
        if (rejectOnError) throw new Error(message);
      } finally {
        if (activeCloudSaveController.current === controller) {
          activeCloudSaveController.current = null;
        }
      }
    },
    []
  );

  const closeCloudDrawer = useCallback(() => {
    setCloudSaveUi(getInitialCloudSaveUiState());
  }, []);

  const retryCloudSave = useCallback(() => {
    if (!pendingCloudSave.current) return;
    void runCloudSave(pendingCloudSave.current, false);
  }, [runCloudSave]);

  const config: JsonPagesConfig = {
    tenantId: TENANT_ID,
    registry: ComponentRegistry as JsonPagesConfig['registry'],
    schemas: SECTION_SCHEMAS as unknown as JsonPagesConfig['schemas'],
    pages: pagesWithBaseAliases,
    siteConfig,
    themeConfig,
    menuConfig,
    refDocuments,
    themeCss: { tenant: `${buildThemeFontVarsCss(themeConfig)}\n${tenantCss}` },
    addSection: addSectionConfig,
    webmcp: {
      enabled: true,
      namespace: typeof window !== 'undefined' ? window.location.href : '',
    },
    persistence: {
      async saveToFile(state: ProjectState, slug: string): Promise<void> {
        // 💻 LOCAL FILESYSTEM (development path)
        console.log(`💻 Saving ${slug} to Local Filesystem...`);
        const res = await fetch('/api/save-to-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectState: state, slug }),
        });
        
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(body.error ?? `Save to file failed: ${res.status}`);
      },
      async hotSave(state: ProjectState, slug: string): Promise<void> {
        if (!isCloudMode || !CLOUD_API_URL || !CLOUD_API_KEY) {
          throw new Error('Cloud mode is not configured for hot save.');
        }
        const apiBase = CLOUD_API_URL.replace(/\/$/, '');
        const res = await fetch(`${apiBase}/hotSave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CLOUD_API_KEY}`,
          },
          body: JSON.stringify({
            slug,
            page: state.page,
            siteConfig: state.site,
          }),
        });
        const body = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
        if (!res.ok) {
          throw new Error(body.error || body.code || `Hot save failed: ${res.status}`);
        }
        const keyFingerprint = cloudFingerprint(apiBase, CLOUD_API_KEY);
        const normalizedSlug = normalizeSlugForCache(slug);
        const existing = readCachedCloudContent(keyFingerprint);
        writeCachedCloudContent({
          keyFingerprint,
          savedAt: Date.now(),
          siteConfig: state.site ?? null,
          pages: {
            ...(existing?.pages ?? {}),
            [normalizedSlug]: state.page,
          },
        });
      },
      showLegacySave: !isCloudMode,
      showHotSave: isCloudMode,
    },
    assets: {
      assetsBaseUrl: '/assets',
      assetsManifest,
      async onAssetUpload(file: File): Promise<string> {
        if (!file.type.startsWith('image/')) throw new Error('Invalid file type.');
        if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
          throw new Error('Unsupported image format. Allowed: jpeg, png, webp, gif, avif.');
        }
        if (file.size > MAX_UPLOAD_SIZE_BYTES) throw new Error(`File too large. Max ${MAX_UPLOAD_SIZE_BYTES / 1024 / 1024}MB.`);

        if (isCloudMode && CLOUD_API_URL && CLOUD_API_KEY) {
          const apiBases = cloudApiCandidates.length > 0 ? cloudApiCandidates : [normalizeApiBase(CLOUD_API_URL)];
          let lastError: Error | null = null;
          for (const apiBase of apiBases) {
            for (let attempt = 0; attempt <= ASSET_UPLOAD_MAX_RETRIES; attempt += 1) {
              try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('filename', file.name);
                const controller = new AbortController();
                const timeout = window.setTimeout(() => controller.abort(), ASSET_UPLOAD_TIMEOUT_MS);
                const res = await fetch(`${apiBase}/assets/upload`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${CLOUD_API_KEY}`,
                    'X-Correlation-Id': crypto.randomUUID(),
                  },
                  body: formData,
                  signal: controller.signal,
                }).finally(() => window.clearTimeout(timeout));
                const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string; code?: string };
                if (res.ok && typeof body.url === 'string') {
                  await loadAssetsManifest().catch(() => undefined);
                  return body.url;
                }
                lastError = new Error(body.error || body.code || `Cloud upload failed: ${res.status}`);
                if (isRetryableStatus(res.status) && attempt < ASSET_UPLOAD_MAX_RETRIES) {
                  await sleep(backoffDelayMs(attempt));
                  continue;
                }
                break;
              } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Cloud upload failed.';
                lastError = new Error(message);
                if (attempt < ASSET_UPLOAD_MAX_RETRIES) {
                  await sleep(backoffDelayMs(attempt));
                  continue;
                }
                break;
              }
            }
          }
          throw lastError ?? new Error('Cloud upload failed.');
        }

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '');
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/upload-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, mimeType: file.type || undefined, data: base64 }),
        });
        const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok) throw new Error(body.error || `Upload failed: ${res.status}`);
        if (typeof body.url !== 'string') throw new Error('Invalid server response: missing url');
        await loadAssetsManifest().catch(() => undefined);
        return body.url;
      },
    },
  };

  const shouldRenderEngine = !isCloudMode || hasInitialCloudResolved;

  useEffect(() => {
    if (!shouldRenderEngine) {
      setTenantPreviewReady(false);
      return;
    }
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        if (!cancelled) setTenantPreviewReady(true);
      });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      setTenantPreviewReady(false);
    };
  }, [shouldRenderEngine, pages, siteConfig]);

  return (
    <ThemeProvider>
      <>
      {isCloudMode && showTopProgress ? (
        <>
          <style>
            {`@keyframes jp-top-progress-slide { 0% { transform: translateX(-120%); } 100% { transform: translateX(320%); } }`}
          </style>
          <div
            role="status"
            aria-live="polite"
            aria-label="Cloud loading progress"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              zIndex: 1300,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '32%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(88,166,255,0.15) 0%, rgba(88,166,255,0.85) 50%, rgba(88,166,255,0.15) 100%)',
                animation: 'jp-top-progress-slide 1.15s ease-in-out infinite',
                willChange: 'transform',
              }}
            />
          </div>
        </>
      ) : null}
      {isCloudMode && !hasInitialCloudResolved ? (
        <div className="fixed inset-0 z-[1290] bg-background/80 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[1600px] p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
              </div>
              <div className="space-y-3 rounded-xl border border-border/50 bg-card/60 p-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-4/6" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {shouldRenderEngine ? <JsonPagesEngine config={config} /> : null}
      {isCloudMode && (contentMode === 'error' || contentFallback?.reasonCode === 'CLOUD_REFRESH_FAILED') ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            zIndex: 1200,
            background: 'rgba(179, 65, 24, 0.92)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 12,
            maxWidth: 360,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          {contentMode === 'error' ? 'Cloud content unavailable.' : 'Cloud refresh failed, showing cached content.'}
          {contentFallback ? (
            <div style={{ opacity: 0.85, marginTop: 4 }}>
              <div>{contentFallback.message}</div>
              <div style={{ marginTop: 2 }}>
                Reason: {contentFallback.reasonCode}
                {contentFallback.correlationId ? ` | Correlation: ${contentFallback.correlationId}` : ''}
              </div>
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    contentLoadInFlight.current = null;
                    setContentMode('cloud');
                    setContentFallback(null);
                    setHasInitialCloudResolved(false);
                    setShowTopProgress(true);
                    setBootstrapRunId((prev) => prev + 1);
                  }}
                  style={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      <DopaDrawer
        isOpen={cloudSaveUi.isOpen}
        phase={cloudSaveUi.phase}
        currentStepId={cloudSaveUi.currentStepId}
        doneSteps={cloudSaveUi.doneSteps}
        progress={cloudSaveUi.progress}
        errorMessage={cloudSaveUi.errorMessage}
        deployUrl={cloudSaveUi.deployUrl}
        onClose={closeCloudDrawer}
        onRetry={retryCloudSave}
      />
      </>
    </ThemeProvider>
  );
}

export default App;


END_OF_FILE_CONTENT
mkdir -p "src/components"
echo "Creating src/components/NotFound.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/NotFound.tsx"
import React from 'react';
import { Icon } from '@/lib/IconResolver';

export const NotFound: React.FC = () => {
  return (
    <div 
      style={{
        '--local-bg': 'var(--color-background)',
        '--local-text': 'var(--color-text)',
        '--local-text-muted': 'var(--color-text-muted)',
        '--local-primary': 'var(--color-primary)',
        '--local-radius-md': 'var(--radius-md)',
      } as React.CSSProperties}
      className="min-h-screen flex flex-col items-center justify-center bg-[var(--local-bg)] px-6"
    >
      <h1 className="text-6xl font-bold text-[var(--local-text)] mb-4">404</h1>
      <p className="text-xl text-[var(--local-text-muted)] mb-8">Page not found</p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--local-radius-md)] bg-[var(--local-primary)] text-[var(--local-bg)] font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <span>Back to Home</span>
        <Icon name="arrow-right" size={16} />
      </a>
    </div>
  );
};





END_OF_FILE_CONTENT
echo "Creating src/components/OlonWordmark.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/OlonWordmark.tsx"
import { cn } from '@/lib/utils'
import { useTheme } from './ThemeProvider'

interface OlonMarkProps {
  size?: number
  className?: string
}

interface OlonWordmarkProps {
  markSize?: number
  className?: string
}

/* ── Mark only ──────────────────────────────────────────── */
export function OlonMark({ size = 32, className }: OlonMarkProps) {
  const { theme } = useTheme()

  // Dark:  nucleus = Parchment #E2D5B0 (warm, human)
  // Light: nucleus = Primary   #1E1814 (brand, on white bg)
  const nucleusFill = theme === 'dark' ? '#E2D5B0' : '#1E1814'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="olon-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8A4E0" />
          <stop offset="100%" stopColor="#5B3F9A" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" stroke="url(#olon-ring)" strokeWidth="20" />
      <circle cx="50" cy="50" r="15" fill={nucleusFill} style={{ transition: 'fill 0.2s ease' }} />
    </svg>
  )
}

/* ── Wordmark — mark + "Olon" as live SVG text (DM Serif Display) ── */
export function OlonWordmark({ markSize = 48, className }: OlonWordmarkProps) {
  const scale = markSize / 48
  const w = 168 * scale
  const h = 52 * scale

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 168 52"
      fill="none"
      overflow="visible"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="olon-wm-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8A4E0" />
          <stop offset="100%" stopColor="#5B3F9A" />
        </linearGradient>
      </defs>

      {/* Mark */}
      <circle cx="24" cy="24" r="18.24" stroke="url(#olon-wm-ring)" strokeWidth="9.6" />
      <circle cx="24" cy="24" r="7.2" fill="#E2D5B0" />

      {/* "Olon" — Merriweather via --wordmark-* tokens (style prop required for var() in SVG) */}
      <text
        x="57"
        y="38"
        fill="#E2D5B0"
        style={{
          fontFamily:           'var(--wordmark-font)',
          fontSize:             '48px',
          letterSpacing:        'var(--wordmark-tracking)',
          fontWeight:           'var(--wordmark-weight)',
          fontVariationSettings: '"wdth" var(--wordmark-width)',
        }}
      >
        Olon
      </text>
    </svg>
  )
}

END_OF_FILE_CONTENT
echo "Creating src/components/ThemeProvider.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ThemeProvider.tsx"
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
})

const STORAGE_KEY = 'olon:theme'

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light'
}

function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const fromDom = document.documentElement.getAttribute('data-theme')
  if (isTheme(fromDom)) return fromDom

  const fromStorage = window.localStorage.getItem(STORAGE_KEY)
  if (isTheme(fromStorage)) return fromStorage

  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches
  return prefersLight ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(resolveInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function setTheme(t: Theme) {
    setThemeState(t)
  }

  function toggleTheme() {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

END_OF_FILE_CONTENT
echo "Creating src/components/ThemeToggle.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ThemeToggle.tsx"
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-md',
        'text-muted-foreground hover:text-foreground hover:bg-elevated',
        'transition-colors duration-150',
        className
      )}
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}

END_OF_FILE_CONTENT
mkdir -p "src/components/cloud-ai-native-grid"
echo "Creating src/components/cloud-ai-native-grid/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cloud-ai-native-grid/View.tsx"
import type { CloudAiNativeGridData, CloudAiNativeGridSettings } from './types';

interface CloudAiNativeGridViewProps {
  data: CloudAiNativeGridData;
  settings?: CloudAiNativeGridSettings;
}

export function CloudAiNativeGridView({ data }: CloudAiNativeGridViewProps) {
  const mattersMatch = data.titleGradient.match(/^(.*)\s(MATTERS|Matters|matters)$/);
  const gradientPart = mattersMatch ? mattersMatch[1] : data.titleGradient;
  const whiteSuffix  = mattersMatch ? ` ${mattersMatch[2]}` : null;

  return (
    <section id={data.anchorId} className="max-w-4xl mx-auto px-6 mb-24 animate-fadeInUp delay-500 section-anchor">

      <h1 className="text-left text-5xl font-display font-bold mb-4 text-foreground">
        <span data-jp-field="titlePrefix">{data.titlePrefix} </span>
        <span
          className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent"
          data-jp-field="titleGradient"
        >
          {gradientPart}
        </span>
        {whiteSuffix && <span className="text-foreground">{whiteSuffix}</span>}
      </h1>
      <p
        className="text-left text-base text-muted-foreground mb-12 max-w-2xl "
        data-jp-field="description"
      >
        {data.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.cards.map((card) => (
          <article
            key={card.id ?? card.title}
            data-jp-item-id={card.id ?? card.title}
            data-jp-item-field="cards"
            className="jp-feature-card card-hover p-8 rounded-2xl"
          >
            <img
              src={card.icon.url}
              alt={card.icon.alt ?? card.title}
              className="w-10 h-10 mb-4"
              data-jp-field="icon"
            />
            <h3 className="text-xl font-display mb-3 text-foreground" data-jp-field="title">{card.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed" data-jp-field="description">{card.description}</p>
          </article>
        ))}
      </div>

    </section>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/cloud-ai-native-grid/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cloud-ai-native-grid/index.ts"
export { CloudAiNativeGridView }              from './View';
export { CloudAiNativeGridSchema, CloudAiNativeGridSettingsSchema } from './schema';
export type { CloudAiNativeGridData, CloudAiNativeGridSettings }    from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/cloud-ai-native-grid/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cloud-ai-native-grid/schema.ts"
import { z } from 'zod';
import { BaseArrayItem, BaseSectionData, ImageSelectionSchema } from '@/lib/base-schemas';

const FeatureCardSchema = BaseArrayItem.extend({
  icon:        ImageSelectionSchema.describe('ui:image-picker'),
  title:       z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const CloudAiNativeGridSchema = BaseSectionData.extend({
  titlePrefix:   z.string().describe('ui:text'),
  titleGradient: z.string().describe('ui:text'),
  description:   z.string().describe('ui:textarea'),
  cards:         z.array(FeatureCardSchema).describe('ui:list'),
});

export const CloudAiNativeGridSettingsSchema = z.object({});

END_OF_FILE_CONTENT
echo "Creating src/components/cloud-ai-native-grid/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cloud-ai-native-grid/types.ts"
import { z } from 'zod';
import { CloudAiNativeGridSchema, CloudAiNativeGridSettingsSchema } from './schema';

export type CloudAiNativeGridData     = z.infer<typeof CloudAiNativeGridSchema>;
export type CloudAiNativeGridSettings = z.infer<typeof CloudAiNativeGridSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/contact"
echo "Creating src/components/contact/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/contact/View.tsx"
import { useState, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ContactData, ContactSettings } from './types';

interface ContactViewProps {
  data: ContactData;
  settings?: ContactSettings;
}

export function Contact({ data, settings }: ContactViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const showTiers = settings?.showTiers ?? true;
  const tiers = data.tiers ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="py-24 px-6 border-t border-border section-anchor"
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-border': 'var(--border)',
      } as CSSProperties}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-start">

          {/* Left */}
          <div className="max-w-md">
            {data.label && (
              <p className="font-mono-olon text-xs font-medium tracking-label uppercase text-muted-foreground mb-5" data-jp-field="label">
                {data.label}
              </p>
            )}
            <h2 className="font-display font-normal text-foreground leading-tight tracking-tight mb-5" data-jp-field="title">
              {data.title}
              {data.titleHighlight && (
                <>
                  <br />
                  <em className="not-italic text-primary-light" data-jp-field="titleHighlight">{data.titleHighlight}</em>
                </>
              )}
            </h2>
            {data.description && (
              <p className="text-base text-muted-foreground leading-relaxed mb-10" data-jp-field="description">
                {data.description}
              </p>
            )}

            {/* Tiers */}
            {showTiers && tiers.length > 0 && (
              <div className="space-y-0 border border-border rounded-lg overflow-hidden">
                {tiers.map((tier, i) => (
                  <div
                    key={tier.id ?? tier.label}
                    data-jp-item-id={tier.id ?? tier.label}
                    data-jp-item-field="tiers"
                    className={`flex items-start gap-4 px-5 py-4 ${i < tiers.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-wide bg-primary-900 text-primary-light border border-primary-800 rounded-sm mt-0.5 shrink-0 min-w-[64px] justify-center" data-jp-field="label">
                      {tier.label}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-snug" data-jp-field="desc">{tier.desc}</p>
                      {tier.sub && (
                        <p className="text-[12px] text-muted-foreground mt-0.5" data-jp-field="sub">{tier.sub}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — form */}
          <div className="rounded-lg border border-border bg-card p-6">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-10 h-10 rounded-full bg-primary-900 border border-primary flex items-center justify-center mx-auto mb-4">
                  <ArrowRight size={15} className="text-primary-light" />
                </div>
                <p className="text-base font-medium text-foreground mb-1.5" data-jp-field="successTitle">
                  {data.successTitle ?? 'Message received'}
                </p>
                <p className="text-sm text-muted-foreground" data-jp-field="successBody">
                  {data.successBody ?? "We'll respond within one business day."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-4" data-jp-field="formTitle">
                    {data.formTitle ?? 'Get in touch'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="contact-first">First name</Label>
                    <Input id="contact-first" placeholder="Ada" required />
                  </div>
                  <div>
                    <Label htmlFor="contact-last">Last name</Label>
                    <Input id="contact-last" placeholder="Lovelace" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact-email">Work email</Label>
                  <Input id="contact-email" type="email" placeholder="ada@acme.com" required />
                </div>
                <div>
                  <Label htmlFor="contact-company">Company</Label>
                  <Input id="contact-company" placeholder="Acme Corp" />
                </div>
                <div>
                  <Label htmlFor="contact-usecase">Use case</Label>
                  <textarea
                    id="contact-usecase"
                    rows={3}
                    placeholder="Tell us about your deployment context..."
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-150 resize-none font-primary"
                  />
                </div>
                <Button type="submit" variant="accent" className="w-full">
                  Send message <ArrowRight size={14} />
                </Button>
                {data.disclaimer && (
                  <p className="text-xs text-muted-foreground text-center" data-jp-field="disclaimer">
                    {data.disclaimer}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/contact/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/contact/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/contact/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/contact/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

export const ContactTierSchema = BaseArrayItem.extend({
  label: z.string().describe('ui:text'),
  desc:  z.string().describe('ui:text'),
  sub:   z.string().optional().describe('ui:text'),
});

export const ContactSchema = BaseSectionData.extend({
  label:          z.string().optional().describe('ui:text'),
  title:          z.string().describe('ui:text'),
  titleHighlight: z.string().optional().describe('ui:text'),
  description:    z.string().optional().describe('ui:textarea'),
  tiers:          z.array(ContactTierSchema).optional().describe('ui:list'),
  formTitle:      z.string().optional().describe('ui:text'),
  successTitle:   z.string().optional().describe('ui:text'),
  successBody:    z.string().optional().describe('ui:text'),
  disclaimer:     z.string().optional().describe('ui:text'),
});

export const ContactSettingsSchema = z.object({
  showTiers: z.boolean().default(true).describe('ui:checkbox'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/contact/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/contact/types.ts"
import { z } from 'zod';
import { ContactSchema, ContactSettingsSchema } from './schema';

export type ContactData     = z.infer<typeof ContactSchema>;
export type ContactSettings = z.infer<typeof ContactSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/cta-banner"
echo "Creating src/components/cta-banner/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OlonMark } from '@/components/ui/OlonMark';
import type { CtaBannerData, CtaBannerSettings } from './types';

export const CtaBanner: React.FC<{
  data: CtaBannerData;
  settings?: CtaBannerSettings;
}> = ({ data }) => {
  return (
    <section
      id="get-started"
      className="jp-cta-banner py-32 text-center relative overflow-hidden"
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(23,99,255,.07) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <div className="relative max-w-[1040px] mx-auto px-8">

        {/* Spinning OlonMark */}
        <div
          className="w-[72px] h-[72px] mx-auto mb-9"
          style={{ animation: 'spin 22s linear infinite' }}
          aria-hidden
        >
          <OlonMark size={72} />
        </div>

        <h2
          className="font-display font-bold tracking-[-0.038em] leading-[1.1] text-foreground mx-auto mb-5"
          style={{ fontSize: 'clamp(28px, 4.5vw, 50px)', maxWidth: '620px' }}
          data-jp-field="title"
        >
          {data.title}
        </h2>

        {data.description && (
          <p
            className="text-[16px] text-muted-foreground leading-[1.65] mx-auto mb-10"
            style={{ maxWidth: '460px' }}
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

        {data.ctas && data.ctas.length > 0 && (
          <div className="flex gap-3 justify-center flex-wrap">
            {data.ctas.map((cta, idx) => (
              <Button
                key={cta.id ?? idx}
                asChild
                variant={cta.variant === 'primary' ? 'default' : 'outline'}
                size="lg"
                className={cn(
                  'gap-2 px-7',
                  cta.variant === 'primary' && 'shadow-[0_0_32px_rgba(23,99,255,.38)]'
                )}
              >
                <a
                  href={cta.href}
                  data-jp-item-id={cta.id ?? `cta-${idx}`}
                  data-jp-item-field="ctas"
                  target={cta.href?.startsWith('http') ? '_blank' : undefined}
                  rel={cta.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {cta.variant === 'primary' ? (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.8 }}>
                      <rect x="2.5" y="2" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5.5 6h5M5.5 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
                      <path d="M8 1C4.13 1 1 4.13 1 8c0 3.09 2.01 5.71 4.79 6.63.35.06.48-.15.48-.34v-1.2c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.02-.78-1.02-.64-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.93-1.56-.18-3.2-.78-3.2-3.47 0-.77.27-1.4.72-1.89-.07-.18-.31-.9.07-1.87 0 0 .59-.19 1.93.72A6.7 6.7 0 0 1 8 5.17c.6 0 1.2.08 1.76.24 1.34-.91 1.93-.72 1.93-.72.38.97.14 1.69.07 1.87.45.49.72 1.12.72 1.89 0 2.7-1.64 3.29-3.2 3.47.25.22.48.65.48 1.31v1.94c0 .19.12.4.48.34C12.99 13.71 15 11.09 15 8c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                    </svg>
                  )}
                  {cta.label}
                </a>
              </Button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/cta-banner/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/cta-banner/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/schema.ts"
import { z } from 'zod';
import { BaseSectionData, CtaSchema } from '@/lib/base-schemas';

export const CtaBannerSchema = BaseSectionData.extend({
  label:      z.string().optional().describe('ui:text'),
  title:      z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  cliCommand: z.string().optional().describe('ui:text'),
  ctas:       z.array(CtaSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/cta-banner/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { CtaBannerSchema } from './schema';

export type CtaBannerData     = z.infer<typeof CtaBannerSchema>;
export type CtaBannerSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/design-system"
echo "Creating src/components/design-system/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/design-system/View.tsx"
import { useState, useEffect, useRef } from 'react';
import { OlonMark, OlonWordmark } from '@/components/OlonWordmark';
import { cn } from '@/lib/utils';
import type { DesignSystemData, DesignSystemSettings } from './types';

interface DesignSystemViewProps {
  data: DesignSystemData;
  settings?: DesignSystemSettings;
}

const nav = [
  {
    group: 'Foundation',
    links: [
      { id: 'tokens',     label: 'Tokens' },
      { id: 'colors',     label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing',    label: 'Spacing & Radius' },
    ],
  },
  {
    group: 'Identity',
    links: [
      { id: 'mark', label: 'Mark & Logo' },
    ],
  },
  {
    group: 'Components',
    links: [
      { id: 'buttons', label: 'Button' },
      { id: 'badges',  label: 'Badge' },
      { id: 'inputs',  label: 'Input' },
      { id: 'cards',   label: 'Card' },
      { id: 'code',    label: 'Code Block' },
    ],
  },
];

const tokenRows: { group: string; rows: { name: string; varName: string; tw: string; swatch?: boolean }[] }[] = [
  {
    group: 'Backgrounds',
    rows: [
      { name: 'background', varName: '--background', tw: 'bg-background', swatch: true },
      { name: 'card', varName: '--card', tw: 'bg-card', swatch: true },
      { name: 'elevated', varName: '--elevated', tw: 'bg-elevated', swatch: true },
    ],
  },
  {
    group: 'Text',
    rows: [
      { name: 'foreground', varName: '--foreground', tw: 'text-foreground', swatch: true },
      { name: 'muted-foreground', varName: '--muted-foreground', tw: 'text-muted-foreground', swatch: true },
    ],
  },
  {
    group: 'Brand',
    rows: [
      { name: 'primary', varName: '--primary', tw: 'bg-primary / text-primary', swatch: true },
      { name: 'primary-foreground', varName: '--primary-foreground', tw: 'text-primary-foreground', swatch: true },
    ],
  },
  {
    group: 'Accent',
    rows: [
      { name: 'accent', varName: '--accent', tw: 'bg-accent / text-accent', swatch: true },
    ],
  },
  {
    group: 'Border',
    rows: [
      { name: 'border', varName: '--border', tw: 'border-border', swatch: true },
      { name: 'border-strong', varName: '--border-strong', tw: 'border-border-strong', swatch: true },
    ],
  },
  {
    group: 'Feedback',
    rows: [
      { name: 'destructive', varName: '--destructive', tw: 'bg-destructive', swatch: true },
      { name: 'success', varName: '--success', tw: 'bg-success', swatch: true },
      { name: 'warning', varName: '--warning', tw: 'bg-warning', swatch: true },
      { name: 'info', varName: '--info', tw: 'bg-info', swatch: true },
    ],
  },
  {
    group: 'Typography',
    rows: [
      { name: 'font-primary', varName: '--theme-font-primary', tw: 'font-primary' },
      { name: 'font-display', varName: '--theme-font-display', tw: 'font-display' },
      { name: 'font-mono', varName: '--theme-font-mono', tw: 'font-mono' },
    ],
  },
];

const ramp = [
  { stop: '50', varName: '--primary-50', dark: false },
  { stop: '100', varName: '--primary-100', dark: false },
  { stop: '200', varName: '--primary-200', dark: false },
  { stop: '300', varName: '--primary-300', dark: false },
  { stop: '400', varName: '--primary-400', dark: true },
  { stop: '500', varName: '--primary-500', dark: true },
  { stop: '600', varName: '--primary-600', dark: true, brand: true },
  { stop: '700', varName: '--primary-700', dark: true },
  { stop: '800', varName: '--primary-800', dark: true },
  { stop: '900', varName: '--primary-900', dark: true },
] as { stop: string; varName: string; dark: boolean; brand?: boolean }[];

const backgroundSwatches = [
  { label: 'Base', varName: '--background', tw: 'bg-background' },
  { label: 'Surface', varName: '--card', tw: 'bg-card' },
  { label: 'Elevated', varName: '--elevated', tw: 'bg-elevated' },
  { label: 'Border', varName: '--border', tw: 'border-border' },
] as const;

const feedbackSwatches = [
  { label: 'Destructive', bgVarName: '--destructive', fgVarName: '--destructive-foreground' },
  { label: 'Success', bgVarName: '--success', fgVarName: '--success-foreground' },
  { label: 'Warning', bgVarName: '--warning', fgVarName: '--warning-foreground' },
  { label: 'Info', bgVarName: '--info', fgVarName: '--info-foreground' },
] as const;

function readCssVar(varName: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || 'n/a';
}

export function DesignSystemView({ data, settings }: DesignSystemViewProps) {
  const [activeId, setActiveId] = useState('tokens');
  const [cssVars, setCssVars] = useState<Record<string, string>>(settings?.initialCssVars ?? {});
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const allVars = new Set<string>();
    tokenRows.forEach((group) => group.rows.forEach((row) => allVars.add(row.varName)));
    ramp.forEach((item) => allVars.add(item.varName));
    backgroundSwatches.forEach((item) => allVars.add(item.varName));
    allVars.add('--accent');
    feedbackSwatches.forEach((item) => {
      allVars.add(item.bgVarName);
      allVars.add(item.fgVarName);
    });

    const syncVars = () => {
      const next: Record<string, string> = {};
      for (const varName of allVars) next[varName] = readCssVar(varName);
      setCssVars(next);
    };

    syncVars();
    const observer = new MutationObserver(syncVars);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[data-ds-id]');
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.getAttribute('data-ds-id') ?? '');
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 border-r border-border bg-background z-40 overflow-y-auto">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <a href="/" className="flex items-center gap-2.5 shrink-0" aria-label="OlonJS home">
            <OlonMark size={22} />
            <span className="text-lg font-display text-accent tracking-[-0.04em] leading-none">
              {data.title ?? 'Olon'}
            </span>
          </a>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-5">
          {nav.map((section) => (
            <div key={section.group}>
              <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground px-3 mb-2">
                {section.group}
              </div>
              {section.links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={cn('nav-link w-full text-left', activeId === link.id && 'active')}
                >
                  {link.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-border">
          <div className="font-mono-olon text-[11px] text-muted-foreground">
            v1.4 · Labradorite · Merriweather Variable
          </div>
        </div>
      </aside>

      {/* Main */}
      <main ref={mainRef} className="flex-1 lg:ml-60 px-6 lg:px-12 py-12 max-w-4xl">

        {/* Page header */}
        <div className="mb-16">
          <div className="inline-flex items-center text-[11px] font-medium tracking-[0.1em] uppercase text-primary-light bg-primary-900 border border-primary px-3 py-1 rounded-sm mb-6">
            Design System
          </div>
          <div className="mb-3">
            <OlonWordmark markSize={64} />
          </div>
          <p className="font-display text-2xl font-normal text-primary-light tracking-[-0.01em] mb-3">
            Design Language
          </p>
          <p className="text-muted-foreground text-[15px] max-w-lg leading-relaxed">
            A contract layer for the agentic web — and a design system built to communicate it.
            Every token, component, and decision is grounded in the concept of the holon:
            whole in itself, part of something greater.
          </p>
        </div>

        <hr className="ds-divider mb-16" />

        {/* TOKENS */}
        <section id="tokens" data-ds-id="tokens" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Token Reference</h2>
            <p className="text-sm text-muted-foreground">
              All tokens defined in{' '}
              <code className="code-inline">theme.json</code>
              {' '}and bridged via{' '}
              <code className="code-inline">index.css</code>.
            </p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-elevated border-b border-border">
                  {['Token', 'CSS var', 'Value', 'Tailwind class'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokenRows.map((group) => (
                  <>
                    <tr key={group.group} className="border-b border-border">
                      <td colSpan={4} className="px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground bg-card">
                        {group.group}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.name} className="border-b border-border hover:bg-elevated transition-colors">
                        <td className="px-4 py-3 text-foreground font-medium text-sm">{row.name}</td>
                        <td className="px-4 py-3 font-mono-olon text-xs text-primary-light">{row.varName}</td>
                        <td className="px-4 py-3 font-mono-olon text-xs text-muted-foreground">
                          <span className="flex items-center gap-2">
                            {row.swatch && (
                              <span className="inline-block w-3 h-3 rounded-sm border border-border-strong shrink-0" style={{ background: `var(${row.varName})` }} />
                            )}
                            {cssVars[row.varName] ?? 'n/a'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono-olon text-xs text-accent">{row.tw}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* COLORS */}
        <section id="colors" data-ds-id="colors" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Color System</h2>
            <p className="text-sm text-muted-foreground">Labradorite brand ramp + semantic layer. Dark-first. Every stop has a role.</p>
          </div>
          <div className="mb-6">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Backgrounds</div>
            <div className="grid grid-cols-4 gap-2">
              {backgroundSwatches.map((s) => (
                <div key={s.label}>
                  <div className="h-14 rounded-md border border-border-strong" style={{ background: `var(${s.varName})` }} />
                  <div className="mt-2">
                    <div className="text-xs font-medium text-foreground">{s.label}</div>
                    <div className="font-mono-olon text-[11px] text-muted-foreground">{cssVars[s.varName] ?? 'n/a'}</div>
                    <div className="font-mono-olon text-[10px] text-primary-light">{s.tw}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Brand Ramp — Labradorite</div>
            <div className="flex rounded-lg overflow-hidden h-16 border border-border">
              {ramp.map((s) => (
                <div key={s.stop} className="flex-1 flex flex-col justify-end p-1.5 relative" style={{ background: `var(${s.varName})` }}>
                  <span className="font-mono-olon text-[9px] font-medium" style={{ color: s.dark ? '#EDE8F8' : '#3D2770' }}>
                    {s.stop}
                  </span>
                  {s.brand && (
                    <span className="absolute top-1 right-1 text-[8px] font-medium text-primary-200 font-mono-olon">brand</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Accent — Parchment</div>
              <div className="h-14 rounded-md border border-border" style={{ background: 'var(--accent)' }} />
              <div className="mt-2">
                <div className="text-xs font-medium text-foreground">Accent</div>
                <div className="font-mono-olon text-[11px] text-muted-foreground">{cssVars['--accent'] ?? 'n/a'}</div>
                <div className="font-mono-olon text-[10px] text-primary-light">text-accent</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Feedback</div>
              <div className="space-y-2">
                {feedbackSwatches.map((f) => (
                  <div key={f.label} className="flex items-center gap-3 px-3 py-2 rounded-md" style={{ background: `var(${f.bgVarName})` }}>
                    <span className="text-[12px] font-medium" style={{ color: `var(${f.fgVarName})` }}>{f.label}</span>
                    <span className="font-mono-olon text-[10px] ml-auto" style={{ color: `var(${f.fgVarName})` }}>
                      {cssVars[f.bgVarName] ?? 'n/a'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* TYPOGRAPHY */}
        <section id="typography" data-ds-id="typography" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Typography</h2>
            <p className="text-sm text-muted-foreground">Three typefaces, three voices. Built on contrast.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 mb-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">Display · font-display</div>
                <div className="text-sm font-medium text-foreground">Merriweather Variable</div>
              </div>
              <span className="font-mono-olon text-[11px] text-muted-foreground border border-border px-2 py-1 rounded-sm">Google Fonts</span>
            </div>
            <div className="space-y-4 border-t border-border pt-5">
              <div className="font-display text-5xl font-normal text-foreground leading-none">The contract layer</div>
              <div className="font-display text-3xl font-normal text-primary-light leading-tight italic">for the agentic web.</div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 mb-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">UI · font-primary</div>
                <div className="text-sm font-medium text-foreground">Geist</div>
              </div>
              <span className="font-mono-olon text-[11px] text-muted-foreground border border-border px-2 py-1 rounded-sm">400 · 500</span>
            </div>
            <div className="border-t border-border pt-5">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><div className="text-[10px] text-muted-foreground mb-2">15px / 400</div><div className="text-foreground">Machine-readable endpoints.</div></div>
                <div><div className="text-[10px] text-muted-foreground mb-2">13px / 500</div><div className="text-[13px] font-medium text-foreground">Schema contracts.</div></div>
                <div><div className="text-[10px] text-muted-foreground mb-2">11px / 400 · muted</div><div className="text-[11px] text-muted-foreground">Governance, audit.</div></div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">Code · font-mono</div>
                <div className="text-sm font-medium text-foreground">Geist Mono</div>
              </div>
            </div>
            <div className="border-t border-border pt-5 space-y-1.5">
              <div className="font-mono-olon text-sm"><span className="syntax-keyword">import</span> <span className="text-accent">Olon</span> <span className="syntax-keyword">from</span> <span className="syntax-string">'olonjs'</span></div>
              <div className="font-mono-olon text-sm text-muted-foreground"><span className="syntax-keyword">const</span> <span className="text-foreground">page</span> = <span className="text-accent">Olon</span>.<span className="text-primary-light">contract</span>(<span className="syntax-string">'/about.json'</span>)</div>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* SPACING & RADIUS */}
        <section id="spacing" data-ds-id="spacing" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Spacing & Radius</h2>
            <p className="text-sm text-muted-foreground">Radius scale is deliberate — corners communicate hierarchy.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { token: 'radius-sm · 4px',  r: 4,  desc: 'Badges, tags, chips.' },
              { token: 'radius-md · 8px',  r: 8,  desc: 'Inputs, buttons, inline.' },
              { token: 'radius-lg · 12px', r: 12, desc: 'Cards, panels, modals.' },
            ].map((item) => (
              <div key={item.r} className="rounded-lg border border-border bg-card p-5">
                <div className="w-full h-14 border border-primary bg-primary-900 mb-4" style={{ borderRadius: item.r }} />
                <div className="font-mono-olon text-xs text-primary-light mb-1">{item.token}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* MARK & LOGO */}
        <section id="mark" data-ds-id="mark" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Mark & Logo</h2>
            <p className="text-sm text-muted-foreground">The mark is a holon: a nucleus held inside a ring. Two circles, one concept.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg border border-border bg-card p-8 flex flex-col items-center gap-4">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">Mark · Dark</div>
              <OlonMark size={64} />
            </div>
            <div className="rounded-lg border border-border bg-elevated p-8 flex flex-col items-center gap-4">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">Mark · Mono</div>
              <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="38" stroke="#F2EDE6" strokeWidth="20" />
                <circle cx="50" cy="50" r="15" fill="#F2EDE6" />
              </svg>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">Logo Lockups</div>
            <div>
              <div className="text-xs text-muted-foreground mb-3">Standard (nav, sidebar ≥ 18px)</div>
              <OlonWordmark markSize={36} />
            </div>
            <div className="border-t border-border pt-5">
              <div className="text-xs text-muted-foreground mb-3">Hero display (marketing · ≥ 48px)</div>
              <OlonWordmark markSize={64} />
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* BUTTON */}
        <section id="buttons" data-ds-id="buttons" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Button</h2>
            <p className="text-sm text-muted-foreground">Five variants. All use semantic tokens — no hardcoded colors.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            {[
              {
                label: 'Default (primary)',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">Get started</button>,
                ],
              },
              {
                label: 'Accent (CTA)',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity">Get started →</button>,
                ],
              },
              {
                label: 'Secondary (outline)',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-primary-light border border-primary rounded-md hover:bg-primary-900 transition-colors">Documentation</button>,
                  <button key="2" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-foreground border border-border rounded-md hover:bg-elevated transition-colors">View on GitHub</button>,
                ],
              },
              {
                label: 'Ghost',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors">Cancel</button>,
                ],
              },
            ].map((group, i, arr) => (
              <div key={group.label} className={i < arr.length - 1 ? 'border-b border-border pb-6' : ''}>
                <div className="text-xs text-muted-foreground mb-4">{group.label}</div>
                <div className="flex flex-wrap gap-3">{group.buttons}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* BADGE */}
        <section id="badges" data-ds-id="badges" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Badge</h2>
            <p className="text-sm text-muted-foreground">Status, versioning, feature flags. Small but precise.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-light border border-primary rounded-sm">Stable</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-200 border border-primary-800 rounded-sm">OSS</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-elevated text-muted-foreground border border-border rounded-sm">v1.4</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary text-primary-foreground rounded-sm">New</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium bg-elevated text-muted-foreground border border-border rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success-indicator inline-block" />
                Deployed
              </span>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* INPUT */}
        <section id="inputs" data-ds-id="inputs" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Input</h2>
            <p className="text-sm text-muted-foreground">Form elements. Precision over decoration.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Tenant slug</label>
              <input type="text" placeholder="my-tenant" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Schema version <span className="text-destructive-foreground ml-1">Invalid format</span>
              </label>
              <input type="text" defaultValue="1.x.x" className="w-full px-3 py-2 text-sm bg-background border border-destructive-border rounded-md text-foreground focus:outline-none focus:border-destructive-ring focus:ring-1 focus:ring-destructive-ring transition-colors" />
              <p className="mt-1.5 text-xs text-destructive-foreground">Must follow semver (e.g. 1.4.0)</p>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* CARD */}
        <section id="cards" data-ds-id="cards" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Card</h2>
            <p className="text-sm text-muted-foreground">The primary container primitive. Three elevation levels.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">Default · bg-card</div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">JsonPages contract</div>
                  <div className="text-xs text-muted-foreground">Tenant: acme-corp · 4 routes · Last sync 2m ago</div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-light border border-primary rounded-sm">Active</span>
              </div>
            </div>
            <div className="rounded-lg border border-border-strong bg-elevated p-5">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">Elevated · bg-elevated</div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-primary-900 border border-primary flex items-center justify-center shrink-0">
                  <OlonMark size={18} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">OlonJS Enterprise</div>
                  <div className="text-xs text-muted-foreground mt-0.5">NX monorepo · Private cloud · SOC2 ready</div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-primary bg-primary-900 p-5">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-primary-light mb-4">Accent · border-primary bg-primary-900</div>
              <div className="font-display text-lg font-normal text-foreground mb-2">
                Ship your first tenant in hours,<br />
                <em className="not-italic text-accent">not weeks.</em>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                Start building →
              </button>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* CODE BLOCK */}
        <section id="code" data-ds-id="code" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Code Block</h2>
            <p className="text-sm text-muted-foreground">Developer-first. Syntax highlighting uses brand ramp stops only.</p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-elevated border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
              </div>
              <span className="font-mono-olon text-[11px] text-muted-foreground">olon.config.ts</span>
              <button className="font-mono-olon text-[11px] text-muted-foreground hover:text-foreground transition-colors">Copy</button>
            </div>
            <div className="bg-card px-5 py-5 overflow-x-auto">
              <pre className="font-mono-olon text-sm leading-relaxed">
                <code>
                  <span className="syntax-keyword">import</span>{' '}
                  <span className="text-foreground">{'{ defineConfig }'}</span>{' '}
                  <span className="syntax-keyword">from</span>{' '}
                  <span className="syntax-string">'olonjs'</span>
                  {'\n\n'}
                  <span className="syntax-keyword">export default</span>{' '}
                  <span className="syntax-value">defineConfig</span>
                  <span className="text-foreground">{'({'}</span>
                  {'\n  '}
                  <span className="syntax-property">tenants</span>
                  <span className="text-foreground">{': [{'}</span>
                  {'\n    '}
                  <span className="syntax-property">slug</span>
                  <span className="text-foreground">{': '}</span>
                  <span className="syntax-string">'olon-ds'</span>
                  {'\n  '}
                  <span className="text-foreground">{'}]'}</span>
                  {'\n'}
                  <span className="text-foreground">{'}'}</span>
                </code>
              </pre>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/design-system/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/design-system/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/design-system/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/design-system/schema.ts"
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const DesignSystemSchema = BaseSectionData.extend({
  title: z.string().optional().describe('ui:text'),
});

export const DesignSystemSettingsSchema = z.object({
  /** Pre-resolved CSS var map injected at SSG bake time. Keys are var names (e.g. "--background"), values are resolved hex strings. */
  initialCssVars: z.record(z.string()).optional(),
});

END_OF_FILE_CONTENT
echo "Creating src/components/design-system/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/design-system/types.ts"
import { z } from 'zod';
import { DesignSystemSchema, DesignSystemSettingsSchema } from './schema';

export type DesignSystemData     = z.infer<typeof DesignSystemSchema>;
export type DesignSystemSettings = z.infer<typeof DesignSystemSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/devex"
echo "Creating src/components/devex/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/View.tsx"
import React from 'react';
import type { DevexData, DevexSettings } from './types';

const ENDPOINTS = [
  '/homepage.json',
  '/products/shoes.json',
  '/blog/ai-agents.json',
  '/contact.json',
] as const;

export const Devex: React.FC<{ data: DevexData; settings?: DevexSettings }> = ({ data }) => {
  return (
    <section id="developer-velocity" className="jp-devex py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-[1040px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* LEFT */}
        <div>
          {data.label && (
            <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-5">
              <span className="w-[18px] h-px bg-border" aria-hidden />
              {data.label}
            </div>
          )}
          <h2
            className="font-display font-bold tracking-[-0.03em] leading-[1.15] text-foreground mb-5"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)' }}
            data-jp-field="title"
          >
            {data.title}
          </h2>
          {data.description && (
            <p
              className="text-[14px] text-muted-foreground leading-[1.78] mb-6"
              data-jp-field="description"
            >
              {data.description}
            </p>
          )}

          {data.features && data.features.length > 0 && (
            <ul className="flex flex-col mb-8" data-jp-field="features">
              {data.features.map((f, idx) => (
                <li
                  key={(f as { id?: string }).id ?? idx}
                  className="flex items-start gap-2.5 text-[13.5px] text-muted-foreground py-3 border-b border-border last:border-b-0 hover:text-foreground hover:pl-1 transition-all"
                  data-jp-item-id={(f as { id?: string }).id ?? `f-${idx}`}
                  data-jp-item-field="features"
                >
                  <span className="flex-shrink-0 w-[18px] h-[18px] rounded-sm bg-primary/10 flex items-center justify-center mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                    </svg>
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
          )}

          {data.stats && data.stats.length > 0 && (
            <div className="flex gap-7 flex-wrap" data-jp-field="stats">
              {data.stats.map((stat, idx) => (
                <div
                  key={(stat as { id?: string }).id ?? idx}
                  className="flex flex-col gap-0.5"
                  data-jp-item-id={(stat as { id?: string }).id ?? `st-${idx}`}
                  data-jp-item-field="stats"
                >
                  <span
                    className="text-[28px] font-bold tracking-[-0.03em] leading-none bg-gradient-to-br from-[#84ABFF] to-[#1763FF] bg-clip-text text-transparent"
                    data-jp-item-field="value"
                  >
                    {stat.value}
                  </span>
                  <span className="text-[11.5px] text-muted-foreground/60 font-medium" data-jp-item-field="label">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Endpoint display window */}
        <div
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: '#060d14', boxShadow: '0 24px 56px rgba(0,0,0,.35)' }}
        >
          <div className="flex items-center gap-1.5 px-4 py-3 bg-card border-b border-border">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="flex-1 text-center font-mono text-[11px] text-muted-foreground/60">
              canonical endpoints
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
              GET
            </span>
          </div>
          <div className="px-4 py-4">
            {ENDPOINTS.map((ep, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg mb-0.5 hover:bg-muted/20 transition-colors"
              >
                <span className="font-mono text-[12.5px] text-[#84ABFF] flex-1">{ep}</span>
                <span className="text-[11px] text-muted-foreground/40">→</span>
                <span className="font-mono text-[10.5px] text-emerald-500">200 OK</span>
              </div>
            ))}
            <div className="mt-3.5 mx-2.5 p-3.5 bg-muted/20 rounded-lg border border-border">
              <div className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[.08em] mb-2">
                Contract
              </div>
              <div className="font-mono text-[11.5px] text-muted-foreground leading-[1.8]">
                <span className="text-[#84ABFF]">slug</span>
                {' · '}
                <span className="text-[#84ABFF]">meta</span>
                {' · '}
                <span className="text-[#84ABFF]">sections[]</span>
                <br />
                <span className="text-emerald-500">type-safe</span>
                {' · '}
                <span className="text-emerald-500">versioned</span>
                {' · '}
                <span className="text-emerald-500">schema-validated</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/devex/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/devex/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const FeatureSchema = BaseArrayItem.extend({
  text: z.string().describe('ui:text'),
});

const StatSchema = BaseArrayItem.extend({
  value: z.string().describe('ui:text'),
  label: z.string().describe('ui:text'),
});

export const DevexSchema = BaseSectionData.extend({
  label:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  features:    z.array(FeatureSchema).optional().describe('ui:list'),
  stats:       z.array(StatSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/devex/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { DevexSchema } from './schema';

export type DevexData     = z.infer<typeof DevexSchema>;
export type DevexSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/feature-grid"
echo "Creating src/components/feature-grid/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import type { FeatureGridData, FeatureGridSettings } from './types';

export const FeatureGrid: React.FC<{
  data: FeatureGridData;
  settings?: FeatureGridSettings;
}> = ({ data }) => {
  return (
    <section id="architecture" className="jp-feature-grid py-24">
      <div className="max-w-[1040px] mx-auto px-8">

        {/* Section header */}
        <header className="text-center mb-14">
          {data.label && (
            <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-5">
              <span className="w-[18px] h-px bg-border" aria-hidden />
              {data.label}
            </div>
          )}
          <h2
            className="font-display font-bold tracking-[-0.03em] leading-[1.15] text-foreground mb-4"
            style={{ fontSize: 'clamp(26px, 3.8vw, 40px)' }}
            data-jp-field="sectionTitle"
          >
            {data.sectionTitle}
          </h2>
          {data.sectionLead && (
            <p
              className="text-[15.5px] text-muted-foreground leading-[1.7] mx-auto"
              style={{ maxWidth: '500px' }}
              data-jp-field="sectionLead"
            >
              {data.sectionLead}
            </p>
          )}
        </header>

        {/* 3-col feature grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-xl overflow-hidden border border-border"
          style={{ gap: '1px', background: 'var(--border)' }}
          data-jp-field="cards"
        >
          {data.cards.map((card, idx) => (
            <div
              key={card.id ?? idx}
              className={cn(
                'p-8 transition-colors hover:bg-muted/60',
                idx % 2 === 0 ? 'bg-background' : 'bg-card'
              )}
              data-jp-item-id={card.id ?? `legacy-${idx}`}
              data-jp-item-field="cards"
            >
              {card.emoji && (
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/18 flex items-center justify-center text-[18px] mb-5">
                  {card.emoji}
                </div>
              )}
              <h3 className="text-[14px] font-semibold text-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-[1.7]">
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/feature-grid/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/feature-grid/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

export const FeatureCardSchema = BaseArrayItem.extend({
  icon: z.string().optional().describe('ui:icon-picker'),
  emoji: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const FeatureGridSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  sectionTitle: z.string().describe('ui:text'),
  sectionLead: z.string().optional().describe('ui:textarea'),
  cards: z.array(FeatureCardSchema).describe('ui:list'),
});

export const FeatureGridSettingsSchema = z.object({
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional().describe('ui:number'),
  cardStyle: z.enum(['plain', 'bordered']).optional().describe('ui:select'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/feature-grid/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { FeatureGridSchema, FeatureGridSettingsSchema } from './schema';

export type FeatureGridData = z.infer<typeof FeatureGridSchema>;
export type FeatureGridSettings = z.infer<typeof BaseSectionSettingsSchema> & z.infer<typeof FeatureGridSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/footer"
echo "Creating src/components/footer/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/View.tsx"
import React from 'react';
import { OlonMark } from '@/components/ui/OlonMark';
import type { FooterData, FooterSettings } from './types';

export const Footer: React.FC<{ data: FooterData; settings?: FooterSettings }> = ({ data }) => {
  return (
    <footer
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-accent': 'var(--accent)',
        '--local-border': 'color-mix(in oklch, var(--foreground) 8%, transparent)',
      } as React.CSSProperties}
      className="py-12 border-t border-[var(--local-border)] bg-[var(--local-bg)] relative z-0"
    >
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-bold text-[0.9rem] text-[var(--local-text-muted)]">
            <OlonMark size={20} />
            <span data-jp-field="brandText">{data.brandText}{data.brandHighlight && <span className="text-[var(--local-accent)]" data-jp-field="brandHighlight">{data.brandHighlight}</span>}</span>
          </div>
          {data.links && data.links.length > 0 && (
            <nav className="flex gap-6">
              {data.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-[0.82rem] text-[var(--local-text-muted)] hover:text-[var(--local-accent)] transition-colors no-underline"
                  data-jp-item-id={(link as { id?: string }).id ?? `legacy-${idx}`}
                  data-jp-item-field="links"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
          <div className="text-[0.8rem] text-[var(--local-text-muted)] opacity-60" data-jp-field="copyright">
            {data.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/footer/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/footer/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/schema.ts"
import { z } from 'zod';

export const FooterSchema = z.object({
  brandText: z.string().describe('ui:text'),
  brandHighlight: z.string().optional().describe('ui:text'),
  copyright: z.string().describe('ui:text'),
  links: z.array(z.object({
    label: z.string().describe('ui:text'),
    href: z.string().describe('ui:text'),
  })).optional().describe('ui:list'),
});

export const FooterSettingsSchema = z.object({
  showLogo: z.boolean().optional().describe('ui:checkbox'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/footer/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/types.ts"
import { z } from 'zod';
import { FooterSchema, FooterSettingsSchema } from './schema';

export type FooterData = z.infer<typeof FooterSchema>;
export type FooterSettings = z.infer<typeof FooterSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/git-section"
echo "Creating src/components/git-section/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/View.tsx"
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { GitSectionData, GitSectionSettings } from './types';

export const GitSection: React.FC<{
  data: GitSectionData;
  settings?: GitSectionSettings;
}> = ({ data }) => {
  return (
    <div
      id="why"
      className="jp-git-section border-y border-border bg-card py-20"
    >
      <div className="max-w-[1040px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 items-center">

          {/* Left: title */}
          <div>
            {data.label && (
              <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-4">
                <span className="w-[18px] h-px bg-border" aria-hidden />
                {data.label}
              </div>
            )}
            <h2
              className="font-display font-bold tracking-[-0.03em] leading-[1.2] text-foreground"
              style={{ fontSize: 'clamp(26px, 3.5vw, 34px)' }}
              data-jp-field="title"
            >
              {data.title}
              {data.titleAccent && (
                <>
                  <br />
                  <span
                    className="bg-gradient-to-br from-[#84ABFF] to-[#1763FF] bg-clip-text text-transparent"
                    data-jp-field="titleAccent"
                  >
                    {data.titleAccent}
                  </span>
                </>
              )}
            </h2>
          </div>

          {/* Right: 2×2 card grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-jp-field="cards"
          >
            {data.cards?.map((card, idx) => (
              <Card
                key={(card as { id?: string }).id ?? idx}
                className="bg-background border-border p-5"
                data-jp-item-id={(card as { id?: string }).id ?? `wc-${idx}`}
                data-jp-item-field="cards"
              >
                <CardContent className="p-0">
                  <div className="text-[13px] font-semibold text-foreground mb-1.5">
                    {card.title}
                  </div>
                  <p className="text-[12.5px] text-muted-foreground leading-[1.6]">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/git-section/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/git-section/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const WhyCardSchema = BaseArrayItem.extend({
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const GitSectionSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  titleAccent: z.string().optional().describe('ui:text'),
  cards: z.array(WhyCardSchema).describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/git-section/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { GitSectionSchema } from './schema';

export type GitSectionData     = z.infer<typeof GitSectionSchema>;
export type GitSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/header"
echo "Creating src/components/header/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/View.tsx"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { OlonMark } from '@/components/ui/OlonMark';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@olonjs/core';
import type { HeaderData, HeaderSettings } from './types';

export const Header: React.FC<{
  data: HeaderData;
  settings?: HeaderSettings;
  menu: MenuItem[];
}> = ({ data, menu }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div style={{ height: '56px' }} aria-hidden />
      <header
        className={cn(
          'fixed top-0 left-0 right-0 w-full h-14 z-50 transition-all duration-300',
          'flex items-center',
          'bg-background/88 backdrop-blur-[16px] border-b border-border/60'
        )}
      >
        <div className="max-w-[1040px] w-full mx-auto px-8 flex items-center gap-3">

          <a
            href="#"
            className="flex items-center gap-2 no-underline shrink-0"
            aria-label="OlonJS home"
          >
            <OlonMark size={22} />
            <span
              className="text-lg font-bold tracking-tight text-foreground"
              data-jp-field="logoText"
            >
              {data.logoText}
              {data.logoHighlight && (
                <span className="text-primary" data-jp-field="logoHighlight">
                  {data.logoHighlight}
                </span>
              )}
            </span>
          </a>

          {data.badge && (
            <>
              <span className="w-px h-4 bg-border" aria-hidden />
              <Badge variant="pill" data-jp-field="badge">
                {data.badge}
              </Badge>
            </>
          )}

          <div className="flex-1" />

          <nav className="hidden md:flex items-center gap-0.5" aria-label="Site">
            {menu.map((item, idx) => (
              <Button
                key={(item as { id?: string }).id ?? idx}
                asChild
                variant={item.isCta ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'text-[13px]',
                  !item.isCta && 'text-muted-foreground hover:text-foreground'
                )}
              >
                <a
                  href={item.href}
                  data-jp-item-id={(item as { id?: string }).id ?? `legacy-${idx}`}
                  data-jp-item-field="links"
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </a>
              </Button>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            className="absolute top-14 left-0 right-0 md:hidden border-b border-border bg-background/95 backdrop-blur-[16px]"
            aria-label="Mobile menu"
          >
            <div className="max-w-[1040px] mx-auto px-8 py-4 flex flex-col gap-1">
              {menu.map((item, idx) => (
                <a
                  key={(item as { id?: string }).id ?? idx}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5 no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                  data-jp-item-id={(item as { id?: string }).id ?? `legacy-${idx}`}
                  data-jp-item-field="links"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/header/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/index.ts"
export * from './View';
export * from './schema';
export * from './types';
END_OF_FILE_CONTENT
echo "Creating src/components/header/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/schema.ts"
import { z } from 'zod';

/**
 * 📝 HEADER SCHEMA (Contract)
 * Definisce la struttura dati che l'Admin userà per generare la form.
 */
export const HeaderSchema = z.object({
  logoText: z.string().describe('ui:text'),
  logoHighlight: z.string().optional().describe('ui:text'),
  logoIconText: z.string().optional().describe('ui:text'),
  badge: z.string().optional().describe('ui:text'),
  links: z.array(z.object({
    label: z.string().describe('ui:text'),
    href: z.string().describe('ui:text'),
    isCta: z.boolean().default(false).describe('ui:checkbox'),
    external: z.boolean().default(false).optional().describe('ui:checkbox'),
  })).describe('ui:list'),
});

/**
 * ⚙️ HEADER SETTINGS
 * Definisce i parametri tecnici (non di contenuto).
 */
export const HeaderSettingsSchema = z.object({
  sticky: z.boolean().default(true).describe('ui:checkbox'),
});
END_OF_FILE_CONTENT
echo "Creating src/components/header/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/types.ts"
import { z } from 'zod';
import { HeaderSchema, HeaderSettingsSchema } from './schema';

/**
 * 🧩 HEADER DATA
 * Tipo inferito dallo schema Zod del contenuto.
 * Utilizzato dalla View per renderizzare logo e links.
 */
export type HeaderData = z.infer<typeof HeaderSchema>;

/**
 * ⚙️ HEADER SETTINGS
 * Tipo inferito dallo schema Zod dei settings.
 * Gestisce comportamenti tecnici come lo 'sticky'.
 */
export type HeaderSettings = z.infer<typeof HeaderSettingsSchema>;
END_OF_FILE_CONTENT
mkdir -p "src/components/hero"
echo "Creating src/components/hero/RadialBackground.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/RadialBackground.tsx"
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

// CSS var names — order matches STOPS
const TOKEN_VARS = [
  '--background',   // #0B0907 center
  '--background',         // #130F0D
  '--background',     // #1E1814
  '--background',       // #2E271F
  '--background',      // #241D17
  '--elevated',     // #1E1814
  '--background',   // #0B0907 outer
] as const;

const STOPS = [0, 30, 55, 72, 84, 93, 100] as const;

function readTokenColors(): string[] {
  if (typeof document === 'undefined') return TOKEN_VARS.map(() => '#000');
  const s = getComputedStyle(document.documentElement);
  return TOKEN_VARS.map((v) => s.getPropertyValue(v).trim() || '#000');
}

export function RadialBackground({
  startingGap =80, 
  breathing = true,
  animationSpeed = 0.01,
  breathingRange = 180,
  topOffset = 0,
}: {
  startingGap?: number;
  breathing?: boolean;
  animationSpeed?: number;
  breathingRange?: number;
  topOffset?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [colors, setColors] = useState<string[]>(() => readTokenColors());

  // Re-read tokens when data-theme changes (dark ↔ light)
  useEffect(() => {
    setColors(readTokenColors());
    const observer = new MutationObserver(() => setColors(readTokenColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let animationFrame: number;
    let width = startingGap;
    let direction = 1;

    const animate = () => {
      if (width >= startingGap + breathingRange) direction = -1;
      if (width <= startingGap - breathingRange) direction = 1;
      if (!breathing) direction = 0;
      width += direction * animationSpeed;

      const stops = STOPS.map((s, i) => `${colors[i]} ${s}%`).join(', ');
      const gradient = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${stops})`;

      if (containerRef.current) {
        containerRef.current.style.background = gradient;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [startingGap, breathing, animationSpeed, breathingRange, topOffset, colors]);

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, transition: { duration: 2, ease: [0.25, 0.1, 0.25, 1] } }}
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0, scale: 1.5 }}
    >
      <div className="absolute inset-0" ref={containerRef} />
    </motion.div>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/hero/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/View.tsx"
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { HeroData, HeroSettings } from './types';

const CODE_LINES = [
  { type: 'p', text: '{' },
  { type: 'k', text: '  "slug"',   after: ': ', val: '"homepage"', comma: ',' },
  { type: 'k', text: '  "meta"',   after: ': ', val: '{ "title": "Acme Corp" }', comma: ',' },
  { type: 'k', text: '  "sections"', after: ': [' },
  { type: 'p', text: '    {' },
  { type: 'k', text: '      "type"', after: ':  ', val: '"hero"', comma: ',' },
  { type: 'k', text: '      "data"', after: ': {' },
  { type: 'k', text: '        "title"', after: ': ', val: '"Ship faster with agents"', comma: ',' },
  { type: 'k', text: '        "cta"',   after: ':   ', val: '"Get started"' },
  { type: 'p', text: '      }' },
  { type: 'p', text: '    },' },
  { type: 'c', text: '    { "type": "features" /* ... */ }' },
  { type: 'p', text: '  ]' },
  { type: 'p', text: '}' },
] as const;

const tokenColor: Record<string, string> = {
  k: 'text-[#84ABFF]',
  s: 'text-[#86efac]',
  c: 'text-[#4b5563]',
  p: 'text-[#9ca3af]',
};

export const Hero: React.FC<{ data: HeroData; settings?: HeroSettings }> = ({ data }) => {
  const primaryCta = data.ctas?.find(c => c.variant === 'primary') ?? data.ctas?.[0];
  const secondaryCta = data.ctas?.find(c => c.variant === 'secondary') ?? data.ctas?.[1];

  return (
    <section className="jp-hero relative pt-[156px] pb-28 text-center overflow-hidden">

      {/* Background glow — absolute, scoped to hero section */}
      <div
        className="pointer-events-none absolute z-0 rounded-full"
        style={{
          width: '900px',
          height: '700px',
          background: 'radial-gradient(ellipse at center, rgba(23,99,255,.10) 0%, transparent 68%)',
          top: '-160px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        aria-hidden
      />
      {/* Grid background — absolute, scoped to hero section */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, black 0%, transparent 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-[1040px] mx-auto px-8">

        {/* Eyebrow badge */}
        {data.badge && (
          <div className="inline-flex items-center gap-2 mb-8">
            <Badge
              variant="pill"
              className="gap-2 py-1.5 px-4 text-[12px] tracking-[.05em] font-mono"
              data-jp-field="badge"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                aria-hidden
              />
              {data.badge}
            </Badge>
          </div>
        )}

        {/* Headline */}
        <h1
          className="font-display font-bold tracking-[-0.038em] leading-[1.06] text-foreground mb-2 mx-auto"
          style={{ fontSize: 'clamp(44px, 6.5vw, 74px)', maxWidth: '840px' }}
          data-jp-field="title"
        >
          {data.title}
          {data.titleHighlight && (
            <>
              {' '}
              <span
                className="bg-gradient-to-br from-[#84ABFF] via-[#1763FF] to-[#0F52E0] bg-clip-text text-transparent"
                data-jp-field="titleHighlight"
              >
                {data.titleHighlight}
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        {data.description && (
          <p
            className="text-muted-foreground leading-[1.7] mx-auto mt-6 mb-12"
            style={{ fontSize: 'clamp(15px, 2vw, 18px)', maxWidth: '560px' }}
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div className="flex items-center justify-center gap-3 flex-wrap mb-0">
            {primaryCta && (
              <Button asChild variant="default" size="lg" className="gap-2 px-7 shadow-[0_0_32px_rgba(23,99,255,.38)]">
                <a
                  href={primaryCta.href}
                  data-jp-item-id={primaryCta.id}
                  data-jp-item-field="ctas"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.8 }}>
                    <rect x="2.5" y="2" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M5.5 6h5M5.5 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {primaryCta.label}
                </a>
              </Button>
            )}
            {secondaryCta && (
              <Button asChild variant="outline" size="lg" className="gap-2 px-7">
                <a
                  href={secondaryCta.href}
                  data-jp-item-id={secondaryCta.id}
                  data-jp-item-field="ctas"
                  target={secondaryCta.href?.startsWith('http') ? '_blank' : undefined}
                  rel={secondaryCta.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
                    <path d="M8 1C4.13 1 1 4.13 1 8c0 3.09 2.01 5.71 4.79 6.63.35.06.48-.15.48-.34v-1.2c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.02-.78-1.02-.64-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.93-1.56-.18-3.2-.78-3.2-3.47 0-.77.27-1.4.72-1.89-.07-.18-.31-.9.07-1.87 0 0 .59-.19 1.93.72A6.7 6.7 0 0 1 8 5.17c.6 0 1.2.08 1.76.24 1.34-.91 1.93-.72 1.93-.72.38.97.14 1.69.07 1.87.45.49.72 1.12.72 1.89 0 2.7-1.64 3.29-3.2 3.47.25.22.48.65.48 1.31v1.94c0 .19.12.4.48.34C12.99 13.71 15 11.09 15 8c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                  </svg>
                  {secondaryCta.label}
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Code window */}
        <div className="mt-[68px] mx-auto" style={{ maxWidth: '540px' }}>
          <div
            className="rounded-xl border border-border text-left overflow-hidden"
            style={{ background: '#060d14', boxShadow: '0 32px 64px rgba(0,0,0,.44), 0 0 0 1px rgba(255,255,255,.04)' }}
          >
            <div className="flex items-center gap-1.5 px-4 py-3 bg-card border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="flex-1 text-center font-mono text-[11px] text-muted-foreground/60">
                GET /homepage.json
              </span>
            </div>
            <div className="px-6 py-5 font-mono text-[12.5px] leading-[1.8] overflow-x-auto">
              {CODE_LINES.map((ln, i) => (
                <div key={i}>
                  {ln.type === 'k' ? (
                    <span>
                      <span className={tokenColor.k}>{ln.text}</span>
                      {'after' in ln && <span className={tokenColor.p}>{ln.after}</span>}
                      {'val' in ln && <span className="text-[#86efac]">{ln.val}</span>}
                      {'comma' in ln && <span className={tokenColor.p}>{ln.comma}</span>}
                    </span>
                  ) : ln.type === 'c' ? (
                    <span className={tokenColor.c}>{ln.text}</span>
                  ) : (
                    <span className={tokenColor.p}>{ln.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/hero/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/hero/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/schema.ts"
import { z } from 'zod';
import { BaseSectionData, CtaSchema } from '@/lib/base-schemas';

const HeroMetricSchema = z.object({
  val: z.string().describe('ui:text'),
  label: z.string().describe('ui:text'),
});

export const HeroSchema = BaseSectionData.extend({
  badge: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  titleHighlight: z.string().optional().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  ctas: z.array(CtaSchema).optional().describe('ui:list'),
  metrics: z.array(HeroMetricSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/hero/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { HeroSchema } from './schema';

export type HeroData = z.infer<typeof HeroSchema>;
export type HeroSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/login"
echo "Creating src/components/login/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/login/View.tsx"
import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OlonMark } from '@/components/OlonWordmark';
import type { LoginData, LoginSettings } from './types';

interface LoginViewProps {
  data: LoginData;
  settings?: LoginSettings;
}

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export function Login({ data, settings }: LoginViewProps) {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const showOauth = settings?.showOauth ?? true;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <section id="login" className="py-24 px-6 border-t border-border section-anchor">
      <div className="max-w-4xl mx-auto flex justify-center">
        <div className="w-full max-w-[360px]">

          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <OlonMark size={32} className="mb-5" />
            <h2 className="text-[18px] font-display text-foreground tracking-[-0.02em] mb-1.5" data-jp-field="title">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="text-[13px] text-muted-foreground" data-jp-field="subtitle">{data.subtitle}</p>
            )}
          </div>

          {/* OAuth */}
          {showOauth && (
            <div className="space-y-2 mb-6">
              {[
                { label: 'Continue with Google', icon: <GoogleIcon />, id: 'google' },
                { label: 'Continue with GitHub', icon: <GitHubIcon />, id: 'github' },
              ].map(({ label, icon, id }) => (
                <button
                  key={id}
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 h-9 px-4 text-[13px] font-medium text-foreground border border-border rounded-md bg-transparent hover:bg-elevated transition-colors duration-150"
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground font-mono-olon tracking-wide">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" placeholder="ada@acme.com" autoComplete="email" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="login-password" className="mb-0">Password</Label>
                {data.forgotHref && (
                  <a href={data.forgotHref} data-jp-field="forgotHref" className="text-[11px] text-primary-400 hover:text-primary-light transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : <><span>Sign in</span><ArrowRight size={14} /></>}
            </Button>
          </form>

          {data.signupHref && (
            <p className="text-center text-[12px] text-muted-foreground mt-6">
              No account?{' '}
              <a href={data.signupHref} data-jp-field="signupHref" className="text-primary-light hover:text-primary-200 transition-colors">
                Request access →
              </a>
            </p>
          )}

          {(data.termsHref || data.privacyHref) && (
            <p className="text-center text-[11px] text-muted-foreground/60 mt-4">
              By signing in you agree to our{' '}
              {data.termsHref && (
                <a href={data.termsHref} data-jp-field="termsHref" className="hover:text-muted-foreground transition-colors underline underline-offset-2">Terms</a>
              )}
              {data.termsHref && data.privacyHref && ' and '}
              {data.privacyHref && (
                <a href={data.privacyHref} data-jp-field="privacyHref" className="hover:text-muted-foreground transition-colors underline underline-offset-2">Privacy Policy</a>
              )}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/login/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/login/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/login/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/login/schema.ts"
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const LoginSchema = BaseSectionData.extend({
  title:       z.string().describe('ui:text'),
  subtitle:    z.string().optional().describe('ui:text'),
  forgotHref:  z.string().optional().describe('ui:text'),
  signupHref:  z.string().optional().describe('ui:text'),
  termsHref:   z.string().optional().describe('ui:text'),
  privacyHref: z.string().optional().describe('ui:text'),
});

export const LoginSettingsSchema = z.object({
  showOauth: z.boolean().default(true).describe('ui:checkbox'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/login/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/login/types.ts"
import { z } from 'zod';
import { LoginSchema, LoginSettingsSchema } from './schema';

export type LoginData     = z.infer<typeof LoginSchema>;
export type LoginSettings = z.infer<typeof LoginSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/page-hero"
echo "Creating src/components/page-hero/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/page-hero/View.tsx"
import React from 'react';
import type { PageHeroData, PageHeroSettings } from './types';

interface PageHeroViewProps {
  data: PageHeroData;
  settings?: PageHeroSettings;
}

export function PageHero({ data }: PageHeroViewProps) {
  const crumbs = data.breadcrumb ?? [];

  return (
    <section
      className="py-14 px-6 border-b border-[var(--local-border)] bg-[var(--local-bg)]"
      style={{
        '--local-bg':        'var(--card)',
        '--local-text':      'var(--foreground)',
        '--local-text-muted':'var(--muted-foreground)',
        '--local-border':    'var(--border)',
      } as React.CSSProperties}
    >
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        {crumbs.length > 0 && (
          <nav className="flex items-center gap-2 font-mono-olon text-xs tracking-label uppercase text-muted-foreground mb-6">
            {crumbs.map((item, idx) => (
              <React.Fragment key={item.id ?? `crumb-${idx}`}>
                {idx > 0 && <span className="text-border-strong select-none">/</span>}
                <a
                  href={item.href}
                  data-jp-item-id={item.id ?? `crumb-${idx}`}
                  data-jp-item-field="breadcrumb"
                  className="hover:text-[var(--local-text)] transition-colors"
                >
                  {item.label}
                </a>
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Badge */}
        {data.badge && (
          <div
            className="inline-flex items-center font-mono-olon text-xs font-medium tracking-label uppercase text-primary-light bg-primary-900 border border-primary px-3 py-1 rounded-sm mb-5"
            data-jp-field="badge"
          >
            {data.badge}
          </div>
        )}

        {/* Title */}
        <h1
          className="font-display font-normal text-4xl md:text-5xl leading-tight tracking-display text-[var(--local-text)] mb-1"
          data-jp-field="title"
        >
          {data.title}
        </h1>

        {/* Title italic accent line */}
        {data.titleItalic && (
          <p
            className="font-display font-normal italic text-4xl md:text-5xl leading-tight tracking-display text-primary-light mb-0"
            data-jp-field="titleItalic"
          >
            {data.titleItalic}
          </p>
        )}

        {/* Description */}
        {data.description && (
          <p
            className="text-base text-[var(--local-text-muted)] leading-relaxed max-w-xl mt-5"
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

      </div>
    </section>
  );
}

END_OF_FILE_CONTENT
echo "Creating src/components/page-hero/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/page-hero/index.ts"
export { PageHero } from './View';
export { PageHeroSchema } from './schema';
export type { PageHeroData, PageHeroSettings } from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/page-hero/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/page-hero/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const BreadcrumbItemSchema = BaseArrayItem.extend({
  label: z.string().describe('ui:text'),
  href:  z.string().describe('ui:text'),
});

export const PageHeroSchema = BaseSectionData.extend({
  badge:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  titleItalic: z.string().optional().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  breadcrumb:  z.array(BreadcrumbItemSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/page-hero/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/page-hero/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { PageHeroSchema } from './schema';

export type PageHeroData     = z.infer<typeof PageHeroSchema>;
export type PageHeroSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/problem-statement"
echo "Creating src/components/problem-statement/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/View.tsx"
import React from 'react';
import type { ProblemStatementData, ProblemStatementSettings } from './types';

export const ProblemStatement: React.FC<{
  data: ProblemStatementData;
  settings?: ProblemStatementSettings;
}> = ({ data }) => {
  return (
    <section id="problem" className="jp-problem py-24">
      <div className="max-w-[1040px] mx-auto px-8">

        {data.label && (
          <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-5">
            <span className="w-[18px] h-px bg-border" aria-hidden />
            {data.label}
          </div>
        )}

        {/* Split grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-border"
          style={{ gap: '1px', background: 'var(--border)' }}
        >
          {/* Problem cell */}
          <div className="bg-background p-10 md:p-[40px_42px]" data-jp-field="problemTitle">
            <div className="text-[10.5px] font-bold tracking-[.10em] uppercase text-red-500 mb-5">
              {data.problemTag}
            </div>
            <h3 className="text-[21px] font-bold tracking-[-0.02em] leading-[1.2] text-foreground mb-6">
              {data.problemTitle}
            </h3>
            <ul className="flex flex-col gap-3.5" data-jp-field="problemItems">
              {data.problemItems?.map((item, idx) => (
                <li
                  key={(item as { id?: string }).id ?? idx}
                  className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-[1.65]"
                  data-jp-item-id={(item as { id?: string }).id ?? `p-${idx}`}
                  data-jp-item-field="problemItems"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-red-500/10 text-red-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    ✕
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution cell */}
          <div className="bg-card p-10 md:p-[40px_42px]" data-jp-field="solutionTitle">
            <div className="text-[10.5px] font-bold tracking-[.10em] uppercase text-emerald-500 mb-5">
              {data.solutionTag}
            </div>
            <h3 className="text-[21px] font-bold tracking-[-0.02em] leading-[1.2] text-foreground mb-6">
              {data.solutionTitle}
            </h3>
            <ul className="flex flex-col gap-3.5" data-jp-field="solutionItems">
              {data.solutionItems?.map((item, idx) => (
                <li
                  key={(item as { id?: string }).id ?? idx}
                  className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-[1.65]"
                  data-jp-item-id={(item as { id?: string }).id ?? `s-${idx}`}
                  data-jp-item-field="solutionItems"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    ✓
                  </span>
                  <span>
                    {item.text}
                    {item.code && (
                      <> <code className="font-mono text-[11px] bg-muted border border-border rounded px-1.5 py-0.5 text-primary">
                        {item.code}
                      </code></>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/problem-statement/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/problem-statement/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const ProblemItemSchema = BaseArrayItem.extend({
  text: z.string().describe('ui:text'),
  code: z.string().optional().describe('ui:text'),
});

export const ProblemStatementSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  problemTag: z.string().describe('ui:text'),
  problemTitle: z.string().describe('ui:text'),
  problemItems: z.array(ProblemItemSchema).describe('ui:list'),
  solutionTag: z.string().describe('ui:text'),
  solutionTitle: z.string().describe('ui:text'),
  solutionItems: z.array(ProblemItemSchema).describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/problem-statement/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ProblemStatementSchema } from './schema';

export type ProblemStatementData = z.infer<typeof ProblemStatementSchema>;
export type ProblemStatementSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/save-drawer"
echo "Creating src/components/save-drawer/DeployConnector.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/DeployConnector.tsx"
import type { StepState } from '@/types/deploy';

interface DeployConnectorProps {
  fromState: StepState;
  toState: StepState;
  color: string;
}

export function DeployConnector({ fromState, toState, color }: DeployConnectorProps) {
  const filled = fromState === 'done' && toState === 'done';
  const filling = fromState === 'done' && toState === 'active';
  const lit = filled || filling;

  return (
    <div className="jp-drawer-connector">
      <div className="jp-drawer-connector-base" />

      <div
        className="jp-drawer-connector-fill"
        style={{
          background: `linear-gradient(90deg, ${color}cc, ${color}66)`,
          width: filled ? '100%' : filling ? '100%' : '0%',
          transition: filling ? 'width 2s cubic-bezier(0.4,0,0.2,1)' : 'none',
          boxShadow: lit ? `0 0 8px ${color}77` : 'none',
        }}
      />

      {filling && (
        <div
          className="jp-drawer-connector-orb"
          style={{
            background: color,
            boxShadow: `0 0 14px ${color}, 0 0 28px ${color}88`,
            animation: 'orb-travel 2s cubic-bezier(0.4,0,0.6,1) forwards',
          }}
        />
      )}
    </div>
  );
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/DeployNode.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/DeployNode.tsx"
import type { CSSProperties } from 'react';
import type { DeployStep, StepState } from '@/types/deploy';

interface DeployNodeProps {
  step: DeployStep;
  state: StepState;
}

export function DeployNode({ step, state }: DeployNodeProps) {
  const isActive = state === 'active';
  const isDone = state === 'done';
  const isPending = state === 'pending';

  return (
    <div className="jp-drawer-node-wrap">
      <div
        className={`jp-drawer-node ${isPending ? 'jp-drawer-node-pending' : ''}`}
        style={
          {
            background: isDone ? step.color : isActive ? 'rgba(0,0,0,0.5)' : undefined,
            borderWidth: isDone ? 0 : 1,
            borderColor: isActive ? `${step.color}80` : undefined,
            boxShadow: isDone
              ? `0 0 20px ${step.color}55, 0 0 40px ${step.color}22`
              : isActive
                ? `0 0 14px ${step.color}33`
                : undefined,
            animation: isActive ? 'node-glow 2s ease infinite' : undefined,
            ['--glow-color' as string]: step.color,
          } as CSSProperties
        }
      >
        {isDone && (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-label="Done">
            <path
              className="stroke-dash-30 animate-check-draw"
              d="M5 13l4 4L19 7"
              stroke="#0a0f1a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {isActive && (
          <span
            className="jp-drawer-node-glyph jp-drawer-node-glyph-active"
            style={{ color: step.color, animation: 'glyph-rotate 9s linear infinite' }}
            aria-hidden
          >
            {step.glyph}
          </span>
        )}

        {isPending && (
          <span className="jp-drawer-node-glyph jp-drawer-node-glyph-pending" aria-hidden>
            {step.glyph}
          </span>
        )}

        {isActive && (
          <span
            className="jp-drawer-node-ring"
            style={{
              inset: -7,
              borderColor: `${step.color}50`,
              animation: 'ring-expand 2s ease-out infinite',
            }}
          />
        )}
      </div>

      <span
        className="jp-drawer-node-label"
        style={{ color: isDone ? step.color : isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)' }}
      >
        {step.label}
      </span>
    </div>
  );
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/DopaDrawer.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/DopaDrawer.tsx"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { StepId, StepState } from '@/types/deploy';
import { DEPLOY_STEPS } from '@/lib/deploySteps';
import fontsCss from '@/fonts.css?inline';
import saverStyleCss from './saverStyle.css?inline';
import { DeployNode } from './DeployNode';
import { DeployConnector } from './DeployConnector';
import { BuildBars, ElapsedTimer, Particles, SuccessBurst } from './Visuals';

interface DopaDrawerProps {
  isOpen: boolean;
  phase: 'idle' | 'running' | 'done' | 'error';
  currentStepId: StepId | null;
  doneSteps: StepId[];
  progress: number;
  errorMessage?: string;
  deployUrl?: string;
  onClose: () => void;
  onRetry: () => void;
}

export function DopaDrawer({
  isOpen,
  phase,
  currentStepId,
  doneSteps,
  progress,
  errorMessage,
  deployUrl,
  onClose,
  onRetry,
}: DopaDrawerProps) {
  const [shadowMount, setShadowMount] = useState<HTMLElement | null>(null);
  const [burst, setBurst] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const isRunning = phase === 'running';
  const isDone = phase === 'done';
  const isError = phase === 'error';

  useEffect(() => {
    const host = document.createElement('div');
    host.setAttribute('data-jp-drawer-shadow-host', '');

    const shadowRoot = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `${fontsCss}\n${saverStyleCss}`;

    const mount = document.createElement('div');
    shadowRoot.append(style, mount);

    document.body.appendChild(host);
    setShadowMount(mount);

    return () => {
      setShadowMount(null);
      host.remove();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setBurst(false);
      setCountdown(3);
      return;
    }
    if (isDone) setBurst(true);
  }, [isDone, isOpen]);

  useEffect(() => {
    if (!isOpen || !isDone) return;
    setCountdown(3);
    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isDone, isOpen, onClose]);

  const currentStep = useMemo(
    () => DEPLOY_STEPS.find((step) => step.id === currentStepId) ?? null,
    [currentStepId]
  );

  const activeColor = isDone ? '#34d399' : isError ? '#f87171' : (currentStep?.color ?? '#60a5fa');
  const particleCount = isDone ? 40 : doneSteps.length === 3 ? 28 : doneSteps.length === 2 ? 16 : doneSteps.length === 1 ? 8 : 4;

  const stepState = (index: number): StepState => {
    const step = DEPLOY_STEPS[index];
    if (doneSteps.includes(step.id)) return 'done';
    if (phase === 'running' && currentStepId === step.id) return 'active';
    return 'pending';
  };

  if (!shadowMount || !isOpen || phase === 'idle') return null;

  return createPortal(
    <div className="jp-drawer-root">
      <div
        className="jp-drawer-overlay animate-fade-in"
        onClick={isDone || isError ? onClose : undefined}
        aria-hidden
      />

      <div
        role="status"
        aria-live="polite"
        aria-label={isDone ? 'Deploy completed' : isError ? 'Deploy failed' : 'Deploying'}
        className="jp-drawer-shell animate-drawer-up"
        style={{ bottom: 'max(2.25rem, env(safe-area-inset-bottom))' }}
      >
        <div
          className="jp-drawer-card"
          style={{
            backgroundColor: 'hsl(222 18% 7%)',
            boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 -20px 60px rgba(0,0,0,0.6), 0 0 80px ${activeColor}0d`,
            transition: 'box-shadow 1.2s ease',
          }}
        >
          <div
            className="jp-drawer-ambient"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 110%, ${activeColor}12 0%, transparent 65%)`,
              transition: 'background 1.5s ease',
              animation: 'ambient-pulse 3.5s ease infinite',
            }}
            aria-hidden
          />

          {isDone && (
            <div className="jp-drawer-shimmer" aria-hidden>
              <div
                className="jp-drawer-shimmer-bar"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                  animation: 'shimmer-sweep 1.4s 0.1s ease forwards',
                }}
              />
            </div>
          )}

          <Particles count={particleCount} color={activeColor} />
          {burst && <SuccessBurst />}

          <div className="jp-drawer-content">
            <div className="jp-drawer-header">
              <div className="jp-drawer-header-left">
                <div className="jp-drawer-status" style={{ color: activeColor }}>
                  <span
                    className="jp-drawer-status-dot"
                    style={{
                      background: activeColor,
                      boxShadow: `0 0 6px ${activeColor}`,
                      animation: isRunning ? 'ambient-pulse 1.5s ease infinite' : 'none',
                    }}
                    aria-hidden
                  />
                  {isDone ? 'Live' : isError ? 'Build failed' : currentStep?.verb ?? 'Saving'}
                </div>

                <div key={currentStep?.id ?? phase} className="jp-drawer-copy animate-text-in">
                  {isDone ? (
                    <div className="animate-success-pop">
                      <p className="jp-drawer-copy-title jp-drawer-copy-title-lg">Your content is live.</p>
                      <p className="jp-drawer-copy-sub">Deployed to production successfully</p>
                    </div>
                  ) : isError ? (
                    <>
                      <p className="jp-drawer-copy-title jp-drawer-copy-title-md">Deploy failed at build.</p>
                      <p className="jp-drawer-copy-sub jp-drawer-copy-sub-error">{errorMessage ?? 'Check your Vercel logs or retry below'}</p>
                    </>
                  ) : currentStep ? (
                    <>
                      <p className="jp-drawer-poem-line jp-drawer-poem-line-1">{currentStep.poem[0]}</p>
                      <p className="jp-drawer-poem-line jp-drawer-poem-line-2">{currentStep.poem[1]}</p>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="jp-drawer-right">
                {isDone ? (
                  <div className="jp-drawer-countdown-wrap animate-fade-up">
                    <span className="jp-drawer-countdown-text" aria-live="polite">
                      Chiusura in {countdown}s
                    </span>
                    <div className="jp-drawer-countdown-track">
                      <div className="jp-drawer-countdown-bar countdown-bar" style={{ boxShadow: '0 0 6px #34d39988' }} />
                    </div>
                  </div>
                ) : (
                  <ElapsedTimer running={isRunning} />
                )}
              </div>
            </div>

            <div className="jp-drawer-track-row">
              {DEPLOY_STEPS.map((step, i) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: i < DEPLOY_STEPS.length - 1 ? 1 : 'none' }}>
                  <DeployNode step={step} state={stepState(i)} />
                  {i < DEPLOY_STEPS.length - 1 && (
                    <DeployConnector fromState={stepState(i)} toState={stepState(i + 1)} color={DEPLOY_STEPS[i + 1].color} />
                  )}
                </div>
              ))}
            </div>

            <div className="jp-drawer-bars-wrap">
              <BuildBars active={stepState(2) === 'active'} />
            </div>

            <div className="jp-drawer-separator" />

            <div className="jp-drawer-footer">
              <div className="jp-drawer-progress">
                <div
                  className="jp-drawer-progress-indicator"
                  style={{
                    width: `${Math.max(0, Math.min(100, progress))}%`,
                    background: `linear-gradient(90deg, ${DEPLOY_STEPS[0].color}, ${activeColor})`,
                  }}
                />
              </div>

              <div className="jp-drawer-cta">
                {isDone && (
                  <div className="jp-drawer-btn-row animate-fade-up">
                    <button type="button" className="jp-drawer-btn jp-drawer-btn-secondary" onClick={onClose}>
                      Chiudi
                    </button>
                    <button
                      type="button"
                      className="jp-drawer-btn jp-drawer-btn-emerald"
                      onClick={() => {
                        if (deployUrl) window.open(deployUrl, '_blank', 'noopener,noreferrer');
                      }}
                      disabled={!deployUrl}
                    >
                      <span aria-hidden>↗</span> Open site
                    </button>
                  </div>
                )}

                {isError && (
                  <div className="jp-drawer-btn-row animate-fade-up">
                    <button type="button" className="jp-drawer-btn jp-drawer-btn-ghost" onClick={onClose}>
                      Annulla
                    </button>
                    <button type="button" className="jp-drawer-btn jp-drawer-btn-destructive" onClick={onRetry}>
                      Retry
                    </button>
                  </div>
                )}

                {isRunning && (
                  <span className="jp-drawer-running-step" aria-hidden>
                    {doneSteps.length + 1} / {DEPLOY_STEPS.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    shadowMount
  );
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/Visuals.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/Visuals.tsx"
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
}

const PARTICLE_POOL: Particle[] = Array.from({ length: 44 }, (_, i) => ({
  id: i,
  x: 5 + Math.random() * 90,
  y: 15 + Math.random() * 70,
  size: 1.5 + Math.random() * 2.5,
  dur: 2.8 + Math.random() * 3.5,
  delay: Math.random() * 4,
}));

interface ParticlesProps {
  count: number;
  color: string;
}

export function Particles({ count, color }: ParticlesProps) {
  return (
    <div className="jp-drawer-particles" aria-hidden>
      {PARTICLE_POOL.slice(0, count).map((particle) => (
        <div
          key={particle.id}
          className="jp-drawer-particle"
          style={{
            left: `${particle.x}%`,
            bottom: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: color,
            boxShadow: `0 0 ${particle.size * 3}px ${color}`,
            opacity: 0,
            animation: `particle-float ${particle.dur}s ${particle.delay}s ease-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

const BAR_H = [0.45, 0.75, 0.55, 0.9, 0.65, 0.8, 0.5, 0.72, 0.6, 0.85, 0.42, 0.7];

interface BuildBarsProps {
  active: boolean;
}

export function BuildBars({ active }: BuildBarsProps) {
  if (!active) return <div className="jp-drawer-bars-placeholder" />;

  return (
    <div className="jp-drawer-bars" aria-hidden>
      {BAR_H.map((height, i) => (
        <div
          key={i}
          className="jp-drawer-bar"
          style={{
            height: `${height * 100}%`,
            animation: `bar-eq ${0.42 + i * 0.06}s ${i * 0.04}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

const BURST_COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b', '#f472b6'];

export function SuccessBurst() {
  return (
    <div className="jp-drawer-burst" aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="jp-drawer-burst-dot"
          style={
            {
              background: BURST_COLORS[i % BURST_COLORS.length],
              ['--r' as string]: `${i * 22.5}deg`,
              animation: `burst-ray 0.85s ${i * 0.03}s cubic-bezier(0,0.6,0.5,1) forwards`,
              transform: `rotate(${i * 22.5}deg)`,
              transformOrigin: '50% 50%',
              opacity: 0,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

interface ElapsedTimerProps {
  running: boolean;
}

export function ElapsedTimer({ running }: ElapsedTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    if (!startRef.current) startRef.current = performance.now();

    const tick = () => {
      if (!startRef.current) return;
      setElapsed(Math.floor((performance.now() - startRef.current) / 1000));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const sec = String(elapsed % 60).padStart(2, '0');
  const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
  return <span className="jp-drawer-elapsed" aria-live="off">{min}:{sec}</span>;
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/saverStyle.css..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/saverStyle.css"
/* Save Drawer strict_full isolated stylesheet */

.jp-drawer-root {
  --background: 222 18% 6%;
  --foreground: 210 20% 96%;
  --card: 222 16% 8%;
  --card-foreground: 210 20% 96%;
  --primary: 0 0% 95%;
  --primary-foreground: 222 18% 6%;
  --secondary: 220 14% 13%;
  --secondary-foreground: 210 20% 96%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 98%;
  --border: 220 14% 13%;
  --radius: 0.6rem;
  font-family: 'Geist', system-ui, sans-serif;
}

.jp-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  background: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(2px);
}

.jp-drawer-shell {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 2147483601;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
}

.jp-drawer-card {
  position: relative;
  width: 100%;
  max-width: 31rem;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgb(255 255 255 / 0.07);
}

.jp-drawer-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.jp-drawer-shimmer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.jp-drawer-shimmer-bar {
  position: absolute;
  inset-block: 0;
  width: 35%;
}

.jp-drawer-content {
  position: relative;
  z-index: 10;
  padding: 2rem 2rem 1.75rem;
}

.jp-drawer-header {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.jp-drawer-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.jp-drawer-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.5s;
}

.jp-drawer-status-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  display: inline-block;
}

.jp-drawer-copy {
  min-height: 52px;
}

.jp-drawer-copy-title {
  margin: 0;
  color: white;
  line-height: 1.25;
  font-weight: 600;
}

.jp-drawer-copy-title-lg {
  font-size: 1.125rem;
}

.jp-drawer-copy-title-md {
  font-size: 1rem;
}

.jp-drawer-copy-sub {
  margin: 0.125rem 0 0;
  color: rgb(255 255 255 / 0.4);
  font-size: 0.875rem;
}

.jp-drawer-copy-sub-error {
  color: rgb(255 255 255 / 0.35);
}

.jp-drawer-poem-line {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.5;
}

.jp-drawer-poem-line-1 {
  color: rgb(255 255 255 / 0.55);
}

.jp-drawer-poem-line-2 {
  color: rgb(255 255 255 / 0.3);
}

.jp-drawer-right {
  margin-left: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}

.jp-drawer-countdown-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.jp-drawer-countdown-text {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #34d399;
}

.jp-drawer-countdown-track {
  width: 6rem;
  height: 0.125rem;
  border-radius: 9999px;
  overflow: hidden;
  background: rgb(255 255 255 / 0.1);
}

.jp-drawer-countdown-bar {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: #34d399;
}

.jp-drawer-track-row {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.jp-drawer-bars-wrap {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.jp-drawer-separator {
  margin-bottom: 1rem;
  height: 1px;
  width: 100%;
  border: 0;
  background: rgb(255 255 255 / 0.06);
}

.jp-drawer-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.jp-drawer-progress {
  flex: 1;
  height: 2px;
  border-radius: 9999px;
  overflow: hidden;
  background: rgb(255 255 255 / 0.06);
}

.jp-drawer-progress-indicator {
  height: 100%;
}

.jp-drawer-cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.jp-drawer-running-step {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  color: rgb(255 255 255 / 0.2);
}

.jp-drawer-btn-row {
  display: flex;
  gap: 0.5rem;
}

.jp-drawer-btn {
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1;
  height: 2.25rem;
  padding: 0 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.jp-drawer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.jp-drawer-btn-secondary {
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.jp-drawer-btn-secondary:hover {
  filter: brightness(1.08);
}

.jp-drawer-btn-emerald {
  background: #34d399;
  color: #18181b;
  font-weight: 600;
}

.jp-drawer-btn-emerald:hover {
  background: #6ee7b7;
}

.jp-drawer-btn-ghost {
  background: transparent;
  color: rgb(255 255 255 / 0.9);
}

.jp-drawer-btn-ghost:hover {
  background: rgb(255 255 255 / 0.08);
}

.jp-drawer-btn-destructive {
  background: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}

.jp-drawer-btn-destructive:hover {
  filter: brightness(1.06);
}

.jp-drawer-node-wrap {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}

.jp-drawer-node {
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;
}

.jp-drawer-node-pending {
  border-color: rgb(255 255 255 / 0.08);
  background: rgb(255 255 255 / 0.02);
}

.jp-drawer-node-glyph {
  font-size: 1.125rem;
  line-height: 1;
}

.jp-drawer-node-glyph-active {
  display: inline-block;
}

.jp-drawer-node-glyph-pending {
  color: rgb(255 255 255 / 0.15);
}

.jp-drawer-node-ring {
  position: absolute;
  border-radius: 9999px;
  border: 1px solid transparent;
}

.jp-drawer-node-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.5s;
}

.jp-drawer-connector {
  position: relative;
  z-index: 0;
  flex: 1;
  height: 2px;
  margin-top: -24px;
}

.jp-drawer-connector-base {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.08);
}

.jp-drawer-connector-fill {
  position: absolute;
  left: 0;
  right: auto;
  top: 0;
  bottom: 0;
  border-radius: 9999px;
}

.jp-drawer-connector-orb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 9999px;
}

.jp-drawer-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.jp-drawer-particle {
  position: absolute;
  border-radius: 9999px;
}

.jp-drawer-bars {
  height: 1.75rem;
  display: flex;
  align-items: flex-end;
  gap: 3px;
}

.jp-drawer-bars-placeholder {
  height: 1.75rem;
}

.jp-drawer-bar {
  width: 3px;
  border-radius: 2px;
  background: #f59e0b;
  transform-origin: bottom;
}

.jp-drawer-burst {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.jp-drawer-burst-dot {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 9999px;
}

.jp-drawer-elapsed {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgb(255 255 255 / 0.25);
}

/* Animation helper classes */
.animate-drawer-up { animation: drawer-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.animate-fade-in { animation: fade-in 0.25s ease forwards; }
.animate-fade-up { animation: fade-up 0.35s ease forwards; }
.animate-text-in { animation: text-in 0.3s ease forwards; }
.animate-success-pop { animation: success-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.countdown-bar { animation: countdown-drain 3s linear forwards; }

.stroke-dash-30 {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
}

.animate-check-draw {
  animation: check-draw 0.4s 0.05s ease forwards;
}

@keyframes check-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes drawer-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes text-in {
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes success-pop {
  0% { transform: scale(0.88); opacity: 0; }
  60% { transform: scale(1.04); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes ambient-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.65; }
}

@keyframes shimmer-sweep {
  from { transform: translateX(-100%); }
  to { transform: translateX(250%); }
}

@keyframes node-glow {
  0%, 100% { box-shadow: 0 0 12px var(--glow-color,#60a5fa55); }
  50% { box-shadow: 0 0 28px var(--glow-color,#60a5fa88), 0 0 48px var(--glow-color,#60a5fa22); }
}

@keyframes glyph-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ring-expand {
  from { transform: scale(1); opacity: 0.7; }
  to { transform: scale(2.1); opacity: 0; }
}

@keyframes orb-travel {
  from { left: 0%; }
  to { left: calc(100% - 10px); }
}

@keyframes particle-float {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(-90px) scale(0.3); opacity: 0; }
}

@keyframes bar-eq {
  from { transform: scaleY(0.4); }
  to { transform: scaleY(1); }
}

@keyframes burst-ray {
  0% { transform: rotate(var(--r, 0deg)) translateX(0); opacity: 1; }
  100% { transform: rotate(var(--r, 0deg)) translateX(56px); opacity: 0; }
}

@keyframes countdown-drain {
  from { width: 100%; }
  to { width: 0%; }
}


END_OF_FILE_CONTENT
mkdir -p "src/components/tiptap"
echo "Creating src/components/tiptap/INTEGRATION.md..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/INTEGRATION.md"
# Tiptap Editorial — Integration Guide

How to add the `tiptap` section to a new tenant.

---

## 1. Copy the component

Copy the entire folder into the new tenant:

```
src/components/tiptap/
  index.ts
  types.ts
  View.tsx
```

---

## 2. Install npm dependencies

Add to the tenant's `package.json` and run `npm install`:

```json
"@tiptap/extension-image": "^2.11.5",
"@tiptap/extension-link": "^2.11.5",
"@tiptap/react": "^2.11.5",
"@tiptap/starter-kit": "^2.11.5",
"react-markdown": "^9.0.1",
"rehype-sanitize": "^6.0.0",
"remark-gfm": "^4.0.1",
"tiptap-markdown": "^0.8.10"
```

---

## 3. CSS in `src/index.css`

**tenant-alpha:** typography for visitor markdown (`.jp-tiptap-content`) and Studio (`.jp-simple-editor .ProseMirror`) lives in **`src/index.css`**, section **`4b. TIPTAP`** — only `:root` bridge variables (`--theme-text-*`, `--theme-font-*`, `--theme-leading-*`, `--theme-tracking-*`, `--theme-radius-*`, `--foreground`, `--primary`, `--border`, …) so prose tracks **`theme.json`** via the engine.

When copying this capsule into another tenant, copy that block from **tenant-alpha** `index.css` (or ensure your tenant’s global CSS exposes the same semantic vars).

---

## 4. Register in `src/lib/schemas.ts`

```ts
import { TiptapSchema } from '@/components/tiptap';

export const SECTION_SCHEMAS = {
  // ... existing schemas
  'tiptap': TiptapSchema,
} as const;
```

---

## 5. Register in `src/lib/addSectionConfig.ts`

```ts
const addableSectionTypes = [
  // ... existing types
  'tiptap',
] as const;

const sectionTypeLabels = {
  // ... existing labels
  'tiptap': 'Tiptap Editorial',
};

function getDefaultSectionData(type: string) {
  switch (type) {
    // ... existing cases
    case 'tiptap': return { content: '# Post title\n\nStart writing in Markdown...' };
  }
}
```

---

## 6. Register in `src/lib/ComponentRegistry.tsx`

```tsx
import { Tiptap } from '@/components/tiptap';

export const ComponentRegistry = {
  // ... existing components
  'tiptap': Tiptap,
};
```

---

## 7. Register in `src/types.ts`

```ts
import type { TiptapData, TiptapSettings } from '@/components/tiptap';

export type SectionComponentPropsMap = {
  // ... existing entries
  'tiptap': { data: TiptapData; settings?: TiptapSettings };
};

declare module '@jsonpages/core' {
  export interface SectionDataRegistry {
    // ... existing entries
    'tiptap': TiptapData;
  }
  export interface SectionSettingsRegistry {
    // ... existing entries
    'tiptap': TiptapSettings;
  }
}
```

---

## Notes

- Typography uses tenant CSS variables (`--primary`, `--border`, `--muted-foreground`, `--font-mono`) — no hardcoded colors.
- `@tailwindcss/typography` is **not** required; the CSS blocks above replace it.
- The toolbar is admin-only (studio mode). In visitor mode, content is rendered via `ReactMarkdown`.
- Underline is intentionally excluded: `tiptap-markdown` with `html: false` cannot round-trip `<u>` tags.

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/View.tsx"
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { Components, ExtraProps } from 'react-markdown';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import {
  Undo2, Redo2,
  List, ListOrdered,
  Bold, Italic, Strikethrough,
  Code2, Quote, SquareCode,
  Link2, Unlink2, ImagePlus, Eraser,
} from 'lucide-react';
import { STUDIO_EVENTS, useConfig, useStudio } from '@olonjs/core';
import type { TiptapData, TiptapSettings } from './types';

// ── TOC helpers ───────────────────────────────────────────────────────────────

type TocEntry = { id: string; text: string; level: 2 | 3 };

function slugify(raw: string): string {
  return raw
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
    .replace(/[*_`#[\]()]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s.-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const line of markdown.split('\n')) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      const text = h2[1].replace(/[*_`#[\]]/g, '').replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim();
      entries.push({ id: slugify(h2[1]), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/[*_`#[\]]/g, '').trim();
      entries.push({ id: slugify(h3[1]), text, level: 3 });
    }
  }
  return entries;
}

/** Plain text from react-markdown heading children — must match extractToc slugify input semantics. */
function mdChildrenToPlainText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(mdChildrenToPlainText).join('');
  if (React.isValidElement(node)) {
    const ch = (node.props as { children?: React.ReactNode }).children;
    if (ch != null) return mdChildrenToPlainText(ch);
  }
  return '';
}

function readScrollSpyOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--theme-header-h').trim();
  const n = parseFloat(raw);
  const header = Number.isFinite(n) ? n : 56;
  return header + 24;
}

/** Last TOC id whose heading is at or above the activation line (viewport top + offset). */
function computeActiveTocId(ids: readonly string[], offsetPx: number): string {
  let active = '';
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= offsetPx) active = id;
  }
  return active;
}

/** Studio: ProseMirror headings usually have no `id`; match slug(text) to TOC ids in DOM order. */
function computeActiveTocIdFromHeadings(
  container: HTMLElement,
  toc: readonly TocEntry[],
  offsetPx: number
): string {
  const allowed = new Set(toc.map((e) => e.id));
  let active = '';
  container.querySelectorAll<HTMLElement>('h2, h3').forEach((h) => {
    const id = slugify(h.textContent ?? '');
    if (!allowed.has(id)) return;
    if (h.getBoundingClientRect().top <= offsetPx) active = id;
  });
  return active;
}

// ── Sidebar (always rendered, both in Studio and Public) ──────────────────────

const DocsSidebar: React.FC<{
  toc: TocEntry[];
  activeId: string;
  onNav: (id: string) => void;
}> = ({ toc, activeId, onNav }) => {
  const navScrollRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!activeId || !navScrollRef.current) return;
    const btn = navScrollRef.current.querySelector<HTMLButtonElement>(
      `button[data-toc-id="${CSS.escape(activeId)}"]`
    );
    btn?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeId, toc]);

  return (
    <aside
      className="hidden w-[min(240px,28vw)] flex-shrink-0 flex-col lg:flex lg:sticky lg:self-start"
      style={{
        top: 'calc(var(--theme-header-h, 56px) + 1rem)',
        maxHeight: 'calc(100vh - var(--theme-header-h, 56px) - 4rem)',
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--local-radius-md)] border border-[var(--local-border)] bg-[color-mix(in_srgb,var(--local-toolbar-bg)_40%,transparent)]">
        <div className="shrink-0 border-b border-[var(--local-border)] px-3 py-2.5">
          <div className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-[var(--local-toolbar-text)]">
            On this page
          </div>
        </div>
        <nav
          ref={navScrollRef}
          className="jp-docs-toc-scroll flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-y-contain px-1.5 py-2"
          aria-label="Table of contents"
        >
          {toc.map((entry) => (
            <button
              key={entry.id}
              type="button"
              data-toc-id={entry.id}
              onClick={() => onNav(entry.id)}
              className={[
                'text-left rounded-[var(--local-radius-sm)] transition-colors duration-150 no-underline',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--local-bg)]',
                entry.level === 3
                  ? 'pl-[22px] pr-2 py-1.5 text-[0.72rem] ml-0.5'
                  : 'px-2.5 py-2 font-bold text-[0.76rem]',
                activeId === entry.id
                  ? entry.level === 2
                    ? 'text-[var(--local-primary)] bg-[var(--local-toolbar-hover-bg)] border-l-2 border-[var(--local-primary)] pl-[8px]'
                    : 'text-[var(--local-primary)] font-semibold bg-[var(--local-toolbar-active-bg)]'
                  : 'text-[var(--local-text-muted)] hover:text-[var(--local-text)] hover:bg-[var(--local-toolbar-hover-bg)]',
              ].join(' ')}
            >
              {entry.level === 3 && (
                <span
                  className={`mr-2 inline-block h-[5px] w-[5px] flex-shrink-0 rounded-full align-middle mb-px ${
                    activeId === entry.id ? 'bg-[var(--local-primary)]' : 'bg-[var(--local-border)]'
                  }`}
                />
              )}
              <span className="line-clamp-3">{entry.text}</span>
            </button>
          ))}
        </nav>
        <div className="shrink-0 border-t border-[var(--local-border)] px-2 py-2.5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex w-full items-center gap-2 px-2 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--local-text-muted)] transition-colors hover:text-[var(--local-primary)]"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </aside>
  );
};

// ── UI primitives ─────────────────────────────────────────────────────────────

const Btn: React.FC<{
  active?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active = false, title, onClick, children }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={[
      'inline-flex h-7 min-w-7 items-center justify-center rounded-[var(--local-radius-sm)] px-2 text-xs transition-colors',
      active
        ? 'bg-[var(--local-toolbar-active-bg)] text-[var(--local-text)]'
        : 'text-[var(--local-toolbar-text)] hover:bg-[var(--local-toolbar-hover-bg)] hover:text-[var(--local-text)]',
    ].join(' ')}
  >
    {children}
  </button>
);

const Sep: React.FC = () => (
  <span className="mx-0.5 h-5 w-px shrink-0 bg-[var(--local-toolbar-border)]" aria-hidden />
);

// ── Image extension with upload metadata ──────────────────────────────────────

const UploadableImage = Image.extend({
  addAttributes() {
    const bool = (attr: string) => ({
      default: false,
      parseHTML: (el: HTMLElement) => el.getAttribute(attr) === 'true',
      renderHTML: (attrs: Record<string, unknown>) =>
        attrs[attr.replace('data-', '').replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())]
          ? { [attr]: 'true' }
          : {},
    });
    return {
      ...this.parent?.(),
      uploadId: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute('data-upload-id'),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.uploadId ? { 'data-upload-id': String(attrs.uploadId) } : {},
      },
      uploading: bool('data-uploading'),
      uploadError: bool('data-upload-error'),
      awaitingUpload: bool('data-awaiting-upload'),
    };
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const getMarkdown = (ed: Editor | null | undefined): string =>
  (ed?.storage as { markdown?: { getMarkdown?: () => string } } | undefined)
    ?.markdown?.getMarkdown?.() ?? '';

const svg = (body: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='420' viewBox='0 0 1200 420'>${body}</svg>`
  );

const RECT = `<rect width='1200' height='420' fill='#090B14' stroke='#3F3F46' stroke-width='3' stroke-dasharray='10 10' rx='12'/>`;

const UPLOADING_SRC = svg(
  RECT +
  `<text x='600' y='215' font-family='Inter,Arial,sans-serif' font-size='28' font-weight='700' fill='#A1A1AA' text-anchor='middle'>Uploading image…</text>`
);

const PICKER_SRC = svg(
  RECT +
  `<text x='600' y='200' font-family='Inter,Arial,sans-serif' font-size='32' font-weight='700' fill='#E4E4E7' text-anchor='middle'>Click to upload or drag &amp; drop</text>` +
  `<text x='600' y='248' font-family='Inter,Arial,sans-serif' font-size='22' fill='#A1A1AA' text-anchor='middle'>Max 5 MB per file</text>`
);

const patchImage = (
  ed: Editor,
  uploadId: string,
  patch: Record<string, unknown>
): boolean => {
  let pos: number | null = null;
  ed.state.doc.descendants(
    (node: { type: { name: string }; attrs?: Record<string, unknown> }, p: number) => {
      if (node.type.name === 'image' && node.attrs?.uploadId === uploadId) {
        pos = p;
        return false;
      }
      return true;
    }
  );
  if (pos == null) return false;
  const cur = ed.state.doc.nodeAt(pos);
  if (!cur) return false;
  ed.view.dispatch(ed.state.tr.setNodeMarkup(pos, undefined, { ...cur.attrs, ...patch }));
  return true;
};

// Extensions defined outside component — stable reference, no re-creation on render
const EXTENSIONS = [
  StarterKit,
  Link.configure({ openOnClick: false, autolink: true }),
  UploadableImage,
  // NOTE: Underline is intentionally excluded.
  // tiptap-markdown with html:false cannot round-trip <u> tags, so underline
  // would be silently dropped on save. Use bold/italic instead.
  Markdown.configure({ html: false }),
];

const EDITOR_CLASSES =
  'min-h-[220px] p-4 outline-none';

// ── Studio editor component ───────────────────────────────────────────────────

const StudioTiptapEditor: React.FC<{ data: TiptapData }> = ({ data }) => {
  const { assets } = useConfig();

  // DOM refs
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Editor & upload state
  const editorRef = React.useRef<Editor | null>(null);
  const pendingUploads = React.useRef<Map<string, Promise<void>>>(new Map());
  const pendingPickerId = React.useRef<string | null>(null);

  // Markdown sync refs
  const latestMd = React.useRef<string>(data.content ?? '');
  const emittedMd = React.useRef<string>(data.content ?? '');

  // Link popover state
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const linkInputRef = React.useRef<HTMLInputElement | null>(null);

  // ── Core helpers ────────────────────────────────────────────────────────

  const getSectionId = React.useCallback((): string | null => {
    const el =
      sectionRef.current ??
      (hostRef.current?.closest('[data-section-id]') as HTMLElement | null);
    sectionRef.current = el;
    return el?.getAttribute('data-section-id') ?? null;
  }, []);

  const emit = React.useCallback(
    (markdown: string) => {
      latestMd.current = markdown;
      const sectionId = getSectionId();
      if (!sectionId) return;
      window.parent.postMessage(
        {
          type: STUDIO_EVENTS.INLINE_FIELD_UPDATE,
          sectionId,
          fieldKey: 'content',
          value: markdown,
        },
        window.location.origin
      );
      emittedMd.current = markdown;
    },
    [getSectionId]
  );

  const setFocusLock = React.useCallback((on: boolean) => {
    sectionRef.current?.classList.toggle('jp-editorial-focus', on);
  }, []);

  // ── Image upload ─────────────────────────────────────────────────────────

  const insertPlaceholder = React.useCallback(
    (uploadId: string, src: string, awaitingUpload: boolean) => {
      const ed = editorRef.current;
      if (!ed) return;
      ed.chain()
        .focus()
        .setImage({
          src,
          alt: 'upload-placeholder',
          title: awaitingUpload ? 'Click to upload' : 'Uploading…',
          uploadId,
          uploading: !awaitingUpload,
          awaitingUpload,
          uploadError: false,
        } as any)
        .run();
      emit(getMarkdown(ed));
    },
    [emit]
  );

  const doUpload = React.useCallback(
    async (uploadId: string, file: File) => {
      const uploadFn = assets?.onAssetUpload;
      if (!uploadFn) return;
      const ed = editorRef.current;
      if (!ed) return;
      patchImage(ed, uploadId, {
        src: UPLOADING_SRC,
        alt: file.name,
        title: file.name,
        uploading: true,
        awaitingUpload: false,
        uploadError: false,
      });
      const task = (async () => {
        try {
          const url = await uploadFn(file);
          const cur = editorRef.current;
          if (cur) {
            patchImage(cur, uploadId, {
              src: url,
              alt: file.name,
              title: file.name,
              uploadId: null,
              uploading: false,
              awaitingUpload: false,
              uploadError: false,
            });
            emit(getMarkdown(cur));
          }
        } catch (err) {
          console.error('[tiptap] upload failed', err);
          const cur = editorRef.current;
          if (cur)
            patchImage(cur, uploadId, {
              uploading: false,
              awaitingUpload: false,
              uploadError: true,
            });
        } finally {
          pendingUploads.current.delete(uploadId);
        }
      })();
      pendingUploads.current.set(uploadId, task);
      await task;
    },
    [assets, emit]
  );

  const uploadFile = React.useCallback(
    async (file: File) => {
      const id = crypto.randomUUID();
      insertPlaceholder(id, UPLOADING_SRC, false);
      await doUpload(id, file);
    },
    [insertPlaceholder, doUpload]
  );

  // ── Stable editorProps via refs (avoids stale closures in useEditor) ─────
  // Reads refs at call-time so useEditor never needs to rebuild the editor.

  const uploadFileRef = React.useRef(uploadFile);
  uploadFileRef.current = uploadFile;
  const assetsRef = React.useRef(assets);
  assetsRef.current = assets;

  const editorProps = React.useMemo(
    () => ({
      attributes: { class: EDITOR_CLASSES },
      handleDrop: (_v: unknown, event: DragEvent) => {
        const file = event.dataTransfer?.files?.[0];
        if (!file?.type.startsWith('image/') || !assetsRef.current?.onAssetUpload) return false;
        event.preventDefault();
        void uploadFileRef.current(file).catch((e) =>
          console.error('[tiptap] drop upload failed', e)
        );
        return true;
      },
      handlePaste: (_v: unknown, event: ClipboardEvent) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((f: File) =>
          f.type.startsWith('image/')
        );
        if (!file || !assetsRef.current?.onAssetUpload) return false;
        event.preventDefault();
        void uploadFileRef.current(file).catch((e) =>
          console.error('[tiptap] paste upload failed', e)
        );
        return true;
      },
      handleClickOn: (
        _v: unknown,
        _p: number,
        node: { type: { name: string }; attrs?: Record<string, unknown> }
      ) => {
        if (node.type.name !== 'image' || node.attrs?.awaitingUpload !== true) return false;
        const uploadId =
          typeof node.attrs?.uploadId === 'string' ? node.attrs.uploadId : null;
        if (!uploadId) return false;
        pendingPickerId.current = uploadId;
        fileInputRef.current?.click();
        return true;
      },
    }),
    [] // intentionally empty — reads refs at call-time
  );

  // ── useEditor ─────────────────────────────────────────────────────────────

  const emitRef = React.useRef(emit);
  emitRef.current = emit;

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: data.content ?? '',
    autofocus: false,
    editorProps,
    onUpdate: ({ editor: e }: { editor: Editor }) => emitRef.current(getMarkdown(e)),
    onFocus: () => setFocusLock(true),
    onBlur: ({ editor: e }: { editor: Editor }) => {
      const md = getMarkdown(e);
      if (md !== emittedMd.current) emitRef.current(md);
      setFocusLock(false);
    },
  });

  // ── Effects ───────────────────────────────────────────────────────────────

  React.useEffect(() => {
    sectionRef.current =
      hostRef.current?.closest('[data-section-id]') as HTMLElement | null;
  }, []);

  React.useEffect(() => {
    editorRef.current = editor ?? null;
  }, [editor]);

  // Sync external content changes into editor (e.g. engine-level undo)
  React.useEffect(() => {
    if (!editor) return;
    const next = data.content ?? '';
    if (next === latestMd.current) return;
    editor.commands.setContent(next);
    latestMd.current = next;
  }, [data.content, editor]);

  // PreviewEntry receives REQUEST_INLINE_FLUSH via postMessage and re-dispatches
  // it as a DOM CustomEvent. Listen to the DOM event — do NOT send INLINE_FLUSHED
  // back (PreviewEntry already handles that acknowledgement).
  React.useEffect(() => {
    const handler = () => {
      void (async () => {
        if (pendingUploads.current.size > 0) {
          await Promise.allSettled(Array.from(pendingUploads.current.values()));
        }
        emitRef.current(getMarkdown(editorRef.current));
      })();
    };
    window.addEventListener(STUDIO_EVENTS.REQUEST_INLINE_FLUSH, handler);
    return () => window.removeEventListener(STUDIO_EVENTS.REQUEST_INLINE_FLUSH, handler);
  }, []);

  // File input cancel: modern browsers fire a 'cancel' event when user
  // closes the picker without selecting a file.
  React.useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;
    const onCancel = () => {
      const pickId = pendingPickerId.current;
      if (pickId && editorRef.current) {
        patchImage(editorRef.current, pickId, {
          uploading: false,
          awaitingUpload: false,
          uploadError: true,
        });
      }
      pendingPickerId.current = null;
    };
    input.addEventListener('cancel', onCancel);
    return () => input.removeEventListener('cancel', onCancel);
  }, []);

  // Emit on unmount (safety flush)
  React.useEffect(
    () => () => {
      const md = getMarkdown(editorRef.current);
      if (md !== emittedMd.current) emitRef.current(md);
      setFocusLock(false);
    },
    [setFocusLock]
  );

  // Focus link input when popover opens
  React.useEffect(() => {
    if (linkOpen) {
      const t = setTimeout(() => linkInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [linkOpen]);

  // ── Toolbar actions ───────────────────────────────────────────────────────

  const openLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    setLinkUrl(prev ?? 'https://');
    setLinkOpen(true);
  };

  const applyLink = () => {
    if (!editor) return;
    const href = linkUrl.trim();
    if (href === '' || href === 'https://') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }
    setLinkOpen(false);
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const pickId = pendingPickerId.current;
    e.target.value = '';

    if (!file?.type.startsWith('image/') || !assets?.onAssetUpload) {
      // File picker opened but no valid file selected — clean up placeholder
      if (pickId && editorRef.current) {
        patchImage(editorRef.current, pickId, {
          uploading: false,
          awaitingUpload: false,
          uploadError: true,
        });
      }
      pendingPickerId.current = null;
      return;
    }

    void (async () => {
      try {
        if (pickId) {
          await doUpload(pickId, file);
          pendingPickerId.current = null;
        } else {
          await uploadFile(file);
        }
      } catch (err) {
        console.error('[tiptap] picker upload failed', err);
        pendingPickerId.current = null;
      }
    })();
  };

  const onPickImage = () => {
    if (pendingPickerId.current) return;
    const id = crypto.randomUUID();
    pendingPickerId.current = id;
    insertPlaceholder(id, PICKER_SRC, true);
  };

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor?.isActive(name, attrs) ?? false;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={hostRef} data-jp-field="content" className="space-y-2">
      {editor && (
        <div
          data-jp-ignore-select="true"
          className="sticky top-0 z-[65] border-b border-[var(--local-toolbar-border)] bg-[var(--local-toolbar-bg)]"
        >
          {/* ── Main toolbar ── */}
          <div className="flex flex-wrap items-center justify-center gap-1 p-2">
            {/* History */}
            <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
              <Undo2 size={13} />
            </Btn>
            <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
              <Redo2 size={13} />
            </Btn>
            <Sep />

            {/* Block type */}
            <Btn
              active={isActive('paragraph')}
              title="Paragraph"
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              P
            </Btn>
            <Btn
              active={isActive('heading', { level: 1 })}
              title="Heading 1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              H1
            </Btn>
            <Btn
              active={isActive('heading', { level: 2 })}
              title="Heading 2"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </Btn>
            <Btn
              active={isActive('heading', { level: 3 })}
              title="Heading 3"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </Btn>
            <Sep />

            {/* Inline marks */}
            <Btn
              active={isActive('bold')}
              title="Bold (Ctrl+B)"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={13} />
            </Btn>
            <Btn
              active={isActive('italic')}
              title="Italic (Ctrl+I)"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={13} />
            </Btn>
            <Btn
              active={isActive('strike')}
              title="Strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough size={13} />
            </Btn>
            <Btn
              active={isActive('code')}
              title="Inline code"
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code2 size={13} />
            </Btn>
            <Sep />

            {/* Lists & block nodes */}
            <Btn
              active={isActive('bulletList')}
              title="Bullet list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List size={13} />
            </Btn>
            <Btn
              active={isActive('orderedList')}
              title="Ordered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={13} />
            </Btn>
            <Btn
              active={isActive('blockquote')}
              title="Blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={13} />
            </Btn>
            <Btn
              active={isActive('codeBlock')}
              title="Code block"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <SquareCode size={13} />
            </Btn>
            <Sep />

            {/* Link / image / clear */}
            <Btn
              active={isActive('link') || linkOpen}
              title="Set link"
              onClick={openLink}
            >
              <Link2 size={13} />
            </Btn>
            <Btn
              title="Remove link"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <Unlink2 size={13} />
            </Btn>
            <Btn title="Insert image" onClick={onPickImage}>
              <ImagePlus size={13} />
            </Btn>
            <Btn
              title="Clear formatting"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            >
              <Eraser size={13} />
            </Btn>
          </div>

          {/* ── Link popover row (replaces window.prompt) ── */}
          {linkOpen && (
            <div className="flex items-center gap-2 border-t border-[var(--local-toolbar-border)] px-2 py-1.5">
              <Link2 size={12} className="shrink-0 text-[var(--local-toolbar-text)]" />
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyLink();
                  }
                  if (e.key === 'Escape') setLinkOpen(false);
                }}
                placeholder="https://example.com"
                className="min-w-0 flex-1 bg-transparent text-xs text-[var(--local-text)] placeholder:text-[var(--local-toolbar-text)] outline-none"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={applyLink}
                className="shrink-0 rounded-[var(--local-radius-sm)] px-2 py-0.5 text-xs bg-[var(--local-primary)] hover:brightness-110 text-white transition-colors"
              >
                Set
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setLinkOpen(false)}
                className="shrink-0 rounded-[var(--local-radius-sm)] px-2 py-0.5 text-xs bg-[var(--local-toolbar-active-bg)] hover:bg-[var(--local-toolbar-hover-bg)] text-[var(--local-text)] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <EditorContent editor={editor} className="jp-simple-editor" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />
    </div>
  );
};

// ── Public view ───────────────────────────────────────────────────────────────

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & ExtraProps;

const mdHeading =
  (level: 2 | 3) =>
  ({ children, node: _node, ...rest }: HeadingProps) => {
    const plain = mdChildrenToPlainText(children);
    const id = slugify(plain);
    const Tag = `h${level}` as 'h2' | 'h3';
    return (
      <Tag id={id} {...rest}>
        {children}
      </Tag>
    );
  };

const MD_COMPONENTS: Components = {
  h2: mdHeading(2),
  h3: mdHeading(3),
};

const PublicTiptapContent: React.FC<{ content: string }> = ({ content }) => (
  <article className="jp-tiptap-content max-w-none" data-jp-field="content">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={MD_COMPONENTS}
    >
      {content}
    </ReactMarkdown>
  </article>
);

// ── Export ────────────────────────────────────────────────────────────────────

export const Tiptap: React.FC<{ data: TiptapData; settings?: TiptapSettings }> = ({ data, settings: _settings }) => {
  const { mode } = useStudio();
  const isStudio = mode === 'studio';

  const toc = React.useMemo(() => extractToc(data.content ?? ''), [data.content]);
  const [activeId, setActiveId] = React.useState<string>('');
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  // Scroll-spy: last TOC heading at/above viewport line (public: id on headings; Studio: slug from text).
  React.useEffect(() => {
    if (toc.length === 0) return;
    const ids = toc.map((e) => e.id);
    let raf = 0;
    const tick = () => {
      const offset = readScrollSpyOffsetPx();
      const next = isStudio
        ? contentRef.current
          ? computeActiveTocIdFromHeadings(contentRef.current, toc, offset)
          : ''
        : computeActiveTocId(ids, offset);
      if (next) setActiveId((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => {
      tick();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }, 100);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [toc, isStudio]);

  const handleNav = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      return;
    }
    // Studio mode: headings are in ProseMirror, no IDs — find by text in editor DOM
    if (contentRef.current) {
      const headings = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
      );
      const target = headings.find((h) => slugify(h.textContent ?? '') === id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
      }
    }
  }, []);

  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--accent)',
        '--local-border': 'var(--border)',
        '--local-radius-sm': 'var(--theme-radius-sm)',
        '--local-radius-md': 'var(--theme-radius-md)',
        '--local-radius-lg': 'var(--theme-radius-lg)',
        '--local-toolbar-bg': 'var(--demo-surface-strong)',
        '--local-toolbar-hover-bg': 'var(--demo-surface)',
        '--local-toolbar-active-bg': 'var(--demo-accent-soft)',
        '--local-toolbar-border': 'var(--demo-border-soft)',
        '--local-toolbar-text': 'var(--demo-text-faint)',
      } as React.CSSProperties}
      className="w-full py-12 bg-[var(--local-bg)]"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex gap-8 py-12">
          {toc.length > 0 && (
            <DocsSidebar toc={toc} activeId={activeId} onNav={handleNav} />
          )}
          <div ref={contentRef} className="flex-1 min-w-0">
            {isStudio ? (
              <StudioTiptapEditor data={data} />
            ) : (
              <PublicTiptapContent content={data.content ?? ''} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/schema.ts"
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const TiptapSchema = BaseSectionData.extend({
  content: z.string().default('').describe('ui:editorial-markdown'),
});

export const TiptapSettingsSchema = z.object({});

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/types.ts"
import { z } from 'zod';
import { TiptapSchema, TiptapSettingsSchema } from './schema';

export type TiptapData = z.infer<typeof TiptapSchema>;
export type TiptapSettings = z.infer<typeof TiptapSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/ui"
echo "Creating src/components/ui/OlonMark.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/OlonMark.tsx"
import { cn } from '@/lib/utils'

interface OlonMarkProps {
  size?: number
  /** mono: uses currentColor — for single-colour print/emboss contexts */
  variant?: 'default' | 'mono'
  className?: string
}

export function OlonMark({ size = 32, variant = 'default', className }: OlonMarkProps) {
  const gid = `olon-ring-${size}`

  if (variant === 'mono') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        aria-label="Olon mark"
        className={cn('flex-shrink-0', className)}
      >
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="20"/>
        <circle cx="50" cy="50" r="15" fill="currentColor"/>
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      aria-label="Olon mark"
      className={cn('flex-shrink-0', className)}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--olon-ring-top)"/>
          <stop offset="100%" stopColor="var(--olon-ring-bottom)"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" stroke={`url(#${gid})`} strokeWidth="20"/>
      <circle cx="50" cy="50" r="15" fill="var(--olon-nucleus)"/>
    </svg>
  )
}

interface OlonLogoProps {
  markSize?: number
  fontSize?: number
  variant?: 'default' | 'mono'
  className?: string
}

export function OlonLogo({
  markSize = 32,
  fontSize = 24,
  variant = 'default',
  className,
}: OlonLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <OlonMark size={markSize} variant={variant}/>
      <span
        style={{
          fontFamily: "'Instrument Sans', Helvetica, Arial, sans-serif",
          fontWeight: 700,
          fontSize,
          letterSpacing: '-0.02em',
          color: 'hsl(var(--foreground))',
          lineHeight: 1,
        }}
      >
        Olon
      </span>
    </div>
  )
}

END_OF_FILE_CONTENT
echo "Creating src/components/ui/badge.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/badge.tsx"
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:  'bg-primary-900 text-primary-light border border-primary rounded-sm',
        outline:  'bg-elevated text-muted-foreground border border-border rounded-sm',
        accent:   'text-accent border border-border-strong rounded-sm',
        solid:    'bg-primary text-primary-foreground rounded-sm',
        pill:     'bg-elevated text-muted-foreground border border-border rounded-full gap-1.5',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/button.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/button.tsx"
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 shrink-0',
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]',
        secondary:   'bg-transparent text-primary-light border border-primary hover:bg-primary-900 active:scale-[0.98]',
        outline:     'bg-transparent text-foreground border border-border hover:bg-elevated active:scale-[0.98]',
        ghost:       'bg-transparent text-muted-foreground hover:text-foreground hover:bg-elevated active:scale-[0.98]',
        accent:      'bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.98]',
        destructive: 'bg-destructive text-destructive-foreground border border-destructive-border hover:opacity-90 active:scale-[0.98]',
      },
      size: {
        default: 'h-9 px-4 text-sm rounded-md',
        sm:      'h-8 px-3.5 text-sm rounded-md',
        lg:      'h-10 px-5 text-base rounded-md',
        icon:    'h-9 w-9 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }))

    // asChild: clone the single child element, merging our classes onto it
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
      })
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/card.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/card.tsx"
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-card text-card-foreground', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 p-5', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-sm font-medium text-foreground leading-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-muted-foreground leading-relaxed', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 pb-5', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center px-5 pb-5', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/checkbox.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/checkbox.tsx"
"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex size-4 items-center justify-center rounded-[4px] border transition-colors group-has-disabled/field:opacity-50 focus-visible:ring-3 aria-invalid:ring-3 peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }





END_OF_FILE_CONTENT
echo "Creating src/components/ui/input.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/input.tsx"
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-150',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/label.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/label.tsx"
import * as React from 'react'
import { cn } from '@/lib/utils'

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('block text-xs font-medium text-foreground mb-1.5 cursor-default', className)}
    {...props}
  />
))
Label.displayName = 'Label'

export { Label }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/select.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/select.tsx"
import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-full items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-lg shadow-md ring-1 duration-100 relative z-[110] max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none", 
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", 
          className 
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "p-1",
            position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px pointer-events-none", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}




END_OF_FILE_CONTENT
echo "Creating src/components/ui/select.txt..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/select.txt"
import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-full items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-lg shadow-md ring-1 duration-100 relative z-[110] max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none", 
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", 
          className 
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "p-1",
            position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px pointer-events-none", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}




END_OF_FILE_CONTENT
echo "Creating src/components/ui/separator.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/separator.tsx"
import * as React from 'react'
import { cn } from '@/lib/utils'

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[0.5px] w-full' : 'h-full w-[0.5px]',
      className
    )}
    {...props}
  />
))
Separator.displayName = 'Separator'

export { Separator }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/skeleton.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/skeleton.tsx"
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };

END_OF_FILE_CONTENT
echo "Creating src/components/ui/textarea.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/textarea.tsx"
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:ring-3 aria-invalid:ring-3 md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }





END_OF_FILE_CONTENT
mkdir -p "src/data"
mkdir -p "src/data/config"
echo "Creating src/data/config/menu.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/config/menu.json"
{
  "main": [
    {
      "label": "The Problem",
      "href": "#problem"
    },
    {
      "label": "Architecture",
      "href": "#architecture"
    },
    {
      "label": "Why",
      "href": "#why"
    },
    {
      "label": "DX",
      "href": "#devex"
    }
  ]
}
END_OF_FILE_CONTENT
echo "Creating src/data/config/site.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/config/site.json"
{
  "identity": {
    "title": "JsonPages",
    "logoUrl": "/logo.svg"
  },
  "pages": [
    {
      "slug": "home",
      "label": "Home"
    },
    {
      "slug": "docs",
      "label": "Docs"
    },
    {
      "slug": "architecture",
      "label": "Architecture"
    },
    {
      "slug": "usage",
      "label": "Usage"
    }
  ],
  "header": {
    "id": "global-header",
    "type": "header",
    "data": {
      "logoText": "olon",
      "logoHighlight": "JS",
      "links": {
        "$ref": "../config/menu.json#/main"
      }
    },
    "settings": {
      "sticky": true
    }
  },
  "footer": {
    "id": "global-footer",
    "type": "footer",
    "data": {
      "brandText": "Olon",
      "brandHighlight": "JS",
      "copyright": "© 2026 OlonJS · Guido Serio",
      "links": [
        {
          "label": "Docs",
          "href": "https://github.com/olonjs/olonjs?tab=readme-ov-file#-documentation-index"
        },
        {
          "label": "GitHub",
          "href": "https://github.com/olonjs/olonjs"
        },
        {
          "label": "MIT License",
          "href": "https://github.com/olonjs/olonjs?tab=readme-ov-file#MIT-1-ov-file"
        }
      ]
    },
    "settings": {
      "showLogo": true
    }
  }
}
END_OF_FILE_CONTENT
echo "Creating src/data/config/theme.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/config/theme.json"
{
  "name": "Olon",
  "tokens": {
    "colors": {
      "primary": "#1763FF",
      "secondary": "#0F52E0",
      "accent": "#84ABFF",
      "background": "#0d1117",
      "surface": "#0d1421",
      "surfaceAlt": "#141b24",
      "text": "#c8d6e8",
      "textMuted": "#8fa3c4",
      "border": "#253044"
    },
    "typography": {
      "fontFamily": {
        "primary": "'JetBrains Mono', Helvetica, Arial, sans-serif",
        "mono": "'JetBrains Mono', 'Fira Code', monospace",
        "display": "'JetBrains Mono', Helvetica, Arial, sans-serif"
      }
    },
    "borderRadius": {
      "sm": "0.25rem",
      "md": "0.5rem",
      "lg": "0.75rem"
    }
  }
}
END_OF_FILE_CONTENT
mkdir -p "src/data/pages"
echo "Creating src/data/pages/home.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/home.json"
{
  "id": "home-page",
  "slug": "home",
  "meta": {
    "title": "OlonJS — The Contract Layer for the Agentic Web",
    "description": "A deterministic machine contract for websites: typed, schema-driven content endpoints that make any site reliably readable and operable by AI agents."
  },
  "sections": [
    {
      "id": "hero-main",
      "type": "hero",
      "data": {
        "badge": "Open source · MIT License",
        "title": "The Contract Layer for the",
        "titleHighlight": "Agentic Web",
        "description": "Agents are becoming operational actors in commerce, marketing, and support. OlonJS introduces a deterministic machine contract for websites — so agents can reliably read and operate any site, without custom glue.",
        "ctas": [
          {
            "id": "cta-1",
            "label": "Read the Spec",
            "href": "https://github.com/olonjs/olonjs/blob/main/specs/olonjsSpecs_V_1_5.md",
            "variant": "primary"
          },
          {
            "id": "cta-2",
            "label": "View on GitHub",
            "href": "https://github.com/olonjs/olonjs?tab=readme-ov-file#readme",
            "variant": "secondary"
          }
        ],
        "metrics": []
      },
      "settings": {}
    },
    {
      "id": "problem-section",
      "type": "problem-statement",
      "data": {
        "anchorId": "problem",
        "label": "The challenge",
        "problemTag": "The problem",
        "problemTitle": "Websites aren't built for agents",
        "problemItems": [
          {
            "id": "pi-1",
            "text": "Agentic workflows are growing, but integration is mostly custom glue — rebuilt tenant by tenant"
          },
          {
            "id": "pi-2",
            "text": "Every site has a different content structure, routing assumptions, and edge cases"
          },
          {
            "id": "pi-3",
            "text": "HTML-heavy, CMS-fragmented, inconsistent across properties — slow, brittle, expensive"
          }
        ],
        "solutionTag": "Our solution",
        "solutionTitle": "A standard machine contract across tenants",
        "solutionItems": [
          {
            "id": "si-1",
            "text": "Predictable page endpoints for agents —",
            "code": "/{slug}.json"
          },
          {
            "id": "si-2",
            "text": "Typed, schema-driven content contracts — validated, versioned, auditable"
          },
          {
            "id": "si-3",
            "text": "Repeatable governance and deployment patterns across every tenant"
          }
        ]
      },
      "settings": {}
    },
    {
      "id": "architecture-section",
      "type": "feature-grid",
      "data": {
        "anchorId": "architecture",
        "label": "Architecture",
        "sectionTitle": "Built for enterprise scale",
        "sectionLead": "Every layer is designed for determinism — from file system layout to component contracts to Studio UX.",
        "cards": [
          {
            "id": "fc-1",
            "emoji": "📐",
            "title": "Modular Type Registry",
            "description": "Core defines empty registries; tenants inject types via module augmentation. Full TypeScript safety, zero Core changes."
          },
          {
            "id": "fc-2",
            "emoji": "🧱",
            "title": "Tenant Block Protocol",
            "description": "Self-contained capsules (View + schema + types) enable automated ingestion and consistent editor generation."
          },
          {
            "id": "fc-3",
            "emoji": "⚙️",
            "title": "Deterministic CLI",
            "description": "@olonjs/cli projects new tenants from a canonical script — reproducible across every environment."
          },
          {
            "id": "fc-4",
            "emoji": "🎯",
            "title": "ICE Data Contract",
            "description": "Mandatory DOM attributes bind the Studio canvas to Inspector fields without coupling to tenant DOM structure."
          },
          {
            "id": "fc-5",
            "emoji": "📦",
            "title": "Base Schema Fragments",
            "description": "Shared BaseSectionData and BaseArrayItem enforce anchor IDs and stable React keys across all capsules."
          },
          {
            "id": "fc-6",
            "emoji": "🔗",
            "title": "Path-Based Selection",
            "description": "v1.4 strict path semantics eliminate nested array ambiguity. Studio selection is root-to-leaf, always deterministic."
          }
        ]
      },
      "settings": {
        "columns": 3
      }
    },
    {
      "id": "why-now",
      "type": "git-section",
      "data": {
        "anchorId": "why",
        "label": "Timing",
        "title": "Why this matters",
        "titleAccent": "now",
        "cards": [
          {
            "id": "wc-1",
            "title": "Agentic commerce is live",
            "description": "Operational standards are missing. Without a contract layer, teams face high integration cost and low reliability."
          },
          {
            "id": "wc-2",
            "title": "Enterprises need governance",
            "description": "A contract layer you can audit, version, and scale — not a one-off adapter for every new agent workflow."
          },
          {
            "id": "wc-3",
            "title": "AI tooling is ready",
            "description": "Deterministic structure means AI can scaffold, validate, and evolve tenants with less prompt ambiguity."
          },
          {
            "id": "wc-4",
            "title": "Speed compounds",
            "description": "Teams that standardize now ship new experiences in hours while others rebuild integration logic repeatedly."
          }
        ]
      },
      "settings": {}
    },
    {
      "id": "dx-section",
      "type": "devex",
      "data": {
        "anchorId": "devex",
        "label": "Developer Velocity",
        "title": "AI-native advantage,\nfrom day one",
        "description": "OlonJS dramatically increases AI-assisted development speed. Because structure is deterministic, agents scaffold and evolve tenants faster — with lower regression risk.",
        "features": [
          {
            "id": "df-1",
            "text": "AI scaffolds and evolves tenants faster because structure is deterministic"
          },
          {
            "id": "df-2",
            "text": "Shared conventions reduce prompt ambiguity and implementation drift"
          },
          {
            "id": "df-3",
            "text": "Ship new tenant experiences in hours, not weeks"
          }
        ],
        "stats": [
          {
            "id": "ds-1",
            "value": "10×",
            "label": "Faster scaffolding"
          },
          {
            "id": "ds-2",
            "value": "∅",
            "label": "Glue per tenant"
          },
          {
            "id": "ds-3",
            "value": "100%",
            "label": "Type-safe contracts"
          }
        ]
      },
      "settings": {}
    },
    {
      "id": "cta-final",
      "type": "cta-banner",
      "data": {
        "anchorId": "get-started",
        "title": "Ready to give your site\na machine contract?",
        "description": "Read the full specification or explore the source on GitHub. Zero dependencies to start — one JSON endpoint per page.",
        "cliCommand": "npx @olonjs/cli@latest new tenant",
        "ctas": [
          {
            "id": "cta-docs",
            "label": "Read the Specification",
            "href": "https://github.com/olonjs/olonjs/blob/main/specs/olonjsSpecs_V_1_5.md",
            "variant": "primary"
          },
          {
            "id": "cta-gh",
            "label": "View on GitHub",
            "href": "https://github.com/olonjs/olonjs#readme-ov-file",
            "variant": "secondary"
          }
        ]
      },
      "settings": {}
    }
  ]
}
END_OF_FILE_CONTENT
mkdir -p "src/emails"
echo "Creating src/emails/LeadNotificationEmail.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/emails/LeadNotificationEmail.tsx"
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type LeadData = Record<string, unknown>;

type EmailTheme = {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    surfaceAlt?: string;
    text?: string;
    textMuted?: string;
    border?: string;
  };
  typography?: {
    fontFamily?: {
      primary?: string;
      display?: string;
      mono?: string;
    };
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
};

export type LeadNotificationEmailProps = {
  tenantName: string;
  correlationId: string;
  replyTo?: string | null;
  leadData: LeadData;
  brandName?: string;
  logoUrl?: string;
  logoAlt?: string;
  tagline?: string;
  theme?: EmailTheme;
};

function safeString(value: unknown): string {
  if (value == null) return "-";
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || "-";
  }
  return JSON.stringify(value);
}

function flattenLeadData(data: LeadData) {
  return Object.entries(data)
    .filter(([key]) => !key.startsWith("_"))
    .slice(0, 20)
    .map(([key, value]) => ({ label: key, value: safeString(value) }));
}

export function LeadNotificationEmail({
  tenantName,
  correlationId,
  replyTo,
  leadData,
  brandName,
  logoUrl,
  logoAlt,
  tagline,
  theme,
}: LeadNotificationEmailProps) {
  const fields = flattenLeadData(leadData);
  const brandLabel = brandName || tenantName;

  const colors = {
    primary: theme?.colors?.primary || "#2D5016",
    background: theme?.colors?.background || "#FAFAF5",
    surface: theme?.colors?.surface || "#FFFFFF",
    text: theme?.colors?.text || "#1C1C14",
    textMuted: theme?.colors?.textMuted || "#5A5A4A",
    border: theme?.colors?.border || "#D8D5C5",
  };

  const fonts = {
    primary: theme?.typography?.fontFamily?.primary || "Inter, Arial, sans-serif",
    display: theme?.typography?.fontFamily?.display || "Georgia, serif",
  };

  const radius = {
    md: theme?.borderRadius?.md || "10px",
    lg: theme?.borderRadius?.lg || "16px",
  };

  return (
    <Html>
      <Head />
      <Preview>Nuovo lead ricevuto da {brandLabel}</Preview>
      <Body style={{ backgroundColor: colors.background, color: colors.text, fontFamily: fonts.primary, padding: "24px" }}>
        <Container style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, padding: "24px" }}>
          <Section>
            {logoUrl ? <Img src={logoUrl} alt={logoAlt || brandLabel} height="44" style={{ marginBottom: "8px" }} /> : null}
            <Text style={{ color: colors.text, fontSize: "18px", fontWeight: 700, margin: "0 0 6px 0" }}>{brandLabel}</Text>
            <Text style={{ color: colors.textMuted, marginTop: "0", marginBottom: "0" }}>{tagline || "Notifica automatica lead"}</Text>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "20px 0" }} />

          <Heading as="h2" style={{ color: colors.text, margin: "0 0 12px 0", fontSize: "22px", fontFamily: fonts.display }}>
            Nuovo lead da {tenantName}
          </Heading>
          <Text style={{ color: colors.textMuted, marginTop: "0", marginBottom: "16px" }}>Correlation ID: {correlationId}</Text>

          <Section style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: "12px" }}>
            {fields.length === 0 ? (
              <Text style={{ color: colors.textMuted, margin: 0 }}>Nessun campo lead disponibile.</Text>
            ) : (
              fields.map((field) => (
                <Text key={field.label} style={{ margin: "0 0 8px 0", color: colors.text, fontSize: "14px", wordBreak: "break-word" }}>
                  <strong>{field.label}:</strong> {field.value}
                </Text>
              ))
            )}
          </Section>

          <Section style={{ marginTop: "18px" }}>
            <Button
              href={replyTo ? `mailto:${replyTo}` : "mailto:"}
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
                borderRadius: radius.md,
                textDecoration: "none",
                padding: "12px 18px",
                fontWeight: 600,
              }}
            >
              Rispondi ora
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default LeadNotificationEmail;

END_OF_FILE_CONTENT
echo "Creating src/emails/LeadSenderConfirmationEmail.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/emails/LeadSenderConfirmationEmail.tsx"
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type LeadData = Record<string, unknown>;

type EmailTheme = {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    surfaceAlt?: string;
    text?: string;
    textMuted?: string;
    border?: string;
  };
  typography?: {
    fontFamily?: {
      primary?: string;
      display?: string;
      mono?: string;
    };
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
};

export type LeadSenderConfirmationEmailProps = {
  tenantName: string;
  correlationId: string;
  leadData: LeadData;
  brandName?: string;
  logoUrl?: string;
  logoAlt?: string;
  tagline?: string;
  theme?: EmailTheme;
};

function safeString(value: unknown): string {
  if (value == null) return "-";
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || "-";
  }
  return JSON.stringify(value);
}

function flattenLeadData(data: LeadData) {
  const skipKeys = new Set(["recipientEmail", "tenant", "source", "submittedAt", "email_confirm"]);
  return Object.entries(data)
    .filter(([key]) => !key.startsWith("_") && !skipKeys.has(key))
    .slice(0, 12)
    .map(([key, value]) => ({ label: key, value: safeString(value) }));
}

export function LeadSenderConfirmationEmail({
  tenantName,
  correlationId,
  leadData,
  brandName,
  logoUrl,
  logoAlt,
  tagline,
  theme,
}: LeadSenderConfirmationEmailProps) {
  const fields = flattenLeadData(leadData);
  const brandLabel = brandName || tenantName;

  const colors = {
    primary: theme?.colors?.primary || "#2D5016",
    background: theme?.colors?.background || "#FAFAF5",
    surface: theme?.colors?.surface || "#FFFFFF",
    text: theme?.colors?.text || "#1C1C14",
    textMuted: theme?.colors?.textMuted || "#5A5A4A",
    border: theme?.colors?.border || "#D8D5C5",
  };

  const fonts = {
    primary: theme?.typography?.fontFamily?.primary || "Inter, Arial, sans-serif",
    display: theme?.typography?.fontFamily?.display || "Georgia, serif",
  };

  const radius = {
    md: theme?.borderRadius?.md || "10px",
    lg: theme?.borderRadius?.lg || "16px",
  };

  return (
    <Html>
      <Head />
      <Preview>Conferma invio richiesta - {brandLabel}</Preview>
      <Body style={{ backgroundColor: colors.background, color: colors.background, fontFamily: fonts.primary, padding: "24px" }}>
        <Container style={{ backgroundColor: colors.primary, color: colors.background, border: `1px solid ${colors.border}`, borderRadius: radius.lg, padding: "24px" }}>
          <Section>
            {logoUrl ? <Img src={logoUrl} alt={logoAlt || brandLabel} height="44" style={{ marginBottom: "8px" }} /> : null}
            <Text style={{ color: colors.background, fontSize: "18px", fontWeight: 700, margin: "0 0 6px 0" }}>{brandLabel}</Text>
            <Text style={{ color: colors.background, marginTop: "0", marginBottom: "0" }}>{tagline || "Conferma automatica di ricezione"}</Text>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "20px 0" }} />

          <Heading as="h2" style={{ color: colors.background, margin: "0 0 12px 0", fontSize: "22px", fontFamily: fonts.display }}>
            Richiesta ricevuta
          </Heading>
          <Text style={{ color: colors.background, marginTop: "0", marginBottom: "16px" }}>
            Grazie, abbiamo ricevuto la tua richiesta per {tenantName}. Ti risponderemo il prima possibile.
          </Text>

          <Section style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: "12px" }}>
            <Text style={{ margin: "0 0 8px 0", color: colors.background, fontWeight: 600 }}>Riepilogo inviato</Text>
            {fields.length === 0 ? (
              <Text style={{ color: colors.background, margin: 0 }}>Nessun dettaglio disponibile.</Text>
            ) : (
              fields.map((field) => (
                <Text key={field.label} style={{ margin: "0 0 8px 0", color: colors.background, fontSize: "14px", wordBreak: "break-word" }}>
                  <strong>{field.label}:</strong> {field.value}
                </Text>
              ))
            )}
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "20px 0 12px 0" }} />
          <Text style={{ color: colors.background, fontSize: "12px", margin: 0 }}>Riferimento richiesta: {correlationId}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default LeadSenderConfirmationEmail;

END_OF_FILE_CONTENT
echo "Creating src/entry-ssg.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/entry-ssg.tsx"
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ConfigProvider, PageRenderer, StudioProvider, resolveRuntimeConfig } from '@olonjs/core';
import type { JsonPagesConfig, MenuConfig, PageConfig, SiteConfig, ThemeConfig } from '@/types';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { getFilePages } from '@/lib/getFilePages';
import siteData from '@/data/config/site.json';
import menuData from '@/data/config/menu.json';
import themeData from '@/data/config/theme.json';
import tenantCss from '@/index.css?inline';

const siteConfig = siteData as unknown as SiteConfig;
const menuConfig: MenuConfig = { main: [] };
const themeConfig = themeData as unknown as ThemeConfig;
const pages = getFilePages();
const refDocuments = {
  'menu.json': menuData,
  'config/menu.json': menuData,
  'src/data/config/menu.json': menuData,
} satisfies NonNullable<JsonPagesConfig['refDocuments']>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeSlug(input: string): string {
  return input.trim().toLowerCase().replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function getSortedSlugs(): string[] {
  return Object.keys(pages).sort((a, b) => a.localeCompare(b));
}

function resolvePage(slug: string): { slug: string; page: PageConfig } {
  const normalized = normalizeSlug(slug);
  if (normalized && pages[normalized]) {
    return { slug: normalized, page: pages[normalized] };
  }

  const slugs = getSortedSlugs();
  if (slugs.length === 0) {
    throw new Error('[SSG_CONFIG_ERROR] No pages found under src/data/pages');
  }

  const home = slugs.find((item) => item === 'home');
  const fallbackSlug = home ?? slugs[0];
  return { slug: fallbackSlug, page: pages[fallbackSlug] };
}

function flattenThemeTokens(
  input: unknown,
  pathSegments: string[] = [],
  out: Array<{ name: string; value: string }> = []
): Array<{ name: string; value: string }> {
  if (typeof input === 'string') {
    const cleaned = input.trim();
    if (cleaned.length > 0 && pathSegments.length > 0) {
      out.push({ name: `--theme-${pathSegments.join('-')}`, value: cleaned });
    }
    return out;
  }

  if (!isRecord(input)) return out;

  const entries = Object.entries(input).sort(([a], [b]) => a.localeCompare(b));
  for (const [key, value] of entries) {
    flattenThemeTokens(value, [...pathSegments, key], out);
  }
  return out;
}

function buildThemeCssFromSot(theme: ThemeConfig): string {
  const root: Record<string, unknown> = isRecord(theme) ? theme : {};
  const tokens = root['tokens'];
  const flattened = flattenThemeTokens(tokens);
  if (flattened.length === 0) return '';
  const serialized = flattened.map((item) => `${item.name}:${item.value}`).join(';');
  return `:root{${serialized}}`;
}

function resolveTenantId(): string {
  const site: Record<string, unknown> = isRecord(siteConfig) ? siteConfig : {};
  const identityRaw = site['identity'];
  const identity: Record<string, unknown> = isRecord(identityRaw) ? identityRaw : {};
  const titleRaw = typeof identity.title === 'string' ? identity.title : '';
  const title = titleRaw.trim();
  if (title.length > 0) {
    const normalized = title.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (normalized.length > 0) return normalized;
  }

  const slugs = getSortedSlugs();
  if (slugs.length === 0) {
    throw new Error('[SSG_CONFIG_ERROR] Cannot resolve tenantId without site.identity.title or pages');
  }
  return slugs[0].replace(/\//g, '-');
}

export function render(slug: string): string {
  const resolved = resolvePage(slug);
  const location = resolved.slug === 'home' ? '/' : `/${resolved.slug}`;
  const resolvedRuntime = resolveRuntimeConfig({
    pages,
    siteConfig,
    themeConfig,
    menuConfig,
    refDocuments,
  });
  const resolvedPage = resolvedRuntime.pages[resolved.slug] ?? resolved.page;

  return renderToString(
    <StaticRouter location={location}>
      <ConfigProvider
        config={{
          registry: ComponentRegistry as JsonPagesConfig['registry'],
          schemas: SECTION_SCHEMAS as unknown as JsonPagesConfig['schemas'],
          tenantId: resolveTenantId(),
        }}
      >
        <StudioProvider mode="visitor">
          <ThemeProvider>
            <PageRenderer
              pageConfig={resolvedPage}
              siteConfig={resolvedRuntime.siteConfig}
              menuConfig={resolvedRuntime.menuConfig}
            />
          </ThemeProvider>
        </StudioProvider>
      </ConfigProvider>
    </StaticRouter>
  );
}

export function getCss(): string {
  const themeCss = buildThemeCssFromSot(themeConfig);
  if (!themeCss) return tenantCss;
  return `${themeCss}\n${tenantCss}`;
}

export function getPageMeta(slug: string): { title: string; description: string } {
  const resolved = resolvePage(slug);
  const rawMeta = isRecord((resolved.page as unknown as { meta?: unknown }).meta)
    ? ((resolved.page as unknown as { meta?: Record<string, unknown> }).meta as Record<string, unknown>)
    : {};

  const title = typeof rawMeta.title === 'string' ? rawMeta.title : resolved.slug;
  const description = typeof rawMeta.description === 'string' ? rawMeta.description : '';
  return { title, description };
}

export function getWebMcpBuildState(): {
  pages: Record<string, PageConfig>;
  schemas: JsonPagesConfig['schemas'];
  siteConfig: SiteConfig;
} {
  return {
    pages,
    schemas: SECTION_SCHEMAS as unknown as JsonPagesConfig['schemas'],
    siteConfig,
  };
}

END_OF_FILE_CONTENT
echo "Creating src/fonts.css..."
cat << 'END_OF_FILE_CONTENT' > "src/fonts.css"
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

END_OF_FILE_CONTENT
mkdir -p "src/hooks"
echo "Creating src/hooks/useDocumentMeta.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/hooks/useDocumentMeta.ts"
import { useEffect } from 'react';
import type { PageMeta } from '@/types';

export const useDocumentMeta = (meta: PageMeta): void => {
  useEffect(() => {
    // Set document title
    document.title = meta.title;

    // Set or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', meta.description);
  }, [meta.title, meta.description]);
};





END_OF_FILE_CONTENT
echo "Creating src/index.css..."
cat << 'END_OF_FILE_CONTENT' > "src/index.css"
@import "tailwindcss";

@source "./**/*.tsx";

@theme {
  /* 
     🎯 MASTER MAPPING (V2.7 Landing) 
  */
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  --color-accent: var(--accent);
  --color-border: var(--border);
  
  --radius-lg: var(--theme-radius-lg);
  --radius-md: var(--theme-radius-md);
  --radius-sm: var(--theme-radius-sm);

  --font-primary: var(--theme-font-primary);
  --font-mono: var(--theme-font-mono);

  /*
     DISPLAY FONT bridge
     The core now emits --theme-font-display from theme.json, so this keeps
     the tenant on the stable semantic alias rather than depending on the
     flattened internal variable path.
  */
  --font-display: var(--theme-font-display);
}

/* 
   🌍 TENANT BRAND TOKENS (JSP 1.5)
*/
:root {
  --background: var(--theme-background);
  --foreground: var(--theme-text);
  --card: var(--theme-surface);
  --card-foreground: var(--theme-text);
  --primary: var(--theme-primary);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: var(--theme-secondary);
  --secondary-foreground: var(--theme-text);
  --muted: var(--theme-surface-alt);
  --muted-foreground: var(--theme-text-muted);
  --border: var(--theme-border);
  --radius: var(--theme-radius-lg);

  /* 
     🔧 ACCENT CHAIN — Forward-compatible workaround
     theme-manager.ts already injects --theme-accent on :root,
     but the original index.css never bridged it into the semantic layer.
     This closes the gap: --theme-accent → --accent → --color-accent.
     Falls back to --theme-primary if accent is undefined.
  */
  --accent: var(--theme-accent, var(--theme-primary));

  /* Olon brand primitives — consumed by OlonMark SVG gradients */
  --olon-ring-top:    #84ABFF;
  --olon-ring-bottom: #0F52E0;
  --olon-ground:      #080808;
  --olon-figure:      #e8f0f8;
  --olon-nucleus:     var(--olon-figure);

  /*
     Shared demo/mockup helpers
     These are still theme-derived, but give the tenant a stable semantic
     palette for browser/terminal/inspector style surfaces.
  */
  --demo-surface: color-mix(in oklch, var(--card) 86%, var(--background));
  --demo-surface-soft: color-mix(in oklch, var(--card) 72%, var(--background));
  --demo-surface-strong: color-mix(in oklch, var(--background) 82%, black);
  --demo-surface-deep: color-mix(in oklch, var(--background) 70%, black);
  --demo-border-soft: color-mix(in oklch, var(--foreground) 8%, transparent);
  --demo-border-strong: color-mix(in oklch, var(--primary) 24%, transparent);
  --demo-accent-soft: color-mix(in oklch, var(--primary) 10%, transparent);
  --demo-accent-strong: color-mix(in oklch, var(--primary) 18%, transparent);
  --demo-text-soft: color-mix(in oklch, var(--foreground) 88%, var(--muted-foreground));
  --demo-text-faint: color-mix(in oklch, var(--muted-foreground) 72%, transparent);
}

@layer base {
  * { border-color: var(--border); }
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-primary);
    line-height: 1.7;
    overflow-x: hidden;
    @apply antialiased;
  }
}

/* ==========================================================================
   FONT DISPLAY UTILITY
   Maps .font-display class to the display font family (Playfair Display)
   ========================================================================== */
.font-display {
  font-family: var(--font-display, var(--font-primary));
}

/* ==========================================================================
   LANDING ANIMATIONS
   ========================================================================== */
@keyframes jp-fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes jp-pulseDot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.jp-animate-in {
  opacity: 0;
  animation: jp-fadeUp 0.7s ease forwards;
}
.jp-d1 { animation-delay: 0.1s; }
.jp-d2 { animation-delay: 0.2s; }
.jp-d3 { animation-delay: 0.3s; }
.jp-d4 { animation-delay: 0.4s; }
.jp-d5 { animation-delay: 0.5s; }

.jp-pulse-dot {
  animation: jp-pulseDot 2s ease infinite;
}

/* ==========================================================================
   SMOOTH SCROLL
   ========================================================================== */
html {
  scroll-behavior: smooth;
}

/* ==========================================================================
   ICE ADMIN — Section highlight in preview iframe
   The preview iframe only receives tenant CSS; core's overlay classes
   (z-[50], absolute, etc.) are not in this build. Define them here so
   the section highlight is always visible in /admin.
   ========================================================================== */
[data-jp-section-overlay] {
  position: absolute;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  transition: border-color 0.2s, background-color 0.2s;
  border: 2px solid transparent;
}

[data-section-id]:hover [data-jp-section-overlay] {
  border-color: rgba(96, 165, 250, 0.5);
  border-style: dashed;
}

[data-section-id][data-jp-selected] [data-jp-section-overlay] {
  border-color: rgb(37, 99, 235);
  border-style: solid;
  background-color: rgba(59, 130, 246, 0.05);
}

[data-jp-section-overlay] > div {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem 0.5rem;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgb(37, 99, 235);
  color: white;
  transition: opacity 0.2s;
}

[data-section-id]:hover [data-jp-section-overlay] > div,
[data-section-id][data-jp-selected] [data-jp-section-overlay] > div {
  opacity: 1;
}

[data-section-id] [data-jp-section-overlay] > div {
  opacity: 0;
}

/* Editorial focus lock: avoid section reselection while selecting text in inline editor. */
[data-section-id].jp-editorial-focus [data-jp-section-overlay] {
  border-color: transparent !important;
  background: transparent !important;
}

[data-section-id].jp-editorial-focus [data-jp-section-overlay] > div {
  opacity: 0 !important;
  pointer-events: none;
}

/* ==========================================================================
   TIPTAP — Public content typography (visitor view)
   ReactMarkdown renders plain HTML; preflight resets it. Re-apply here.
   ========================================================================== */
.jp-tiptap-content > * + * { margin-top: 0.75em; }

.jp-tiptap-content h1 { font-size: 2em;    font-weight: 700; line-height: 1.2; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-tiptap-content h2 { font-size: 1.5em;  font-weight: 700; line-height: 1.3; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-tiptap-content h3 { font-size: 1.25em; font-weight: 600; line-height: 1.4; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-tiptap-content h4 { font-size: 1em;    font-weight: 600; line-height: 1.5; margin-top: 1em;    margin-bottom: 0.25em; }

.jp-tiptap-content p  { line-height: 1.7; }

.jp-tiptap-content strong { font-weight: 700; }
.jp-tiptap-content em     { font-style: italic; }
.jp-tiptap-content s      { text-decoration: line-through; }

.jp-tiptap-content a { color: var(--primary); text-decoration: underline; text-underline-offset: 2px; }
.jp-tiptap-content a:hover { opacity: 0.8; }

.jp-tiptap-content code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.875em;
  background: color-mix(in oklch, var(--foreground) 8%, transparent);
  border-radius: var(--theme-radius-sm);
  padding: 0.1em 0.35em;
}
.jp-tiptap-content pre {
  background: color-mix(in oklch, var(--background) 60%, black);
  border-radius: var(--theme-radius-lg);
  padding: 1em 1.25em;
  overflow-x: auto;
}
.jp-tiptap-content pre code { background: none; padding: 0; }

.jp-tiptap-content ul { list-style-type: disc;    padding-left: 1.625em; }
.jp-tiptap-content ol { list-style-type: decimal; padding-left: 1.625em; }
.jp-tiptap-content li { line-height: 1.7; margin-top: 0.25em; }
.jp-tiptap-content li + li { margin-top: 0.25em; }

.jp-tiptap-content blockquote {
  border-left: 3px solid var(--border);
  padding-left: 1em;
  color: var(--muted-foreground);
  font-style: italic;
}

.jp-tiptap-content hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5em 0;
}

.jp-tiptap-content img { max-width: 100%; height: auto; border-radius: var(--theme-radius-lg); }

/* ==========================================================================
   TIPTAP / PROSEMIRROR — Editor typography
   Tailwind preflight resets all heading/list styles. Re-apply here using
   tenant theme tokens so the editor is WYSIWYG.
   ========================================================================== */
.jp-simple-editor .ProseMirror {
  outline: none;
  word-break: break-word;
}
.jp-simple-editor .ProseMirror > * + * { margin-top: 0.75em; }

.jp-simple-editor .ProseMirror h1 { font-size: 2em;    font-weight: 700; line-height: 1.2; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-simple-editor .ProseMirror h2 { font-size: 1.5em;  font-weight: 700; line-height: 1.3; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-simple-editor .ProseMirror h3 { font-size: 1.25em; font-weight: 600; line-height: 1.4; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-simple-editor .ProseMirror h4 { font-size: 1em;    font-weight: 600; line-height: 1.5; margin-top: 1em;    margin-bottom: 0.25em; }

.jp-simple-editor .ProseMirror p  { line-height: 1.7; }

.jp-simple-editor .ProseMirror strong { font-weight: 700; }
.jp-simple-editor .ProseMirror em     { font-style: italic; }
.jp-simple-editor .ProseMirror s      { text-decoration: line-through; }

.jp-simple-editor .ProseMirror a { color: var(--primary); text-decoration: underline; text-underline-offset: 2px; }
.jp-simple-editor .ProseMirror a:hover { opacity: 0.8; }

.jp-simple-editor .ProseMirror code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.875em;
  background: color-mix(in oklch, var(--foreground) 8%, transparent);
  border-radius: var(--theme-radius-sm);
  padding: 0.1em 0.35em;
}
.jp-simple-editor .ProseMirror pre {
  background: color-mix(in oklch, var(--background) 60%, black);
  border-radius: var(--theme-radius-lg);
  padding: 1em 1.25em;
  overflow-x: auto;
}
.jp-simple-editor .ProseMirror pre code {
  background: none;
  padding: 0;
}

.jp-simple-editor .ProseMirror ul { list-style-type: disc;    padding-left: 1.625em; }
.jp-simple-editor .ProseMirror ol { list-style-type: decimal; padding-left: 1.625em; }
.jp-simple-editor .ProseMirror li { line-height: 1.7; margin-top: 0.25em; }
.jp-simple-editor .ProseMirror li + li { margin-top: 0.25em; }

.jp-simple-editor .ProseMirror blockquote {
  border-left: 3px solid var(--border);
  padding-left: 1em;
  color: var(--muted-foreground);
  font-style: italic;
}

.jp-simple-editor .ProseMirror hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5em 0;
}

.jp-simple-editor .ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: var(--theme-radius-lg);
}

.jp-simple-editor .ProseMirror img[data-uploading="true"] {
  opacity: 0.6;
  filter: grayscale(0.25);
  outline: 2px dashed color-mix(in oklch, var(--primary) 70%, transparent);
  outline-offset: 2px;
}

.jp-simple-editor .ProseMirror img[data-upload-error="true"] {
  outline: 2px solid color-mix(in oklch, var(--accent) 70%, transparent);
  outline-offset: 2px;
}

/* Placeholder when editor is empty */
.jp-simple-editor .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: var(--muted-foreground);
  opacity: 0.5;
  pointer-events: none;
  float: left;
  height: 0;
}



END_OF_FILE_CONTENT
mkdir -p "src/lib"
echo "Creating src/lib/ComponentRegistry.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/ComponentRegistry.tsx"
import React from 'react';
import { Header }           from '@/components/header';
import { Footer }           from '@/components/footer';
import { Hero }             from '@/components/hero';
import { FeatureGrid }      from '@/components/feature-grid';
import { ProblemStatement } from '@/components/problem-statement';
import { CtaBanner }        from '@/components/cta-banner';
import { GitSection }       from '@/components/git-section';
import { Devex }            from '@/components/devex';
import { Tiptap }           from '@/components/tiptap';

import type { SectionType }              from '@olonjs/core';
import type { SectionComponentPropsMap } from '@/types';

export const ComponentRegistry: {
  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;
} = {
  'header':            Header,
  'footer':            Footer,
  'hero':              Hero,
  'feature-grid':      FeatureGrid,
  'problem-statement': ProblemStatement,
  'cta-banner':        CtaBanner,
  'git-section':       GitSection,
  'devex':             Devex,
  'tiptap':            Tiptap,
};

END_OF_FILE_CONTENT
echo "Creating src/lib/IconResolver.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/IconResolver.tsx"
import React from 'react';
import {
  Layers,
  Github,
  ArrowRight,
  Box,
  Terminal,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Zap,
  type LucideIcon
} from 'lucide-react';

const iconMap = {
  'layers': Layers,
  'github': Github,
  'arrow-right': ArrowRight,
  'box': Box,
  'terminal': Terminal,
  'chevron-right': ChevronRight,
  'menu': Menu,
  'x': X,
  'sparkles': Sparkles,
  'zap': Zap,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export function isIconName(s: string): s is IconName {
  return s in iconMap;
}

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className }) => {
  const IconComponent = isIconName(name) ? iconMap[name] : undefined;

  if (!IconComponent) {
    if (import.meta.env.DEV) {
      console.warn(`[IconResolver] Unknown icon: "${name}". Add it to iconMap.`);
    }
    return null;
  }

  return <IconComponent size={size} className={className} />;
};



END_OF_FILE_CONTENT
echo "Creating src/lib/addSectionConfig.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/addSectionConfig.ts"
import type { AddSectionConfig } from '@olonjs/core';

const addableSectionTypes = [
  'hero', 'feature-grid', 'problem-statement',
  'cta-banner', 'git-section', 'devex', 'tiptap',
] as const;

const sectionTypeLabels: Record<string, string> = {
  'hero':              'Hero',
  'feature-grid':      'Feature Grid',
  'problem-statement': 'Problem Statement',
  'cta-banner':        'CTA Banner',
  'git-section':       'Git Versioning',
  'devex':             'Developer Experience',
  'tiptap':            'Tiptap Editorial',
};

function getDefaultSectionData(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':              return { title: 'New Hero', description: '' };
    case 'feature-grid':      return { sectionTitle: 'Features', cards: [] };
    case 'problem-statement': return { problemTag: 'Problem', problemTitle: '', problemItems: [], solutionTag: 'Solution', solutionTitle: '', solutionItems: [] };
    case 'cta-banner':        return { title: 'Call to Action', description: '', cliCommand: '' };
    case 'git-section':       return { title: 'Your content is code.', cards: [] };
    case 'devex':             return { title: 'Developer Experience', description: '', features: [] };
    case 'tiptap':            return { content: '# Post title\n\nStart writing in Markdown...' };
    default:                  return {};
  }
}

export const addSectionConfig: AddSectionConfig = {
  addableSectionTypes: [...addableSectionTypes],
  sectionTypeLabels,
  getDefaultSectionData,
};

END_OF_FILE_CONTENT
echo "Creating src/lib/base-schemas.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/base-schemas.ts"
import { z } from 'zod';

/**
 * Image picker field: object { url, alt? } with ui:image-picker for Form Factory.
 * Use in section data and resolve with resolveAssetUrl(url, tenantId) in View.
 */
export const ImageSelectionSchema = z
  .object({
    url: z.string(),
    alt: z.string().optional(),
  }) 
  .describe('ui:image-picker');

/**
 * Base schemas shared by section capsules (CIP governance).
 * Capsules extend these for consistent anchorId, array items, and settings.
 */
export const BaseSectionData = z.object({
  anchorId: z.string().optional().describe('ui:text'),
});

export const BaseArrayItem = z.object({
  id: z.string().optional(),
});

export const BaseSectionSettingsSchema = z.object({
  paddingTop: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),
  paddingBottom: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),
  theme: z.enum(['dark', 'light', 'accent']).default('dark').describe('ui:select'),
  container: z.enum(['boxed', 'fluid']).default('boxed').describe('ui:select'),
});

export const CtaSchema = z.object({
  id: z.string().optional(),
  label: z.string().describe('ui:text'),
  href: z.string().describe('ui:text'),
  variant: z.enum(['primary', 'secondary', 'accent']).default('primary').describe('ui:select'),
});

END_OF_FILE_CONTENT
echo "Creating src/lib/cloudSaveStream.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/cloudSaveStream.ts"
import type { StepId } from '@/types/deploy';

interface SaveStreamStepEvent {
  id: StepId;
  status: 'running' | 'done';
  label?: string;
}

interface SaveStreamLogEvent {
  stepId: StepId;
  message: string;
}

interface SaveStreamDoneEvent {
  deployUrl?: string;
  commitSha?: string;
}

interface SaveStreamErrorEvent {
  message?: string;
}

interface StartCloudSaveStreamInput {
  apiBaseUrl: string;
  apiKey: string;
  path: string;
  content: unknown;
  message?: string;
  signal?: AbortSignal;
  onStep: (event: SaveStreamStepEvent) => void;
  onLog?: (event: SaveStreamLogEvent) => void;
  onDone: (event: SaveStreamDoneEvent) => void;
}

function parseSseEventBlock(rawBlock: string): { event: string; data: string } | null {
  const lines = rawBlock
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return null;

  let eventName = 'message';
  const dataLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim();
      continue;
    }
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }
  return { event: eventName, data: dataLines.join('\n') };
}

export async function startCloudSaveStream(input: StartCloudSaveStreamInput): Promise<void> {
  const response = await fetch(`${input.apiBaseUrl}/save-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify({
      path: input.path,
      content: input.content,
      message: input.message,
    }),
    signal: input.signal,
  });

  if (!response.ok || !response.body) {
    const body = (await response.json().catch(() => ({}))) as SaveStreamErrorEvent;
    throw new Error(body.message ?? `Cloud save stream failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let receivedDone = false;

  while (true) {
    const { value, done } = await reader.read();
    if (!done) {
      buffer += decoder.decode(value, { stream: true });
    } else {
      buffer += decoder.decode();
    }

    const chunks = buffer.split('\n\n');
    buffer = done ? '' : (chunks.pop() ?? '');

    for (const chunk of chunks) {
      const parsed = parseSseEventBlock(chunk);
      if (!parsed) continue;
      if (!parsed.data) continue;

      if (parsed.event === 'step') {
        const payload = JSON.parse(parsed.data) as SaveStreamStepEvent;
        input.onStep(payload);
      } else if (parsed.event === 'log') {
        const payload = JSON.parse(parsed.data) as SaveStreamLogEvent;
        input.onLog?.(payload);
      } else if (parsed.event === 'error') {
        const payload = JSON.parse(parsed.data) as SaveStreamErrorEvent;
        throw new Error(payload.message ?? 'Cloud save failed.');
      } else if (parsed.event === 'done') {
        const payload = JSON.parse(parsed.data) as SaveStreamDoneEvent;
        input.onDone(payload);
        receivedDone = true;
      }
    }

    if (done) break;
  }

  if (!receivedDone) {
    throw new Error('Cloud save stream ended before completion.');
  }
}


END_OF_FILE_CONTENT
echo "Creating src/lib/deploySteps.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/deploySteps.ts"
import type { DeployStep } from '@/types/deploy';

export const DEPLOY_STEPS: readonly DeployStep[] = [
  {
    id: 'commit',
    label: 'Commit',
    verb: 'Committing',
    poem: ['Crystallizing your edit', 'into permanent history.'],
    color: '#60a5fa',
    glyph: '◈',
    duration: 2200,
  },
  {
    id: 'push',
    label: 'Push',
    verb: 'Pushing',
    poem: ['Sending your vision', 'across the wire.'],
    color: '#a78bfa',
    glyph: '◎',
    duration: 2800,
  },
  {
    id: 'build',
    label: 'Build',
    verb: 'Building',
    poem: ['Assembling the pieces,', 'brick by digital brick.'],
    color: '#f59e0b',
    glyph: '⬡',
    duration: 7500,
  },
  {
    id: 'live',
    label: 'Live',
    verb: 'Going live',
    poem: ['Your content', 'is now breathing.'],
    color: '#34d399',
    glyph: '✦',
    duration: 1600,
  },
] as const;


END_OF_FILE_CONTENT
echo "Creating src/lib/draftStorage.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/draftStorage.ts"
/**
 * Tenant initial data — file-backed only (no localStorage).
 */

import type { PageConfig, SiteConfig } from '@/types';

export interface HydratedData {
  pages: Record<string, PageConfig>;
  siteConfig: SiteConfig;
}

/**
 * Return pages and siteConfig from file-backed data only.
 */
export function getHydratedData(
  _tenantId: string,
  filePages: Record<string, PageConfig>,
  fileSiteConfig: SiteConfig
): HydratedData {
  return {
    pages: { ...filePages },
    siteConfig: fileSiteConfig,
  };
}

END_OF_FILE_CONTENT
echo "Creating src/lib/getFilePages.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/getFilePages.ts"
/**
 * Page registry loaded from nested JSON files under src/data/pages.
 * Add a JSON file in that directory tree to register a page; no manual list in App.tsx.
 */
import type { PageConfig } from '@/types';

function slugFromPath(filePath: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const match = normalizedPath.match(/\/data\/pages\/(.+)\.json$/i);
  const rawSlug = match?.[1] ?? normalizedPath.split('/').pop()?.replace(/\.json$/i, '') ?? '';
  const canonical = rawSlug
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
  return canonical || 'home';
}

export function getFilePages(): Record<string, PageConfig> {
  const glob = import.meta.glob<{ default: unknown }>('@/data/pages/**/*.json', { eager: true });
  const bySlug = new Map<string, PageConfig>();
  const entries = Object.entries(glob).sort(([a], [b]) => a.localeCompare(b));
  for (const [path, mod] of entries) {
    const slug = slugFromPath(path);
    const raw = mod?.default;
    if (raw == null || typeof raw !== 'object') {
      console.warn(`[tenant-alpha:getFilePages] Ignoring invalid page module at "${path}".`);
      continue;
    }
    if (bySlug.has(slug)) {
      console.warn(`[tenant-alpha:getFilePages] Duplicate slug "${slug}" at "${path}". Keeping latest match.`);
    }
    bySlug.set(slug, raw as PageConfig);
  }
  const slugs = Array.from(bySlug.keys()).sort((a, b) =>
    a === 'home' ? -1 : b === 'home' ? 1 : a.localeCompare(b)
  );
  const record: Record<string, PageConfig> = {};
  for (const slug of slugs) {
    const config = bySlug.get(slug);
    if (config) record[slug] = config;
  }
  return record;
}

END_OF_FILE_CONTENT
echo "Creating src/lib/schemas.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/schemas.ts"
export { BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema, CtaSchema } from './base-schemas';

import { HeaderSchema }           from '@/components/header';
import { FooterSchema }           from '@/components/footer';
import { HeroSchema }             from '@/components/hero';
import { FeatureGridSchema }      from '@/components/feature-grid';
import { ProblemStatementSchema } from '@/components/problem-statement';
import { CtaBannerSchema }        from '@/components/cta-banner';
import { GitSectionSchema }       from '@/components/git-section';
import { DevexSchema }            from '@/components/devex';
import { TiptapSchema }           from '@/components/tiptap';

export const SECTION_SCHEMAS = {
  'header':            HeaderSchema,
  'footer':            FooterSchema,
  'hero':              HeroSchema,
  'feature-grid':      FeatureGridSchema,
  'problem-statement': ProblemStatementSchema,
  'cta-banner':        CtaBannerSchema,
  'git-section':       GitSectionSchema,
  'devex':             DevexSchema,
  'tiptap':            TiptapSchema,
} as const;

export type SectionType = keyof typeof SECTION_SCHEMAS;

END_OF_FILE_CONTENT
echo "Creating src/lib/useFormSubmit.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/useFormSubmit.ts"
import { useState, useCallback } from 'react';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface UseFormSubmitOptions {
  source: string;
  tenantId: string;
}

export function useFormSubmit({ source, tenantId }: UseFormSubmitOptions) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [message, setMessage] = useState<string>('');

  const submit = useCallback(async (
    formData: FormData, 
    recipientEmail: string, 
    pageSlug: string, 
    sectionId: string
  ) => {
    const cloudApiUrl = import.meta.env.VITE_JSONPAGES_CLOUD_URL as string | undefined;
    const cloudApiKey = import.meta.env.VITE_JSONPAGES_API_KEY as string | undefined;

    if (!cloudApiUrl || !cloudApiKey) {
      setStatus('error');
      setMessage('Configurazione API non disponibile. Riprova tra poco.');
      return false;
    }

    // Trasformiamo FormData in un oggetto piatto per il payload JSON
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = String(value).trim();
    });

    const payload = {
      ...data,
      recipientEmail,
      page: pageSlug,
      section: sectionId,
      tenant: tenantId,
      source: source,
      submittedAt: new Date().toISOString(),
    };

    // Idempotency Key per evitare doppi invii accidentali
    const idempotencyKey = `form-${sectionId}-${Date.now()}`;

    setStatus('submitting');
    setMessage('Invio in corso...');

    try {
      const apiBase = cloudApiUrl.replace(/\/$/, '');
      const response = await fetch(`${apiBase}/forms/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cloudApiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => ({}))) as { error?: string; code?: string };

      if (!response.ok) {
        throw new Error(body.error || body.code || `Submit failed (${response.status})`);
      }

      setStatus('success');
      setMessage('Richiesta inviata con successo. Ti risponderemo al più presto.');
      return true;
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Invio non riuscito. Riprova tra poco.';
      setStatus('error');
      setMessage(errorMsg);
      return false;
    }
  }, [source, tenantId]);

  const reset = useCallback(() => {
    setStatus('idle');
    setMessage('');
  }, []);

  return { submit, status, message, reset };
}
END_OF_FILE_CONTENT
echo "Creating src/lib/utils.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/utils.ts"
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

END_OF_FILE_CONTENT
echo "Creating src/main.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/main.tsx"
import '@/types'; // TBP: load type augmentation from capsule-driven types
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




END_OF_FILE_CONTENT
mkdir -p "src/types"
echo "Creating src/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/types.ts"
import type { MenuItem } from '@olonjs/core';
import type { HeaderData,           HeaderSettings }           from '@/components/header';
import type { FooterData,           FooterSettings }           from '@/components/footer';
import type { HeroData,             HeroSettings }             from '@/components/hero';
import type { FeatureGridData,      FeatureGridSettings }      from '@/components/feature-grid';
import type { ProblemStatementData, ProblemStatementSettings } from '@/components/problem-statement';
import type { CtaBannerData,        CtaBannerSettings }        from '@/components/cta-banner';
import type { GitSectionData,       GitSectionSettings }       from '@/components/git-section';
import type { DevexData,            DevexSettings }            from '@/components/devex';
import type { TiptapData,           TiptapSettings }           from '@/components/tiptap';

export type SectionComponentPropsMap = {
  'header':            { data: HeaderData;           settings?: HeaderSettings;           menu: MenuItem[] };
  'footer':            { data: FooterData;            settings?: FooterSettings            };
  'hero':              { data: HeroData;              settings?: HeroSettings              };
  'feature-grid':      { data: FeatureGridData;       settings?: FeatureGridSettings       };
  'problem-statement': { data: ProblemStatementData;  settings?: ProblemStatementSettings  };
  'cta-banner':        { data: CtaBannerData;         settings?: CtaBannerSettings         };
  'git-section':       { data: GitSectionData;        settings?: GitSectionSettings        };
  'devex':             { data: DevexData;             settings?: DevexSettings             };
  'tiptap':            { data: TiptapData;            settings?: TiptapSettings            };
};

declare module '@olonjs/core' {
  export interface SectionDataRegistry {
    'header':            HeaderData;
    'footer':            FooterData;
    'hero':              HeroData;
    'feature-grid':      FeatureGridData;
    'problem-statement': ProblemStatementData;
    'cta-banner':        CtaBannerData;
    'git-section':       GitSectionData;
    'devex':             DevexData;
    'tiptap':            TiptapData;
  }
  export interface SectionSettingsRegistry {
    'header':            HeaderSettings;
    'footer':            FooterSettings;
    'hero':              HeroSettings;
    'feature-grid':      FeatureGridSettings;
    'problem-statement': ProblemStatementSettings;
    'cta-banner':        CtaBannerSettings;
    'git-section':       GitSectionSettings;
    'devex':             DevexSettings;
    'tiptap':            TiptapSettings;
  }
}

export * from '@olonjs/core';

END_OF_FILE_CONTENT
echo "Creating src/types/deploy.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/types/deploy.ts"
export type StepId = 'commit' | 'push' | 'build' | 'live';

export type StepState = 'pending' | 'active' | 'done';

export type DeployPhase = 'idle' | 'running' | 'done' | 'error';

export interface DeployStep {
  id: StepId;
  label: string;
  verb: string;
  poem: [string, string];
  color: string;
  glyph: string;
  duration: number;
}


END_OF_FILE_CONTENT
echo "Creating src/vite-env.d.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/vite-env.d.ts"
/// <reference types="vite/client" />

declare module '*?inline' {
  const content: string;
  export default content;
}



END_OF_FILE_CONTENT
