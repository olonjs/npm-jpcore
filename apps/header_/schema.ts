import { z } from 'zod';

export const HeaderSchema = z.object({
  logoText:         z.string().describe('ui:text'),
  badge:            z.string().optional().describe('ui:text'),
  links: z.array(z.object({
    label:    z.string().describe('ui:text'),
    href:     z.string().describe('ui:text'),
    variant:  z.string().optional().describe('ui:text'),
    children: z.array(z.object({
      label: z.string().describe('ui:text'),
      href:  z.string().describe('ui:text'),
    })).optional().describe('ui:list'),
  })).describe('ui:list'),
  ctaLabel:         z.string().optional().describe('ui:text'),
  ctaHref:          z.string().optional().describe('ui:text'),
  signinHref:       z.string().optional().describe('ui:text'),
});

export const HeaderSettingsSchema = z.object({
  sticky: z.boolean().default(true).describe('ui:checkbox'),
});
