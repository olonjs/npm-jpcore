// Re-export base schemas
export { BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema, CtaSchema, ImageSelectionSchema } from './base-schemas';

// Capsule schemas
import { HeaderSchema }          from '@/components/header';
import { FooterSchema }          from '@/components/footer';
import { HeroSchema }            from '@/components/hero';
import { AboutStripSchema }      from '@/components/about-strip';
import { ServiceCardsSchema }    from '@/components/service-cards';
import { TestimonialsSchema }    from '@/components/testimonials';
import { CtaNatureSchema }       from '@/components/cta-nature';
import { ContactFormSchema }     from '@/components/contact-form';
import { PricingTableSchema }    from '@/components/pricing-table';
import { ActivitiesGridSchema }  from '@/components/activities-grid';
import { KitchenShowcaseSchema } from '@/components/kitchen-showcase';
import { GalleryStripSchema }    from '@/components/gallery-strip';

export const SECTION_SCHEMAS = {
  'header':           HeaderSchema,
  'footer':           FooterSchema,
  'hero':             HeroSchema,
  'about-strip':      AboutStripSchema,
  'service-cards':    ServiceCardsSchema,
  'testimonials':     TestimonialsSchema,
  'cta-nature':       CtaNatureSchema,
  'contact-form':     ContactFormSchema,
  'pricing-table':    PricingTableSchema,
  'activities-grid':  ActivitiesGridSchema,
  'kitchen-showcase': KitchenShowcaseSchema,
  'gallery-strip':    GalleryStripSchema,
} as const;

export type SectionType = keyof typeof SECTION_SCHEMAS;
