import { z } from 'zod';
import { BaseSectionData, ImageSelectionSchema } from '@/lib/base-schemas';

export const CtaNatureSchema = BaseSectionData.extend({
  title:          z.string().describe('ui:text'),
  subtitle:       z.string().optional().describe('ui:textarea'),
  bgImageUrl:     ImageSelectionSchema.optional(),
  ctaLabel:       z.string().describe('ui:text'),
  ctaHref:        z.string().describe('ui:text'),
  secondaryLabel: z.string().optional().describe('ui:text'),
  secondaryHref:  z.string().optional().describe('ui:text'),
});
