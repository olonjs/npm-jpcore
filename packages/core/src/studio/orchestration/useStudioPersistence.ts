import { useCallback, useState } from 'react';
import { resolveRuntimeConfig } from '../../contract/config-resolver';
import type { MenuItem, PageConfig, ProjectState, SiteConfig } from '../../contract/kernel';
import type { JsonPagesConfig } from '../../contract/types-engine';
import { resolveMenuMainFromHeaderData } from '../../runtime/engine/route-utils';
import { STUDIO_EVENTS } from '../events';

interface UseStudioPersistenceArgs {
  slug: string;
  saveToFile?: (state: ProjectState, slug: string) => Promise<void>;
  hotSave?: (state: ProjectState, slug: string) => Promise<void>;
  themeConfig: JsonPagesConfig['themeConfig'];
  menuConfig: { main: MenuItem[] };
  refDocuments?: JsonPagesConfig['refDocuments'];
}

export function useStudioPersistence({
  slug,
  saveToFile,
  hotSave,
  themeConfig,
  menuConfig,
  refDocuments,
}: UseStudioPersistenceArgs) {
  const [saveSuccessFeedback, setSaveSuccessFeedback] = useState(false);
  const [hotSaveSuccessFeedback, setHotSaveSuccessFeedback] = useState(false);
  const [hotSaveInProgress, setHotSaveInProgress] = useState(false);

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

  const buildProjectState = useCallback(
    (nextDraft: PageConfig, nextGlobalDraft: SiteConfig): ProjectState => {
      const resolvedSaveRuntime = resolveRuntimeConfig({
        pages: { [slug]: nextDraft },
        siteConfig: nextGlobalDraft,
        themeConfig,
        menuConfig,
        refDocuments,
      });
      const headerData = resolvedSaveRuntime.siteConfig.header?.data;
      return {
        page: nextDraft,
        site: nextGlobalDraft,
        menu: { main: resolveMenuMainFromHeaderData(headerData, menuConfig.main) },
        theme: resolvedSaveRuntime.themeConfig,
      };
    },
    [slug, themeConfig, menuConfig, refDocuments]
  );

  const persistProjectState = useCallback(
    async (
      nextDraft: PageConfig,
      nextGlobalDraft: SiteConfig,
      onPersisted?: () => void
    ) => {
      if (!saveToFile) {
        throw new Error('saveToFile is not configured for this tenant.');
      }

      await saveToFile(buildProjectState(nextDraft, nextGlobalDraft), slug);
      onPersisted?.();
      setSaveSuccessFeedback(true);
      if (typeof window !== 'undefined') {
        window.setTimeout(() => setSaveSuccessFeedback(false), 2500);
      }
    },
    [buildProjectState, saveToFile, slug]
  );

  const runHotSave = useCallback(
    async (
      nextDraft: PageConfig,
      nextGlobalDraft: SiteConfig,
      onPersisted?: () => void
    ) => {
      if (!hotSave) return;

      setHotSaveInProgress(true);
      try {
        await hotSave(buildProjectState(nextDraft, nextGlobalDraft), slug);
        onPersisted?.();
        setHotSaveSuccessFeedback(true);
        if (typeof window !== 'undefined') {
          window.setTimeout(() => setHotSaveSuccessFeedback(false), 2500);
        }
      } finally {
        setHotSaveInProgress(false);
      }
    },
    [buildProjectState, hotSave, slug]
  );

  return {
    buildProjectState,
    hotSaveInProgress,
    hotSaveSuccessFeedback,
    persistProjectState,
    requestInlineFlush,
    runHotSave,
    saveSuccessFeedback,
  };
}
