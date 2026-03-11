import { z } from 'zod';
import { BaseSectionData, BaseArrayItem, ImageSelectionSchema } from '@/lib/base-schemas';

const KitchenFeatureSchema = BaseArrayItem.extend({
  icon: z.string().optional().describe('ui:text'),
  text: z.string().describe('ui:text'),
});

export const KitchenShowcaseSchema = BaseSectionData.extend({
  label:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  quote:       z.string().optional().describe('ui:textarea'),
  description: z.string().optional().describe('ui:textarea'),
  features:    z.array(KitchenFeatureSchema).optional().describe('ui:list'),
  imageUrl:    ImageSelectionSchema.optional(),
  imageAlt:    z.string().optional().describe('ui:text'),
});
