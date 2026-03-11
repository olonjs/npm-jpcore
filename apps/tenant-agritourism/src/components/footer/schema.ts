import { z } from 'zod';
import { BaseSectionData, BaseArrayItem, ImageSelectionSchema } from '@/lib/base-schemas';

const FooterLinkSchema = BaseArrayItem.extend({
  label: z.string().describe('ui:text'),
  href:  z.string().describe('ui:text'),
});

export const FooterSchema = BaseSectionData.extend({
  brandText:      z.string().describe('ui:text'),
  brandHighlight: z.string().optional().describe('ui:text'),
  logoImageUrl:   ImageSelectionSchema.optional(),
  showLogoText:   z.boolean().optional().default(true).describe('ui:checkbox'),
  logoMaxHeight:  z.number().int().min(10).max(30).default(30).describe('ui:number'),
  tagline:        z.string().optional().describe('ui:textarea'),
  copyright:      z.string().optional().describe('ui:text'),
  vatLabel:       z.string().optional().describe('ui:text'),
  links:          z.array(FooterLinkSchema).optional().describe('ui:list'),
});
