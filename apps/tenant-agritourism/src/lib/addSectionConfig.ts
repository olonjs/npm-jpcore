import type { AddSectionConfig } from '@jsonpages/core';

const addableSectionTypes = [
  'hero', 'about-strip', 'service-cards', 'testimonials',
  'cta-nature', 'contact-form', 'pricing-table',
  'activities-grid', 'kitchen-showcase', 'gallery-strip',
] as const;

const sectionTypeLabels: Record<string, string> = {
  'hero':             'Hero (Banner)',
  'about-strip':      'Chi siamo / Storia',
  'service-cards':    'Servizi / Cards',
  'testimonials':     'Recensioni',
  'cta-nature':       'CTA con sfondo natura',
  'contact-form':     'Modulo di prenotazione',
  'pricing-table':    'Prezzi e tariffe',
  'activities-grid':  'Attività e dintorni',
  'kitchen-showcase': 'La Cucina km.0',
  'gallery-strip':    'Galleria fotografica',
};

function getDefaultSectionData(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return { title: 'Titolo Principale', titleHighlight: '', description: '', badge: '', ctas: [] };
    case 'about-strip':
      return { title: 'La nostra storia', description: '', bullets: [], imagePosition: 'right' };
    case 'service-cards':
      return { title: 'I nostri servizi', cards: [] };
    case 'testimonials':
      return { title: 'Cosa dicono i nostri ospiti', items: [] };
    case 'cta-nature':
      return { title: 'Vieni a trovarci', ctaLabel: 'Prenota ora', ctaHref: '/contatti' };
    case 'contact-form':
      return { title: 'Richiedi disponibilità', submitLabel: 'Invia richiesta' };
    case 'pricing-table':
      return { title: 'Prezzi e tariffe', plans: [] };
    case 'activities-grid':
      return { title: 'Cose da fare', items: [] };
    case 'kitchen-showcase':
      return { title: 'La nostra cucina', features: [] };
    case 'gallery-strip':
      return { title: 'Fotografie', images: [] };
    default:
      return {};
  }
}

export const addSectionConfig: AddSectionConfig = {
  addableSectionTypes: [...addableSectionTypes],
  sectionTypeLabels,
  getDefaultSectionData,
};
