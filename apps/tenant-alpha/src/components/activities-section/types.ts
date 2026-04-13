import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ActivitiesSectionSchema } from './schema';

export type ActivitiesSectionData = z.infer<typeof ActivitiesSectionSchema>;
export type ActivitiesSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

