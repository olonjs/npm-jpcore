import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const ActivityItemSchema = BaseArrayItem.extend({
  icon:        z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const ActivitiesGridSchema = BaseSectionData.extend({
  label:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  items:       z.array(ActivityItemSchema).describe('ui:list'),
});
