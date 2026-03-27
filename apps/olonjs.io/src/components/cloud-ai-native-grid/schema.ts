import { z } from 'zod';
import { BaseArrayItem, BaseSectionData, ImageSelectionSchema } from '@/lib/base-schemas';

const FeatureCardSchema = BaseArrayItem.extend({
  icon:        ImageSelectionSchema.describe('ui:image-picker'),
  title:       z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const CloudAiNativeGridSchema = BaseSectionData.extend({
  titlePrefix:   z.string().describe('ui:text'),
  titleGradient: z.string().describe('ui:text'),
  description:   z.string().describe('ui:textarea'),
  cards:         z.array(FeatureCardSchema).describe('ui:list'),
});

export const CloudAiNativeGridSettingsSchema = z.object({});
