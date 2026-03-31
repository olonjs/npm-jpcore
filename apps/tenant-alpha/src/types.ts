import type { MenuItem } from '@olonjs/core';
import type { HeaderData,        HeaderSettings        } from '@/components/header';
import type { FooterData,        FooterSettings        } from '@/components/footer';
import type { HeroData,          HeroSettings          } from '@/components/hero';
import type { FeatureGridData,   FeatureGridSettings   } from '@/components/feature-grid';
import type { ContactData,       ContactSettings       } from '@/components/contact';
import type { LoginData,         LoginSettings         } from '@/components/login';
import type { DesignSystemData,        DesignSystemSettings        } from '@/components/design-system';
import type { CloudAiNativeGridData,   CloudAiNativeGridSettings   } from '@/components/cloud-ai-native-grid';
import type { PageHeroData,            PageHeroSettings            } from '@/components/page-hero';
import type { TiptapData,              TiptapSettings              } from '@/components/tiptap';


import type { OlonHeroData }         from '@/components/olon-hero';
import type { OlonWhyData }          from '@/components/olon-why';
import type { OlonArchitectureData } from '@/components/olon-architecture';
import type { OlonExampleData }      from '@/components/olon-example';
import type { OlonGetStartedData }   from '@/components/olon-getstarted';

export type SectionComponentPropsMap = {
  'header':                { data: HeaderData;              settings?: HeaderSettings;              menu: MenuItem[] };
  'footer':                { data: FooterData;              settings?: FooterSettings               };
  'hero':                  { data: HeroData;                settings?: HeroSettings                 };
  'feature-grid':          { data: FeatureGridData;         settings?: FeatureGridSettings          };
  'contact':               { data: ContactData;             settings?: ContactSettings              };
  'login':                 { data: LoginData;               settings?: LoginSettings                };
  'design-system':         { data: DesignSystemData;        settings?: DesignSystemSettings         };
  'cloud-ai-native-grid':  { data: CloudAiNativeGridData;   settings?: CloudAiNativeGridSettings    };
  'page-hero':             { data: PageHeroData;            settings?: PageHeroSettings             };
  'tiptap':                { data: TiptapData;               settings?: TiptapSettings                };
  
  
  'olon-hero':         { data: OlonHeroData };
  'olon-why':          { data: OlonWhyData };
  'olon-architecture': { data: OlonArchitectureData };
  'olon-example':      { data: OlonExampleData };
  'olon-getstarted':   { data: OlonGetStartedData };
};

declare module '@olonjs/core' {
  export interface SectionDataRegistry {
    'header':                HeaderData;
    'footer':                FooterData;
    'hero':                  HeroData;
    'feature-grid':          FeatureGridData;
    'contact':               ContactData;
    'login':                 LoginData;
    'design-system':         DesignSystemData;
    'cloud-ai-native-grid':  CloudAiNativeGridData;
    'page-hero':             PageHeroData;
    'tiptap':                TiptapData;
	 'olon-hero':         OlonHeroData;
    'olon-why':          OlonWhyData;
    'olon-architecture': OlonArchitectureData;
    'olon-example':      OlonExampleData;
    'olon-getstarted':   OlonGetStartedData;
  }
  export interface SectionSettingsRegistry {
    'header':                HeaderSettings;
    'footer':                FooterSettings;
    'hero':                  HeroSettings;
    'feature-grid':          FeatureGridSettings;
    'contact':               ContactSettings;
    'login':                 LoginSettings;
    'design-system':         DesignSystemSettings;
    'cloud-ai-native-grid':  CloudAiNativeGridSettings;
    'page-hero':             PageHeroSettings;
    'tiptap':                TiptapSettings;
  }
}

export * from '@olonjs/core';
