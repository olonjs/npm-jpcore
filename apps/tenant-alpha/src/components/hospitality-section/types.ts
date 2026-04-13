import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { HospitalitySectionSchema } from './schema';

export type HospitalitySectionData = z.infer<typeof HospitalitySectionSchema>;
export type HospitalitySectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

