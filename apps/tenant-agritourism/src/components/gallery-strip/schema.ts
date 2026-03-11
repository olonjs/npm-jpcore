import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const GalleryImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
}).describe('ui:image-picker');

const GalleryItemSchema = BaseArrayItem.extend({
  image:   GalleryImageSchema,
  caption: z.string().optional().describe('ui:text'),
});

export const GalleryStripSchema = BaseSectionData.extend({
  label:  z.string().optional().describe('ui:text'),
  title:  z.string().optional().describe('ui:text'),
  images: z.array(GalleryItemSchema).describe('ui:list'),
});
