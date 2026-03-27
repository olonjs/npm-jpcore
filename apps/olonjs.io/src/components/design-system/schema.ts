import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const DesignSystemSchema = BaseSectionData.extend({
  title: z.string().optional().describe('ui:text'),
});

export const DesignSystemSettingsSchema = z.object({
  /** Pre-resolved CSS var map injected at SSG bake time. Keys are var names (e.g. "--background"), values are resolved hex strings. */
  initialCssVars: z.record(z.string()).optional(),
});
