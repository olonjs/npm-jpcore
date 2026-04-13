import { z } from 'zod';

export const FooterSchema = z.object({
  brandText:        z.string().describe('ui:text'),
  copyright:        z.string().describe('ui:text'),
  links: z.array(z.object({
    label: z.string().describe('ui:text'),
    href:  z.string().describe('ui:text'),
  })).optional().describe('ui:list'),
  designSystemHref: z.string().optional().describe('ui:text'),
});

export const FooterSettingsSchema = z.object({
  showLogo: z.boolean().default(true).describe('ui:checkbox'),
});
