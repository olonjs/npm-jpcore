import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const PlanSchema = BaseArrayItem.extend({
  name:        z.string().describe('ui:text'),
  price:       z.string().describe('ui:text'),
  period:      z.string().optional().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  features:    z.array(z.string()).optional(),
  ctaLabel:    z.string().optional().describe('ui:text'),
  ctaHref:     z.string().optional().describe('ui:text'),
  featured:    z.boolean().optional().default(false),
});

export const PricingTableSchema = BaseSectionData.extend({
  label:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  plans:       z.array(PlanSchema).describe('ui:list'),
});
