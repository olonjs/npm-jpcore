import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { PricingTableSchema } from './schema';

export type PricingTableData     = z.infer<typeof PricingTableSchema>;
export type PricingTableSettings = z.infer<typeof BaseSectionSettingsSchema>;
