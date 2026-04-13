import { z } from 'zod';
import { BaseSectionData, BaseArrayItem, ImageSelectionSchema } from '@/lib/base-schemas';

const AccommodationItem = BaseArrayItem.extend({
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
  features: z.array(z.string()).describe('ui:list'),
  image: ImageSelectionSchema,
});

export const AccommodationsSectionSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  subtitle: z.string().optional().describe('ui:textarea'),
  accommodations: z.array(AccommodationItem).describe('ui:list'),
});

