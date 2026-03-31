import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

export const ProtocolSchema = BaseArrayItem.extend({
  version:  z.string(),
  acronym:  z.string(),
  name:     z.string(),
  desc:     z.string(),
  specHref: z.string(),
  icon:     z.enum(['mtrp', 'tbp', 'jsp', 'idac', 'bsds', 'pss']),
});

export const OlonArchitectureSchema = BaseSectionData.extend({
  label:     z.string().default('Architecture'),
  headline:  z.string().default('Six governing protocols.'),
  body:      z.string().default(''),
  specHref:  z.string().default(''),
  protocols: z.array(ProtocolSchema).min(1).max(6),
});

export type OlonArchitectureData = z.infer<typeof OlonArchitectureSchema>;
