import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { AccommodationsSectionSchema } from './schema';

export type AccommodationsSectionData = z.infer<typeof AccommodationsSectionSchema>;
export type AccommodationsSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

