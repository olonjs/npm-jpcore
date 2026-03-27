import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

export const ContactTierSchema = BaseArrayItem.extend({
  label: z.string().describe('ui:text'),
  desc:  z.string().describe('ui:text'),
  sub:   z.string().optional().describe('ui:text'),
});

export const ContactSchema = BaseSectionData.extend({
  label:          z.string().optional().describe('ui:text'),
  title:          z.string().describe('ui:text'),
  titleHighlight: z.string().optional().describe('ui:text'),
  description:    z.string().optional().describe('ui:textarea'),
  tiers:          z.array(ContactTierSchema).optional().describe('ui:list'),
  formTitle:      z.string().optional().describe('ui:text'),
  successTitle:   z.string().optional().describe('ui:text'),
  successBody:    z.string().optional().describe('ui:text'),
  disclaimer:     z.string().optional().describe('ui:text'),
});

export const ContactSettingsSchema = z.object({
  showTiers: z.boolean().default(true).describe('ui:checkbox'),
});
