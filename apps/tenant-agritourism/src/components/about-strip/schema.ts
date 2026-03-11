import { z } from 'zod';
import { BaseSectionData, BaseArrayItem, ImageSelectionSchema } from '@/lib/base-schemas';

const BulletSchema = BaseArrayItem.extend({
  text: z.string().describe('ui:text'),
});

export const AboutStripSchema = BaseSectionData.extend({
  label:         z.string().optional().describe('ui:text'),
  title:         z.string().describe('ui:text'),
  description:   z.string().optional().describe('ui:textarea'),
  bullets:       z.array(BulletSchema).optional().describe('ui:list'),
  imageUrl:      ImageSelectionSchema.optional(),
  imageAlt:      z.string().optional().describe('ui:text'),
  imagePosition: z.enum(['left','right']).default('right').describe('ui:select'),
});
