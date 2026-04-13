import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { FeaturesOverviewSchema } from './schema';

export type FeaturesOverviewData = z.infer<typeof FeaturesOverviewSchema>;
export type FeaturesOverviewSettings = z.infer<typeof BaseSectionSettingsSchema>;

