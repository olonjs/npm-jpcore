/**
 * Centralized asset resolution for tenant-scoped static assets.
 */
export const resolveAssetUrl = (path: string, tenantId: string = 'default'): string => {
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('#')) {
    return path;
  }

  if (path.startsWith('/assets/')) return path;
  if (path.startsWith('assets/')) return `/${path}`;
  if (path.startsWith('/uploaded-assets/')) return path;

  const hasFileExtension = /\.(jpg|jpeg|png|gif|svg|pdf|webp|mp4|webm|ogg)$/i.test(path);
  if (!hasFileExtension) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  const cleanPath = path.replace(/^\//, '');
  return `/assets/${tenantId}/${cleanPath}`;
};
