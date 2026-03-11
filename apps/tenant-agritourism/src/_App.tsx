/**
 * Thin Entry Point (Tenant).
 * Data from getHydratedData (file-backed or draft); assets from public/assets/images.
 * Supports Hybrid Persistence: Local Filesystem (Dev) or Cloud Bridge (Prod).
 */
import { useState, useEffect } from 'react';
import { JsonPagesEngine } from '@jsonpages/core';
import type { LibraryImageEntry } from '@jsonpages/core';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { addSectionConfig } from '@/lib/addSectionConfig';
import { getHydratedData } from '@/lib/draftStorage';
import type { JsonPagesConfig, ProjectState } from '@jsonpages/core';
import type { SiteConfig, ThemeConfig, MenuConfig } from '@/types';

import siteData from '@/data/config/site.json';
import themeData from '@/data/config/theme.json';
import menuData from '@/data/config/menu.json';
import { getFilePages } from '@/lib/getFilePages';

import fontsCss from './fonts.css?inline';
import tenantCss from './index.css?inline';

// Cloud Configuration (Injected by Vercel/Netlify Env Vars)
const CLOUD_API_URL = import.meta.env.VITE_JSONPAGES_CLOUD_URL;
const CLOUD_API_KEY = import.meta.env.VITE_JSONPAGES_API_KEY;

const themeConfig = themeData as unknown as ThemeConfig;
const menuConfig = menuData as unknown as MenuConfig;
const TENANT_ID = 'alpha';

const filePages = getFilePages();
const fileSiteConfig = siteData as unknown as SiteConfig;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

function getInitialData() {
  return getHydratedData(TENANT_ID, filePages, fileSiteConfig);
}

function App() {
  const [{ pages, siteConfig }] = useState(getInitialData);
  const [assetsManifest, setAssetsManifest] = useState<LibraryImageEntry[]>([]);

  useEffect(() => {
    // In Cloud mode, listing assets might be different or disabled for MVP
    // For now, we keep the local fetch which will fail gracefully on Vercel (404)
    fetch('/api/list-assets')
      .then((r) => (r.ok ? r.json() : []))
      .then((list: LibraryImageEntry[]) => setAssetsManifest(Array.isArray(list) ? list : []))
      .catch(() => setAssetsManifest([]));
  }, []);
  
console.log("🔍 DEBUG ENV:", {
  URL: import.meta.env.VITE_JSONPAGES_CLOUD_URL,
  KEY: import.meta.env.VITE_JSONPAGES_API_KEY ? "PRESENT" : "MISSING"
});
  const config: JsonPagesConfig = {
    tenantId: TENANT_ID,
    registry: ComponentRegistry as JsonPagesConfig['registry'],
    schemas: SECTION_SCHEMAS as unknown as JsonPagesConfig['schemas'],
    pages,
    siteConfig,
    themeConfig,
    menuConfig,
    themeCss: { tenant: fontsCss + '\n' + tenantCss },
    addSection: addSectionConfig,
    persistence: {
      async saveToFile(state: ProjectState, slug: string): Promise<void> {
        
        // ☁️ SCENARIO A: CLOUD BRIDGE (Production)
        if (CLOUD_API_URL && CLOUD_API_KEY) {
          console.log(`☁️ Saving ${slug} via Cloud Bridge...`);
          
          const res = await fetch(`${CLOUD_API_URL}/save`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${CLOUD_API_KEY}`
            },
            body: JSON.stringify({ 
              // Mapping logical slug to physical path in repo
              path: `src/data/pages/${slug}.json`, 
              // We save the page config specifically
              content: state.page, 
              message: `Content update for ${slug} via Visual Editor`
            }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Cloud save failed: ${res.status}`);
          }
          return;
        }

        // 💻 SCENARIO B: LOCAL FILESYSTEM (Development)
        console.log(`💻 Saving ${slug} to Local Filesystem...`);
        const res = await fetch('/api/save-to-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectState: state, slug }),
        });
        
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(body.error ?? `Save to file failed: ${res.status}`);
      },
    },
    assets: {
      assetsBaseUrl: '/assets',
      assetsManifest,
      async onAssetUpload(file: File): Promise<string> {
        // Note: Asset upload in Cloud Mode requires the R2 Bridge (Next Step in Roadmap)
        // For now, this works in Local Mode.
        if (!file.type.startsWith('image/')) throw new Error('Invalid file type.');
        if (file.size > MAX_UPLOAD_SIZE_BYTES) throw new Error(`File too large. Max ${MAX_UPLOAD_SIZE_BYTES / 1024 / 1024}MB.`);
        
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
        return body.url;
      },
    },
  };

  return <JsonPagesEngine config={config} />;
}

export default App;
