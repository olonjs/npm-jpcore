/**
 * Conceptual public surface for runtime and studio concerns.
 *
 * This keeps the engine-facing API grouped even before we physically
 * split packages.
 */
export { PageRenderer } from './rendering/PageRenderer';
export { SectionRenderer } from './rendering/SectionRenderer';
export { JsonPagesEngine, type JsonPagesEngineProps } from './engine/JsonPagesEngine';
export { StudioProvider, useStudio } from '../studio/StudioContext';
export { ConfigProvider, useConfig, type ConfigContextValue } from './config/ConfigContext';
export { ThemeLoader, type ThemeLoaderProps } from './theme/ThemeLoader';
export { DefaultNotFound } from '../lib/DefaultNotFound';
export { STUDIO_EVENTS } from '../studio/events';
export * from './engine';
export * from './assets';
export * from './config';
export * from './rendering';
export * from './theme';
