import { z } from 'zod';
import { BaseSectionData, BaseArrayItem, CtaSchema } from '@/lib/base-schemas';

const DetailSchema = BaseArrayItem.extend({
  title: z.string().describe('ui:text'),
  body: z.string().describe('ui:textarea'),
});

export const ContactSectionSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
  details: z.array(DetailSchema).describe('ui:list'),
  primaryCta: CtaSchema,
});

