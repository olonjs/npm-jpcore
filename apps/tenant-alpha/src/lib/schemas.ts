import { EmptyTenantSchema } from '@/components/empty-tenant';

export const SECTION_SCHEMAS = {
  'empty-tenant': EmptyTenantSchema,
} as const;

export type SectionType = keyof typeof SECTION_SCHEMAS;

export {
  BaseSectionData,
  BaseArrayItem,
  BaseSectionSettingsSchema,
  CtaSchema,
  ImageSelectionSchema,
} from '@/lib/base-schemas';
