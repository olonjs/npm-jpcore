import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { CuisineSectionSchema } from './schema';

export type CuisineSectionData = z.infer<typeof CuisineSectionSchema>;
export type CuisineSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

