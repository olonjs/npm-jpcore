import { z } from 'zod';
import { BaseSectionData, BaseArrayItem, ImageSelectionSchema } from '@/lib/base-schemas';

const FeatureItem = BaseArrayItem.extend({
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
  icon: z.string().optional().describe('ui:text'),
  image: ImageSelectionSchema,
});

export const FeaturesOverviewSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  features: z.array(FeatureItem).describe('ui:list'),
});

