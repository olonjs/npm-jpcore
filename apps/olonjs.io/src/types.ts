import type { MenuItem } from '@olonjs/core';
import type { HeaderData,           HeaderSettings }           from '@/components/header';
import type { FooterData,           FooterSettings }           from '@/components/footer';
import type { HeroData,             HeroSettings }             from '@/components/hero';
import type { FeatureGridData,      FeatureGridSettings }      from '@/components/feature-grid';
import type { ProblemStatementData, ProblemStatementSettings } from '@/components/problem-statement';
import type { CtaBannerData,        CtaBannerSettings }        from '@/components/cta-banner';
import type { GitSectionData,       GitSectionSettings }       from '@/components/git-section';
import type { DevexData,            DevexSettings }            from '@/components/devex';
import type { TiptapData,           TiptapSettings }           from '@/components/tiptap';


import type { OlonHeroData }         from '@/components/olon-hero';
import type { OlonWhyData }          from '@/components/olon-why';
import type { OlonArchitectureData } from '@/components/olon-architecture';
import type { OlonExampleData }      from '@/components/olon-example';
import type { OlonGetStartedData }   from '@/components/olon-getstarted';

export type SectionComponentPropsMap = {
  'header':            { data: HeaderData;           settings?: HeaderSettings;           menu: MenuItem[] };
  'footer':            { data: FooterData;            settings?: FooterSettings            };
  'hero':              { data: HeroData;              settings?: HeroSettings              };
  'feature-grid':      { data: FeatureGridData;       settings?: FeatureGridSettings       };
  'problem-statement': { data: ProblemStatementData;  settings?: ProblemStatementSettings  };
  'cta-banner':        { data: CtaBannerData;         settings?: CtaBannerSettings         };
  'git-section':       { data: GitSectionData;        settings?: GitSectionSettings        };
  'devex':             { data: DevexData;             settings?: DevexSettings             };
  'tiptap':            { data: TiptapData;            settings?: TiptapSettings            };
  
  'olon-hero':         { data: OlonHeroData };
  'olon-why':          { data: OlonWhyData };
  'olon-architecture': { data: OlonArchitectureData };
  'olon-example':      { data: OlonExampleData };
  'olon-getstarted':   { data: OlonGetStartedData };
};

declare module '@olonjs/core' {
  export interface SectionDataRegistry {
    'header':            HeaderData;
    'footer':            FooterData;
    'hero':              HeroData;
    'feature-grid':      FeatureGridData;
    'problem-statement': ProblemStatementData;
    'cta-banner':        CtaBannerData;
    'git-section':       GitSectionData;
    'devex':             DevexData;
    'tiptap':            TiptapData;

    'olon-hero':         OlonHeroData;
    'olon-why':          OlonWhyData;
    'olon-architecture': OlonArchitectureData;
    'olon-example':      OlonExampleData;
    'olon-getstarted':   OlonGetStartedData;

    
  }
  export interface SectionSettingsRegistry {
    'header':            HeaderSettings;
    'footer':            FooterSettings;
    'hero':              HeroSettings;
    'feature-grid':      FeatureGridSettings;
    'problem-statement': ProblemStatementSettings;
    'cta-banner':        CtaBannerSettings;
    'git-section':       GitSectionSettings;
    'devex':             DevexSettings;
    'tiptap':            TiptapSettings;
  }
}

export * from '@olonjs/core';
