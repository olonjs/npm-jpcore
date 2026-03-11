import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ActivitiesGridSchema } from './schema';

export type ActivitiesGridData     = z.infer<typeof ActivitiesGridSchema>;
export type ActivitiesGridSettings = z.infer<typeof BaseSectionSettingsSchema>;
