import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ContactSectionSchema } from './schema';

export type ContactSectionData = z.infer<typeof ContactSectionSchema>;
export type ContactSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

