import React from 'react';
import { Header }           from '@/components/header';
import { Footer }           from '@/components/footer';
import { Hero }             from '@/components/hero';
import { FeatureGrid }      from '@/components/feature-grid';
import { ProblemStatement } from '@/components/problem-statement';
import { CtaBanner }        from '@/components/cta-banner';
import { GitSection }       from '@/components/git-section';
import { Devex }            from '@/components/devex';
import { Tiptap }           from '@/components/tiptap';

import type { SectionType }              from '@olonjs/core';
import type { SectionComponentPropsMap } from '@/types';

export const ComponentRegistry: {
  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;
} = {
  'header':            Header,
  'footer':            Footer,
  'hero':              Hero,
  'feature-grid':      FeatureGrid,
  'problem-statement': ProblemStatement,
  'cta-banner':        CtaBanner,
  'git-section':       GitSection,
  'devex':             Devex,
  'tiptap':            Tiptap,
};
