import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { PricingSectionSchema } from './schema';

export type PricingSectionData = z.infer<typeof PricingSectionSchema>;
export type PricingSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

