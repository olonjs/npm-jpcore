import { z } from 'zod';
import { BaseSectionData, CtaSchema, ImageSelectionSchema } from '@/lib/base-schemas';

export const OlonHeroSchema = BaseSectionData.extend({
  eyebrow:    z.string().default('CONTRACT LAYER · V1.5 · OPEN CORE'),
  headline:   z.string().default('Contract Layer'),
  subline:    z.string().default('for the agentic web.'),
  body:       z.string().default(''),
  primaryCta: CtaSchema.optional(),
  secondaryCta: CtaSchema.optional(),
  ghostCta: CtaSchema.optional(),
  image: ImageSelectionSchema.default({
    url: '/assets/images/plug-graded-square.jpg',
    alt: 'Olon interface port engraved into a dark stone surface'
  }),
});

export type OlonHeroData = z.infer<typeof OlonHeroSchema>;
