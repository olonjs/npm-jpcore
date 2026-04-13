import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ExperiencesSectionSchema } from './schema';

export type ExperiencesSectionData = z.infer<typeof ExperiencesSectionSchema>;
export type ExperiencesSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

