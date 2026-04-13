import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const RowSchema = BaseArrayItem.extend({
  treatment: z.string().describe('ui:text'),
  price: z.string().describe('ui:text'),
  details: z.string().describe('ui:textarea'),
});

const NoteSchema = BaseArrayItem.extend({
  title: z.string().describe('ui:text'),
  body: z.string().describe('ui:textarea'),
});

export const PricingSectionSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
  rows: z.array(RowSchema).describe('ui:list'),
  notes: z.array(NoteSchema).describe('ui:list'),
});

