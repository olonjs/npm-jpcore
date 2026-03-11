import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const ContactFormSchema = BaseSectionData.extend({
  label:        z.string().optional().describe('ui:text'),
  title:        z.string().describe('ui:text'),
  description:  z.string().optional().describe('ui:textarea'),
  addressLine1: z.string().optional().describe('ui:text'),
  addressLine2: z.string().optional().describe('ui:text'),
  phone:        z.string().optional().describe('ui:text'),
  email:        z.string().optional().describe('ui:text'),
  actionUrl:    z.string().optional().describe('ui:text'),
  submitLabel:  z.string().optional().describe('ui:text'),
});
