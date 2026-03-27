import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const ProblemItemSchema = BaseArrayItem.extend({
  text: z.string().describe('ui:text'),
  code: z.string().optional().describe('ui:text'),
});

export const ProblemStatementSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  problemTag: z.string().describe('ui:text'),
  problemTitle: z.string().describe('ui:text'),
  problemItems: z.array(ProblemItemSchema).describe('ui:list'),
  solutionTag: z.string().describe('ui:text'),
  solutionTitle: z.string().describe('ui:text'),
  solutionItems: z.array(ProblemItemSchema).describe('ui:list'),
});
