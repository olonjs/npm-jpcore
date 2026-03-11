import { z } from 'zod';
import { BaseSectionData, CtaSchema, ImageSelectionSchema } from '@/lib/base-schemas';

export const HeroSchema = BaseSectionData.extend({
  badge:         z.string().optional().describe('ui:text'),
  title:         z.string().describe('ui:text'),
  titleHighlight:z.string().optional().describe('ui:text'),
  description:   z.string().optional().describe('ui:textarea'),
  bgImageUrl:    ImageSelectionSchema.optional(),
  ctas:          z.array(CtaSchema).optional().describe('ui:list'),
  scrollLabel:   z.string().optional().describe('ui:text'),
});
