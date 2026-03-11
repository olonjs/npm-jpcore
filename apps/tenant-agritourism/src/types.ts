import type {
  MenuItem,
  PageConfig as CorePageConfig,
  SiteConfig as CoreSiteConfig,
  ThemeConfig as CoreThemeConfig,
  MenuConfig as CoreMenuConfig,
} from '@jsonpages/core';

import type { HeaderData,           HeaderSettings }           from '@/components/header';
import type { FooterData,           FooterSettings }           from '@/components/footer';
import type { HeroData,             HeroSettings }             from '@/components/hero';
import type { AboutStripData,       AboutStripSettings }       from '@/components/about-strip';
import type { ServiceCardsData,     ServiceCardsSettings }     from '@/components/service-cards';
import type { TestimonialsData,     TestimonialsSettings }     from '@/components/testimonials';
import type { CtaNatureData,        CtaNatureSettings }        from '@/components/cta-nature';
import type { ContactFormData,      ContactFormSettings }      from '@/components/contact-form';
import type { PricingTableData,     PricingTableSettings }     from '@/components/pricing-table';
import type { ActivitiesGridData,   ActivitiesGridSettings }   from '@/components/activities-grid';
import type { KitchenShowcaseData,  KitchenShowcaseSettings }  from '@/components/kitchen-showcase';
import type { GalleryStripData,     GalleryStripSettings }     from '@/components/gallery-strip';

// ── SectionComponentPropsMap ──────────────────────────────────────────────── 
export type SectionComponentPropsMap = {
  'header':            { data: HeaderData;          settings?: HeaderSettings;          menu: MenuItem[] };
  'footer':            { data: FooterData;           settings?: FooterSettings                           };
  'hero':              { data: HeroData;             settings?: HeroSettings                             };
  'about-strip':       { data: AboutStripData;       settings?: AboutStripSettings                       };
  'service-cards':     { data: ServiceCardsData;     settings?: ServiceCardsSettings                     };
  'testimonials':      { data: TestimonialsData;     settings?: TestimonialsSettings                     };
  'cta-nature':        { data: CtaNatureData;        settings?: CtaNatureSettings                        };
  'contact-form':      { data: ContactFormData;      settings?: ContactFormSettings                      };
  'pricing-table':     { data: PricingTableData;     settings?: PricingTableSettings                     };
  'activities-grid':   { data: ActivitiesGridData;   settings?: ActivitiesGridSettings                   };
  'kitchen-showcase':  { data: KitchenShowcaseData;  settings?: KitchenShowcaseSettings                  };
  'gallery-strip':     { data: GalleryStripData;     settings?: GalleryStripSettings                     };
};

// ── Module Augmentation (MTRP §1.1) ──────────────────────────────────────── 
declare module '@jsonpages/core' {
  export interface SectionDataRegistry {
    'header':           HeaderData;
    'footer':           FooterData;
    'hero':             HeroData;
    'about-strip':      AboutStripData;
    'service-cards':    ServiceCardsData;
    'testimonials':     TestimonialsData;
    'cta-nature':       CtaNatureData;
    'contact-form':     ContactFormData;
    'pricing-table':    PricingTableData;
    'activities-grid':  ActivitiesGridData;
    'kitchen-showcase': KitchenShowcaseData;
    'gallery-strip':    GalleryStripData;
  }
  export interface SectionSettingsRegistry {
    'header':           HeaderSettings;
    'footer':           FooterSettings;
    'hero':             HeroSettings;
    'about-strip':      AboutStripSettings;
    'service-cards':    ServiceCardsSettings;
    'testimonials':     TestimonialsSettings;
    'cta-nature':       CtaNatureSettings;
    'contact-form':     ContactFormSettings;
    'pricing-table':    PricingTableSettings;
    'activities-grid':  ActivitiesGridSettings;
    'kitchen-showcase': KitchenShowcaseSettings;
    'gallery-strip':    GalleryStripSettings;
  }
}

// Re-export everything from core (Section, MenuItem, etc.)
export * from '@jsonpages/core';

// ── Convenience aliases ─────────────────────────────────────────────────────
export type PageConfig = CorePageConfig;
export type SiteConfig = CoreSiteConfig;
export type MenuConfig = CoreMenuConfig;
export type ThemeConfig = CoreThemeConfig;
