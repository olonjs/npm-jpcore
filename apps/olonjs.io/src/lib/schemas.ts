export { BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema, CtaSchema } from './base-schemas';

import { HeaderSchema }           from '@/components/header';
import { FooterSchema }           from '@/components/footer';
import { HeroSchema }             from '@/components/hero';
import { FeatureGridSchema }      from '@/components/feature-grid';
import { ProblemStatementSchema } from '@/components/problem-statement';
import { CtaBannerSchema }        from '@/components/cta-banner';
import { GitSectionSchema }       from '@/components/git-section';
import { DevexSchema }            from '@/components/devex';
import { TiptapSchema }           from '@/components/tiptap';

export const SECTION_SCHEMAS = {
  'header':            HeaderSchema,
  'footer':            FooterSchema,
  'hero':              HeroSchema,
  'feature-grid':      FeatureGridSchema,
  'problem-statement': ProblemStatementSchema,
  'cta-banner':        CtaBannerSchema,
  'git-section':       GitSectionSchema,
  'devex':             DevexSchema,
  'tiptap':            TiptapSchema,
} as const;

export type SectionType = keyof typeof SECTION_SCHEMAS;
