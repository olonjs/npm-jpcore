import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

export const PillarSchema = BaseArrayItem.extend({
  title: z.string(),
  body:  z.string(),
  icon:  z.enum(['contract', 'holon', 'generated']),
});

export const OlonWhySchema = BaseSectionData.extend({
  label:    z.string().default('Why OlonJS'),
  headline: z.string().default('A Meaningful Web'),
  subline:  z.string().default('Whole in itself, part of something greater.'),
  body:     z.string().default(''),
  pillars:  z.array(PillarSchema).min(1).max(3),
});

export type OlonWhyData = z.infer<typeof OlonWhySchema>;
