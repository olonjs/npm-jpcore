import { z } from 'zod';
import { BaseSectionData, BaseArrayItem, ImageSelectionSchema } from '@/lib/base-schemas';

const ProductSchema = BaseArrayItem.extend({
  title: z.string().describe('ui:text'),
  body: z.string().describe('ui:textarea'),
});

export const CuisineSectionSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
  image: ImageSelectionSchema.optional().default({ url: '', alt: '' }),
  products: z.array(ProductSchema).describe('ui:list'),
});

