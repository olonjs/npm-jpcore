import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { AboutStripSchema } from './schema';

export type AboutStripData     = z.infer<typeof AboutStripSchema>;
export type AboutStripSettings = z.infer<typeof BaseSectionSettingsSchema>;
