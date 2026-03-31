import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

const StepSchema = z.object({
  number: z.number(),
  title:  z.string(),
  meta:   z.string(),
  code:   z.string(),
});

export const OlonExampleSchema = BaseSectionData.extend({
  label:    z.string().default('Quick Example'),
  headline: z.string().default('Two steps. One contract.'),
  body:     z.string().default(''),
  note:     z.string().default(''),
  noteHref: z.string().default(''),
  steps:    z.tuple([StepSchema, StepSchema]),
});

export type OlonExampleData = z.infer<typeof OlonExampleSchema>;
