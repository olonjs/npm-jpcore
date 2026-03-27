import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ConfigProvider, PageRenderer, StudioProvider } from '@olonjs/core';
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
const menuConfig = menuData as unknown as MenuConfig;
const themeConfig = themeData as unknown as ThemeConfig;
const pages = getFilePages();

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
  const aliases: Array<{ name: string; value: string }> = [];
  const hasToken = (name: string) => flattened.some((item) => item.name === name);

  if (hasToken('--theme-colors-background')) aliases.push({ name: '--theme-background', value: 'var(--theme-colors-background)' });
  if (hasToken('--theme-colors-text')) aliases.push({ name: '--theme-text', value: 'var(--theme-colors-text)' });
  if (hasToken('--theme-colors-surface')) aliases.push({ name: '--theme-surface', value: 'var(--theme-colors-surface)' });
  if (hasToken('--theme-colors-surfaceAlt')) aliases.push({ name: '--theme-surface-alt', value: 'var(--theme-colors-surfaceAlt)' });
  if (hasToken('--theme-colors-primary')) aliases.push({ name: '--theme-primary', value: 'var(--theme-colors-primary)' });
  if (hasToken('--theme-colors-secondary')) aliases.push({ name: '--theme-secondary', value: 'var(--theme-colors-secondary)' });
  if (hasToken('--theme-colors-accent')) aliases.push({ name: '--theme-accent', value: 'var(--theme-colors-accent)' });
  if (hasToken('--theme-colors-border')) aliases.push({ name: '--theme-border', value: 'var(--theme-colors-border)' });
  if (hasToken('--theme-colors-textMuted')) aliases.push({ name: '--theme-text-muted', value: 'var(--theme-colors-textMuted)' });
  if (hasToken('--theme-typography-fontFamily-primary')) aliases.push({ name: '--theme-font-primary', value: 'var(--theme-typography-fontFamily-primary)' });
  if (hasToken('--theme-typography-fontFamily-mono')) aliases.push({ name: '--theme-font-mono', value: 'var(--theme-typography-fontFamily-mono)' });
  if (hasToken('--theme-typography-fontFamily-display')) aliases.push({ name: '--theme-font-display', value: 'var(--theme-typography-fontFamily-display)' });
  if (hasToken('--theme-borderRadius-sm')) aliases.push({ name: '--theme-radius-sm', value: 'var(--theme-borderRadius-sm)' });
  if (hasToken('--theme-borderRadius-md')) aliases.push({ name: '--theme-radius-md', value: 'var(--theme-borderRadius-md)' });
  if (hasToken('--theme-borderRadius-lg')) aliases.push({ name: '--theme-radius-lg', value: 'var(--theme-borderRadius-lg)' });

  const serialized = [...flattened, ...aliases].map((item) => `${item.name}:${item.value}`).join(';');
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
            <PageRenderer pageConfig={resolved.page} siteConfig={siteConfig} menuConfig={menuConfig} />
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
