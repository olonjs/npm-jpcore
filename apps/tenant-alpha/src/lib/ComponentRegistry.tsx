import type { SectionType } from '@/types';
import type { SectionComponentPropsMap } from '@/types';
import { EmptyTenantView } from '@/components/empty-tenant';

export const ComponentRegistry: {
  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;
} = {
  'empty-tenant': EmptyTenantView as React.FC<SectionComponentPropsMap['empty-tenant']>,
};
