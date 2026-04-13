import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const TestimonialSchema = BaseArrayItem.extend({
  name: z.string().describe('ui:text'),
  quote: z.string().describe('ui:textarea'),
  meta: z.string().describe('ui:text'),
});

export const TestimonialsSectionSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  items: z.array(TestimonialSchema).describe('ui:list'),
});

