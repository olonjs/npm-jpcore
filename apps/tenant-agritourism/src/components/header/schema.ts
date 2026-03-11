import { z } from 'zod';
import { BaseSectionData, BaseArrayItem, ImageSelectionSchema } from '@/lib/base-schemas';

const HeaderLinkSchema = BaseArrayItem.extend({
  label: z.string().describe('ui:text'),
  href:  z.string().describe('ui:text'),
});

export const HeaderSchema = BaseSectionData.extend({
  logoText:       z.string().describe('ui:text'),
  logoHighlight:  z.string().optional().describe('ui:text'),
  logoImageUrl:   ImageSelectionSchema.optional(),
  logoImageScrolled: ImageSelectionSchema.optional(),
  logoMaxHeight:  z.number().int().min(10).max(30).default(30).describe('ui:number'),
  showLogoText:   z.boolean().optional().default(true).describe('ui:checkbox'),
  ctaLabel:       z.string().optional().describe('ui:text'),
  ctaHref:        z.string().optional().describe('ui:text'),
  showLangToggle: z.boolean().optional().default(false).describe('ui:checkbox'),
  links:          z.array(HeaderLinkSchema).optional().describe('ui:list'),
});
