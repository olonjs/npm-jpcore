import assert from 'node:assert/strict';
import test from 'node:test';

import type { ThemeConfig } from '../lib/kernel';
import { buildThemeVariableMap, themeManager } from './theme-manager';

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function createTheme(
  overrides: DeepPartial<ThemeConfig['tokens']> = {}
): ThemeConfig {
  return {
    name: 'Test Theme',
    tokens: {
      colors: {
        primary: '#111111',
        secondary: '#222222',
        accent: '#333333',
        background: '#444444',
        surface: '#555555',
        surfaceAlt: '#666666',
        text: '#777777',
        textMuted: '#888888',
        border: '#999999',
        ...overrides.colors,
      },
      typography: {
        fontFamily: {
          primary: 'Inter, sans-serif',
          mono: 'JetBrains Mono, monospace',
          display: 'Bricolage Grotesque, sans-serif',
          ...overrides.typography?.fontFamily,
        },
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        ...overrides.borderRadius,
      },
    },
  };
}

class FakeStyle {
  private values = new Map<string, string>();

  setProperty(name: string, value: string): void {
    this.values.set(name, value);
  }

  removeProperty(name: string): void {
    this.values.delete(name);
  }

  getPropertyValue(name: string): string {
    return this.values.get(name) ?? '';
  }
}

test('buildThemeVariableMap exports dynamic variables and semantic aliases', () => {
  const theme = createTheme({
    colors: {
      pi: '#314159',
    },
  });

  const vars = buildThemeVariableMap(theme);

  assert.equal(vars['--theme-colors-primary'], '#111111');
  assert.equal(vars['--theme-colors-pi'], '#314159');
  assert.equal(
    vars['--theme-typography-font-family-display'],
    'Bricolage Grotesque, sans-serif'
  );
  assert.equal(vars['--theme-primary'], 'var(--theme-colors-primary)');
  assert.equal(
    vars['--theme-font-display'],
    'var(--theme-typography-font-family-display)'
  );
  assert.equal(vars['--theme-radius-lg'], 'var(--theme-border-radius-lg)');
});

test('buildThemeVariableMap skips optional aliases when source token is missing', () => {
  const theme = createTheme({
    typography: {
      fontFamily: {
        display: undefined,
      },
    },
  });

  const vars = buildThemeVariableMap(theme);

  assert.equal(vars['--theme-typography-font-family-display'], undefined);
  assert.equal(vars['--theme-font-display'], undefined);
});

test('themeManager.setTheme removes stale dynamic tokens before applying next theme', () => {
  const fakeStyle = new FakeStyle();
  const previousDocument = Reflect.get(globalThis, 'document');

  Reflect.set(globalThis, 'document', {
    documentElement: {
      style: fakeStyle,
    },
  });

  try {
    themeManager.setTheme(
      createTheme({
        colors: {
          pi: '#314159',
        },
      })
    );
    assert.equal(fakeStyle.getPropertyValue('--theme-colors-pi'), '#314159');
    assert.equal(
      fakeStyle.getPropertyValue('--theme-font-display'),
      'var(--theme-typography-font-family-display)'
    );

    themeManager.setTheme(createTheme());
    assert.equal(fakeStyle.getPropertyValue('--theme-colors-pi'), '');
    assert.equal(
      fakeStyle.getPropertyValue('--theme-font-display'),
      'var(--theme-typography-font-family-display)'
    );
  } finally {
    if (previousDocument === undefined) {
      Reflect.deleteProperty(globalThis, 'document');
    } else {
      Reflect.set(globalThis, 'document', previousDocument);
    }
  }
});
