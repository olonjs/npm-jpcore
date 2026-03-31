import type { SectionType } from '@/types';
import type { SectionComponentPropsMap } from '@/types';
import { Header }           from '@/components/header';
import { Footer }           from '@/components/footer';
import { Hero }             from '@/components/hero';
import { FeatureGrid }      from '@/components/feature-grid';
import { Contact }          from '@/components/contact';
import { Login }            from '@/components/login';
import { DesignSystemView }       from '@/components/design-system';
import { CloudAiNativeGridView } from '@/components/cloud-ai-native-grid';
import { PageHero }             from '@/components/page-hero';
import { Tiptap }           from '@/components/tiptap';


import { View as OlonHeroView }         from '@/components/olon-hero';
import { View as OlonWhyView }          from '@/components/olon-why';
import { View as OlonArchitectureView } from '@/components/olon-architecture';
import { View as OlonExampleView }      from '@/components/olon-example';
import { View as OlonGetStartedView }   from '@/components/olon-getstarted';

export const ComponentRegistry: {
  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;
} = {
  'header':                Header               as React.FC<SectionComponentPropsMap['header']>,
  'footer':                Footer               as React.FC<SectionComponentPropsMap['footer']>,
  'hero':                  Hero                 as React.FC<SectionComponentPropsMap['hero']>,
  'feature-grid':          FeatureGrid          as React.FC<SectionComponentPropsMap['feature-grid']>,
  'contact':               Contact              as React.FC<SectionComponentPropsMap['contact']>,
  'login':                 Login                as React.FC<SectionComponentPropsMap['login']>,
  'design-system':         DesignSystemView     as React.FC<SectionComponentPropsMap['design-system']>,
  'cloud-ai-native-grid':  CloudAiNativeGridView as React.FC<SectionComponentPropsMap['cloud-ai-native-grid']>,
  'page-hero':             PageHero             as React.FC<SectionComponentPropsMap['page-hero']>,
  'tiptap':                Tiptap               as React.FC<SectionComponentPropsMap['tiptap']>,


  'olon-hero':         OlonHeroView,
  'olon-why':          OlonWhyView,
  'olon-architecture': OlonArchitectureView,
  'olon-example':      OlonExampleView,
  'olon-getstarted':   OlonGetStartedView,
};
