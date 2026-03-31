import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

export const StartCardSchema = BaseArrayItem.extend({
  badge:      z.string(),
  badgeStyle: z.enum(['oss', 'cli', 'deploy']),
  title:      z.string(),
  body:       z.string(),
  code:       z.string().optional(),
  linkLabel:  z.string(),
  linkHref:   z.string(),
  deployLabel:z.string().optional(),
  deployHref: z.string().optional(),
});

export const OlonGetStartedSchema = BaseSectionData.extend({
  label:    z.string().default('Get Started'),
  headline: z.string().default('Three paths in.'),
  body:     z.string().default(''),
  cards:    z.array(StartCardSchema).min(1).max(3),
});

export type OlonGetStartedData = z.infer<typeof OlonGetStartedSchema>;
