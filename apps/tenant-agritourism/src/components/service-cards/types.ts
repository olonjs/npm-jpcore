import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ServiceCardsSchema } from './schema';

export type ServiceCardsData     = z.infer<typeof ServiceCardsSchema>;
export type ServiceCardsSettings = z.infer<typeof BaseSectionSettingsSchema>;
