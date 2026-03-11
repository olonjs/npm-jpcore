import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { GalleryStripSchema } from './schema';

export type GalleryStripData     = z.infer<typeof GalleryStripSchema>;
export type GalleryStripSettings = z.infer<typeof BaseSectionSettingsSchema>;
