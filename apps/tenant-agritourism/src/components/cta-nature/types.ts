import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { CtaNatureSchema } from './schema';

export type CtaNatureData     = z.infer<typeof CtaNatureSchema>;
export type CtaNatureSettings = z.infer<typeof BaseSectionSettingsSchema>;
