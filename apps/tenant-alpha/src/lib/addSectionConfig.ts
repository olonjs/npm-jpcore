import type { AddSectionConfig } from '@olonjs/core';

const addableSectionTypes = ['empty-tenant'] as const;

const sectionTypeLabels: Record<string, string> = {
  'empty-tenant': 'Empty Tenant',
};

function getDefaultSectionData(type: string): Record<string, unknown> {
  switch (type) {
    case 'empty-tenant':
      return {
        title: 'Your tenant is empty.',
        description: 'Create your first page to start building your site.',
        ctaLabel: 'Open Studio',
      };
    default:                  return {};
  }
}

export const addSectionConfig: AddSectionConfig = {
  addableSectionTypes: [...addableSectionTypes],
  sectionTypeLabels,
  getDefaultSectionData,
};
