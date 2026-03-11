import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const TestimonialItemSchema = BaseArrayItem.extend({
  name:     z.string().describe('ui:text'),
  location: z.string().optional().describe('ui:text'),
  rating:   z.number().min(1).max(5).default(5).describe('ui:number'),
  quote:    z.string().describe('ui:textarea'),
});

export const TestimonialsSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  items: z.array(TestimonialItemSchema).describe('ui:list'),
});
