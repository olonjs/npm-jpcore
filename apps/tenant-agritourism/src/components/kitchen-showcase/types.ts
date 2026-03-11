import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { KitchenShowcaseSchema } from './schema';

export type KitchenShowcaseData     = z.infer<typeof KitchenShowcaseSchema>;
export type KitchenShowcaseSettings = z.infer<typeof BaseSectionSettingsSchema>;
