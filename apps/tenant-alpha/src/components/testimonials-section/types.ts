import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { TestimonialsSectionSchema } from './schema';

export type TestimonialsSectionData = z.infer<typeof TestimonialsSectionSchema>;
export type TestimonialsSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

