import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { HeroSectionSchema } from './schema';

export type HeroSectionData = z.infer<typeof HeroSectionSchema>;
export type HeroSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

