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

import { OlonHeroSchema }         from '@/components/olon-hero';
import { OlonWhySchema }          from '@/components/olon-why';
import { OlonArchitectureSchema } from '@/components/olon-architecture';
import { OlonExampleSchema }      from '@/components/olon-example';
import { OlonGetStartedSchema }   from '@/components/olon-getstarted';

export const SECTION_SCHEMAS = {
  'header':            HeaderSchema,
  'footer':            FooterSchema,
  'olon-hero':         OlonHeroSchema,
  'olon-why':          OlonWhySchema,
  'olon-architecture': OlonArchitectureSchema,
  'olon-example':      OlonExampleSchema,
  'olon-getstarted':   OlonGetStartedSchema,
  'hero':              HeroSchema,
  'feature-grid':      FeatureGridSchema,
  'problem-statement': ProblemStatementSchema,
  'cta-banner':        CtaBannerSchema,
  'git-section':       GitSectionSchema,
  'devex':             DevexSchema,
  'tiptap':            TiptapSchema,
} as const;

export type SectionType = keyof typeof SECTION_SCHEMAS;
