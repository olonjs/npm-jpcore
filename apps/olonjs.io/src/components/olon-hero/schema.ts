import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const OlonHeroSchema = BaseSectionData.extend({
  eyebrow:    z.string().default('CONTRACT LAYER · V1.5 · OPEN CORE'),
  headline:   z.string().default('Contract Layer'),
  subline:    z.string().default('for the agentic web.'),
  body:       z.string().default(''),
  cta: z.object({
    primary:   z.object({ label: z.string(), href: z.string() }),
    secondary: z.object({ label: z.string(), href: z.string() }),
    ghost:     z.object({ label: z.string(), href: z.string() }),
  }),
});

export type OlonHeroData = z.infer<typeof OlonHeroSchema>;
