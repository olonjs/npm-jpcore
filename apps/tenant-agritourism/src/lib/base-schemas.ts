import { z } from 'zod';

export const ImageSelectionSchema = z
  .object({ url: z.string(), alt: z.string().optional() })
  .describe('ui:image-picker');

export const BaseSectionData = z.object({
  anchorId: z.string().optional().describe('ui:text'),
});

export const BaseArrayItem = z.object({
  id: z.string().optional(),
});

export const BaseSectionSettingsSchema = z.object({
  paddingTop:    z.enum(['none','sm','md','lg','xl','2xl']).default('md').describe('ui:select'),
  paddingBottom: z.enum(['none','sm','md','lg','xl','2xl']).default('md').describe('ui:select'),
  theme:         z.enum(['dark','light','accent']).default('light').describe('ui:select'),
  container:     z.enum(['boxed','fluid']).default('boxed').describe('ui:select'),
});

export const CtaSchema = z.object({
  id:      z.string().optional(),
  label:   z.string().describe('ui:text'),
  href:    z.string().describe('ui:text'),
  variant: z.enum(['primary','secondary']).default('primary').describe('ui:select'),
});
