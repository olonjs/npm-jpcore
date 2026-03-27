import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const LoginSchema = BaseSectionData.extend({
  title:       z.string().describe('ui:text'),
  subtitle:    z.string().optional().describe('ui:text'),
  forgotHref:  z.string().optional().describe('ui:text'),
  signupHref:  z.string().optional().describe('ui:text'),
  termsHref:   z.string().optional().describe('ui:text'),
  privacyHref: z.string().optional().describe('ui:text'),
});

export const LoginSettingsSchema = z.object({
  showOauth: z.boolean().default(true).describe('ui:checkbox'),
});
