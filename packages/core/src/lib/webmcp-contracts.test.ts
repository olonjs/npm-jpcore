import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { buildPageContract, buildPageManifest, buildSiteManifest } from './webmcp-contracts.mjs';

describe('webmcp-contracts', () => {
  const HeroSchema = z.object({
    title: z.string().describe('ui:text'),
    ctas: z.array(
      z.object({
        id: z.string().optional(),
        label: z.string(),
        href: z.string(),
      })
    ).optional(),
  });

  const FeatureGridSchema = z.object({
    sectionTitle: z.string(),
  });

  const HeaderSchema = z.object({
    logoText: z.string(),
  });

  it('builds a page contract with only the schemas used on the page', () => {
    const contract = buildPageContract({
      slug: 'home',
      pageConfig: {
        id: 'home-page',
        slug: 'home',
        meta: {
          title: 'Home',
          description: 'Landing page',
        },
        sections: [
          { id: 'hero-main', type: 'hero', data: { title: 'Start' } },
        ],
      },
      schemas: {
        hero: HeroSchema,
        'feature-grid': FeatureGridSchema,
        header: HeaderSchema,
      },
      siteConfig: {
        identity: { title: 'Site' },
        pages: [],
        header: { id: 'global-header', type: 'header', data: { logoText: 'Olon' } },
      },
    });

    expect(contract.slug).toBe('home');
    expect(contract.sectionTypes).toEqual(['header', 'hero']);
    expect(Object.keys(contract.sectionSchemas)).toEqual(['header', 'hero']);
    expect(contract.sectionInstances).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'global-header', type: 'header', scope: 'global' }),
        expect.objectContaining({ id: 'hero-main', type: 'hero', scope: 'local' }),
      ])
    );
    expect(contract.tools).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'update-header' }),
        expect.objectContaining({
          name: 'update-hero',
          inputSchema: expect.objectContaining({
            type: 'object',
            required: ['sectionId'],
          }),
        }),
      ])
    );
  });

  it('builds a page-scoped manifest for the active page', () => {
    const manifest = buildPageManifest({
      slug: 'design-system',
      pageConfig: {
        id: 'design-system-page',
        slug: 'design-system',
        meta: { title: 'Design System', description: 'Tokens' },
        sections: [{ id: 'ds-main', type: 'feature-grid', data: { sectionTitle: 'Scale' } }],
      },
      schemas: {
        'feature-grid': FeatureGridSchema,
        header: HeaderSchema,
      },
      siteConfig: {
        identity: { title: 'Site' },
        pages: [],
        header: { id: 'global-header', type: 'header', data: { logoText: 'Olon' } },
      },
    });

    expect(manifest.slug).toBe('design-system');
    expect(manifest.contractHref).toBe('/schemas/design-system.schema.json');
    expect(manifest.tools).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'update-header' }),
        expect.objectContaining({ name: 'update-feature-grid' }),
      ])
    );
    expect(manifest.transport).toMatchObject({
      kind: 'window-message',
      requestType: 'olonjs:webmcp:tool-call',
      resultType: 'olonjs:webmcp:tool-result',
    });
  });

  it('builds a site manifest index with per-page manifest references', () => {
    const manifest = buildSiteManifest({
      pages: {
        home: {
          id: 'home-page',
          slug: 'home',
          meta: { title: 'Home', description: 'Landing page' },
          sections: [{ id: 'hero-main', type: 'hero', data: { title: 'Start' } }],
        },
        'design-system': {
          id: 'design-system-page',
          slug: 'design-system',
          meta: { title: 'Design System', description: 'Tokens' },
          sections: [{ id: 'ds-main', type: 'feature-grid', data: { sectionTitle: 'Scale' } }],
        },
      },
      schemas: {
        hero: HeroSchema,
        'feature-grid': FeatureGridSchema,
      },
      siteConfig: {
        identity: { title: 'Site' },
        pages: [],
      },
    });

    expect(manifest.kind).toBe('olonjs-mcp-manifest-index');
    expect(manifest.pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: 'home',
          manifestHref: '/mcp-manifests/home.json',
          contractHref: '/schemas/home.schema.json',
        }),
        expect.objectContaining({
          slug: 'design-system',
          manifestHref: '/mcp-manifests/design-system.json',
          contractHref: '/schemas/design-system.schema.json',
        }),
      ])
    );
  });
});
