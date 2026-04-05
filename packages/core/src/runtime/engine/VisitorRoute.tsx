import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveRuntimeConfig } from '../../contract/config-resolver';
import type { JsonPagesConfig } from '../../contract/types-engine';
import type { MenuItem, PageConfig, SiteConfig } from '../../contract/kernel';
import { StudioProvider } from '../../studio/StudioContext';
import { PageRenderer } from '../rendering/PageRenderer';
import { ThemeLoader } from '../theme/ThemeLoader';
import { themeManager } from '../theme/theme-manager';
import {
  buildPageContractHref,
  buildPageManifestHref,
  syncHeadLink,
  syncWebMcpJsonLd,
} from './head-sync';
import {
  resolvePageFromRegistry,
  resolveSlugFromPathname,
} from './route-utils';

export interface VisitorRouteProps {
  pageRegistry: Record<string, PageConfig>;
  siteConfig: SiteConfig;
  menuConfig: { main: MenuItem[] };
  themeConfig: JsonPagesConfig['themeConfig'];
  refDocuments?: JsonPagesConfig['refDocuments'];
  tenantCss: string;
  adminCss: string;
  NotFoundComponent: React.ComponentType;
}

export const VisitorRoute: React.FC<VisitorRouteProps> = ({
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
