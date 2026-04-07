/**
 * SantaMamma — Thin Entry Point (Tenant).
 * Data from getHydratedData (file-backed or draft); assets from public/assets/images.
 * Supports Hybrid Persistence: Local Filesystem (Dev) or Cloud Bridge (Prod).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { JsonPagesEngine } from '@olonjs/core';
import type { JsonPagesConfig, LibraryImageEntry, ProjectState } from '@olonjs/core';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { addSectionConfig } from '@/lib/addSectionConfig';
import { getHydratedData } from '@/lib/draftStorage';
import type { SiteConfig, ThemeConfig, MenuConfig } from '@/types';
import type { DeployPhase, StepId } from '@/types/deploy';
import { DEPLOY_STEPS } from '@/lib/deploySteps';
import { startCloudSaveStream } from '@/lib/cloudSaveStream';
import siteData from '@/data/config/site.json';
import themeData from '@/data/config/theme.json';
import menuData from '@/data/config/menu.json';
import { getFilePages } from '@/lib/getFilePages';
import { DopaDrawer } from '@/components/save-drawer/DopaDrawer';

import fontsCss from './fonts.css?inline';
import tenantCss from './index.css?inline';

const CLOUD_API_URL =
  import.meta.env.VITE_OLONJS_CLOUD_URL ?? import.meta.env.VITE_JSONPAGES_CLOUD_URL;
const CLOUD_API_KEY =
  import.meta.env.VITE_OLONJS_API_KEY ?? import.meta.env.VITE_JSONPAGES_API_KEY;

const themeConfig = themeData as unknown as ThemeConfig;
const menuConfig  = menuData  as unknown as MenuConfig;
const TENANT_ID   = 'santamamma';   // 🌿 SantaMamma Agriturismo

const filePages     = getFilePages();
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

function getInitialData() {
  return getHydratedData(TENANT_ID, filePages, fileSiteConfig);
}

function getInitialCloudSaveUiState(): CloudSaveUiState {
  return { isOpen: false, phase: 'idle', currentStepId: null, doneSteps: [], progress: 0 };
}

function stepProgress(doneSteps: StepId[]): number {
  return Math.round((doneSteps.length / DEPLOY_STEPS.length) * 100);
}

function normalizeApiBase(raw: string): string {
  return raw.trim().replace(/\/+$/, '');
}

function buildUploadEndpoint(raw: string): string {
  const base = normalizeApiBase(raw);
  const withApi = /\/api\/v1$/i.test(base) ? base : `${base}/api/v1`;
  return `${withApi}/assets/upload`;
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function backoffDelayMs(attempt: number): number {
  const base = 250 * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 120);
  return base + jitter;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const [{ pages, siteConfig }] = useState(getInitialData);
  const [assetsManifest, setAssetsManifest] = useState<LibraryImageEntry[]>([]);
  const [cloudSaveUi, setCloudSaveUi]       = useState<CloudSaveUiState>(getInitialCloudSaveUiState);
  const activeCloudSaveController = useRef<AbortController | null>(null);
  const pendingCloudSave          = useRef<{ state: ProjectState; slug: string } | null>(null);
  const isCloudMode = Boolean(CLOUD_API_URL && CLOUD_API_KEY);

  const loadAssetsManifest = useCallback(async (): Promise<void> => {
    if (isCloudMode && CLOUD_API_URL && CLOUD_API_KEY) {
      try {
        const res = await fetch(`${buildUploadEndpoint(CLOUD_API_URL).replace(/\/upload$/, '/list')}?limit=200`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${CLOUD_API_KEY}`,
          },
        });
        const body = (await res.json().catch(() => ({}))) as { items?: LibraryImageEntry[] };
        if (res.ok) {
          setAssetsManifest(Array.isArray(body.items) ? body.items : []);
          return;
        }
      } catch {
        // fallback to empty
      }
      setAssetsManifest([]);
      return;
    }

    fetch('/api/list-assets')
      .then((r) => (r.ok ? r.json() : []))
      .then((list: LibraryImageEntry[]) => setAssetsManifest(Array.isArray(list) ? list : []))
      .catch(() => setAssetsManifest([]));
  }, [isCloudMode, CLOUD_API_URL, CLOUD_API_KEY]);

  useEffect(() => {
    void loadAssetsManifest();
  }, [loadAssetsManifest]);

  useEffect(() => {
    return () => { activeCloudSaveController.current?.abort(); };
  }, []);

  const runCloudSave = useCallback(
    async (payload: { state: ProjectState; slug: string }, rejectOnError: boolean): Promise<void> => {
      if (!CLOUD_API_URL || !CLOUD_API_KEY) {
        const err = new Error('Cloud mode is not configured.');
        if (rejectOnError) throw err;
        return;
      }
      pendingCloudSave.current = payload;
      activeCloudSaveController.current?.abort();
      const controller = new AbortController();
      activeCloudSaveController.current = controller;
      setCloudSaveUi({ isOpen: true, phase: 'running', currentStepId: null, doneSteps: [], progress: 0 });
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
                return { ...prev, isOpen: true, phase: 'running', currentStepId: event.id, errorMessage: undefined };
              }
              if (prev.doneSteps.includes(event.id)) return prev;
              const nextDone = [...prev.doneSteps, event.id];
              return { ...prev, isOpen: true, phase: 'running', currentStepId: event.id, doneSteps: nextDone, progress: stepProgress(nextDone) };
            });
          },
          onDone: (event) => {
            const completed = DEPLOY_STEPS.map((step) => step.id);
            setCloudSaveUi({ isOpen: true, phase: 'done', currentStepId: 'live', doneSteps: completed, progress: 100, deployUrl: event.deployUrl });
          },
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Cloud save failed.';
        setCloudSaveUi((prev) => ({ ...prev, isOpen: true, phase: 'error', errorMessage: message }));
        if (rejectOnError) throw new Error(message);
      } finally {
        if (activeCloudSaveController.current === controller) {
          activeCloudSaveController.current = null;
        }
      }
    },
    []
  );

  const closeCloudDrawer = useCallback(() => { setCloudSaveUi(getInitialCloudSaveUiState()); }, []);
  const retryCloudSave   = useCallback(() => {
    if (!pendingCloudSave.current) return;
    void runCloudSave(pendingCloudSave.current, false);
  }, [runCloudSave]);

  const config: JsonPagesConfig = {
    tenantId: TENANT_ID,
    registry: ComponentRegistry as JsonPagesConfig['registry'],
    schemas:  SECTION_SCHEMAS as unknown as JsonPagesConfig['schemas'],
    pages,
    siteConfig,
    themeConfig,
    menuConfig,
    themeCss: { tenant: fontsCss + '\n' + tenantCss },
    addSection: addSectionConfig,
    webmcp: {
      enabled: true,
      namespace: typeof window !== 'undefined' ? window.location.href : '',
    },
    persistence: {
      async saveToFile(state: ProjectState, slug: string): Promise<void> {
        if (isCloudMode) { await runCloudSave({ state, slug }, true); return; }
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
      },
      showLocalSave: !isCloudMode,
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
          let lastError: Error | null = null;
          for (let attempt = 0; attempt <= ASSET_UPLOAD_MAX_RETRIES; attempt += 1) {
            try {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('filename', file.name);
              const controller = new AbortController();
              const timeout = window.setTimeout(() => controller.abort(), ASSET_UPLOAD_TIMEOUT_MS);
              const res = await fetch(buildUploadEndpoint(CLOUD_API_URL), {
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
              lastError = new Error(body.error || body.code || `Upload failed: ${res.status}`);
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
          throw lastError ?? new Error('Cloud upload failed.');
        }

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload  = () => resolve((reader.result as string).split(',')[1] ?? '');
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

  return (
    <>
      <JsonPagesEngine config={config} />
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
  );
}

export default App;
