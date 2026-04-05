import type { MenuItem, PageConfig } from '../../contract/kernel';
import { resolveHeaderMenuItems } from '../../contract/config-resolver';

export function normalizeSlugSegments(value: string): string {
  return value
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

export function resolveSlugFromPathname(pathname: string, prefix = ''): string {
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

export function resolvePageFromRegistry(
  pageRegistry: Record<string, PageConfig>,
  requestedSlug: string
): PageConfig | undefined {
  const normalized = normalizeSlugSegments(requestedSlug) || 'home';
  return pageRegistry[normalized];
}

export function resolveMenuMainFromHeaderData(
  headerData: unknown,
  fallbackMain: MenuItem[]
): MenuItem[] {
  return resolveHeaderMenuItems(headerData, fallbackMain);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
