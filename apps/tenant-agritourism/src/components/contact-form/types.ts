import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ContactFormSchema } from './schema';

export type ContactFormData     = z.infer<typeof ContactFormSchema>;
export type ContactFormSettings = z.infer<typeof BaseSectionSettingsSchema>;
