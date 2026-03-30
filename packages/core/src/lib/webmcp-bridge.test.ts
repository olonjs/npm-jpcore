import { describe, expect, it } from 'vitest';
import {
  applyValueAtSelectionPath,
  buildWebMcpToolName,
  ensureWebMcpRuntime,
  parseWebMcpToolName,
  registerWebMcpTool,
  resolveWebMcpMutationData,
} from './webmcp-bridge';

describe('webmcp-bridge', () => {
  it('builds and parses deterministic tool names', () => {
    expect(buildWebMcpToolName('feature-grid')).toBe('update-feature-grid');
    expect(parseWebMcpToolName('update-feature-grid')).toBe('feature-grid');
    expect(parseWebMcpToolName('unknown')).toBeNull();
  });

  it('applies scalar updates through a root field path', () => {
    expect(
      resolveWebMcpMutationData(
        { title: 'Before', description: 'Copy' },
        { sectionId: 'hero-main', fieldKey: 'title', value: 'After' }
      )
    ).toEqual({ title: 'After', description: 'Copy' });
  });

  it('applies nested array updates through itemPath', () => {
    const next = applyValueAtSelectionPath(
      {
        ctas: [
          { id: 'cta-1', label: 'Primary', href: '/before' },
          { id: 'cta-2', label: 'Docs', href: '/docs' },
        ],
      },
      [
        { fieldKey: 'ctas', itemId: 'cta-1' },
        { fieldKey: 'href' },
      ],
      '/after'
    );

    expect(next).toEqual({
      ctas: [
        { id: 'cta-1', label: 'Primary', href: '/after' },
        { id: 'cta-2', label: 'Docs', href: '/docs' },
      ],
    });
  });

  it('replaces the full data payload when data is provided', () => {
    const next = resolveWebMcpMutationData(
      { title: 'Old', description: 'Body' },
      {
        sectionId: 'hero-main',
        data: { title: 'New', description: 'Updated' },
      }
    );

    expect(next).toEqual({ title: 'New', description: 'Updated' });
  });

  it('installs a testing shim that can execute registered tools', async () => {
    const originalWindow = globalThis.window;
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'window', {
      value: {} as Window,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'navigator', {
      value: {} as Navigator,
      configurable: true,
      writable: true,
    });

    ensureWebMcpRuntime();

    try {
      const unregister = registerWebMcpTool({
        name: 'update-hero',
        description: 'Update hero',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => ({
          content: [{ type: 'text', text: 'ok' }],
          isError: false,
        }),
      });

      const tools = navigator.modelContextTesting?.listTools?.() ?? [];
      expect(tools.map((tool) => tool.name)).toContain('update-hero');

      const result = await navigator.modelContextTesting?.executeTool?.('update-hero', '{}');
      expect(JSON.parse(result ?? '{}')).toMatchObject({
        content: [{ type: 'text', text: 'ok' }],
        isError: false,
      });

      unregister();
    } finally {
      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(globalThis, 'navigator', {
        value: originalNavigator,
        configurable: true,
        writable: true,
      });
    }
  });
});
