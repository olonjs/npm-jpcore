import React from 'react';

import { Header }           from '@/components/header';
import { Footer }           from '@/components/footer';
import { Hero }             from '@/components/hero';
import { AboutStrip }       from '@/components/about-strip';
import { ServiceCards }     from '@/components/service-cards';
import { Testimonials }     from '@/components/testimonials';
import { CtaNature }        from '@/components/cta-nature';
import { ContactForm }      from '@/components/contact-form';
import { PricingTable }     from '@/components/pricing-table';
import { ActivitiesGrid }   from '@/components/activities-grid';
import { KitchenShowcase }  from '@/components/kitchen-showcase';
import { GalleryStrip }     from '@/components/gallery-strip';

import type { SectionType }              from '@jsonpages/core';
import type { SectionComponentPropsMap } from '@/types';

export const ComponentRegistry: {
  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;
} = {
  'header':           Header,
  'footer':           Footer,
  'hero':             Hero,
  'about-strip':      AboutStrip,
  'service-cards':    ServiceCards,
  'testimonials':     Testimonials,
  'cta-nature':       CtaNature,
  'contact-form':     ContactForm,
  'pricing-table':    PricingTable,
  'activities-grid':  ActivitiesGrid,
  'kitchen-showcase': KitchenShowcase,
  'gallery-strip':    GalleryStrip,
};
