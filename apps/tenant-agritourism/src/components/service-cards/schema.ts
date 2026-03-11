import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const ServiceCardSchema = BaseArrayItem.extend({
  emoji:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
  href:        z.string().optional().describe('ui:text'),
});

export const ServiceCardsSchema = BaseSectionData.extend({
  label:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  cards:       z.array(ServiceCardSchema).describe('ui:list'),
});
