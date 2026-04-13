import type { EmptyTenantData, EmptyTenantSettings } from '@/components/empty-tenant';

export type SectionComponentPropsMap = {
  'empty-tenant': { data: EmptyTenantData; settings?: EmptyTenantSettings };
};

declare module '@olonjs/core' {
  export interface SectionDataRegistry {
    'empty-tenant': EmptyTenantData;
  }
  export interface SectionSettingsRegistry {
    'empty-tenant': EmptyTenantSettings;
  }
}

export * from '@olonjs/core';
