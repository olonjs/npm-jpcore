import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const BreadcrumbItemSchema = BaseArrayItem.extend({
  label: z.string().describe('ui:text'),
  href:  z.string().describe('ui:text'),
});

export const PageHeroSchema = BaseSectionData.extend({
  badge:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  titleItalic: z.string().optional().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  breadcrumb:  z.array(BreadcrumbItemSchema).optional().describe('ui:list'),
});
