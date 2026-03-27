import type { AddSectionConfig } from '@olonjs/core';

const addableSectionTypes = [
  'hero', 'feature-grid', 'problem-statement',
  'cta-banner', 'git-section', 'devex', 'tiptap',
] as const;

const sectionTypeLabels: Record<string, string> = {
  'hero':              'Hero',
  'feature-grid':      'Feature Grid',
  'problem-statement': 'Problem Statement',
  'cta-banner':        'CTA Banner',
  'git-section':       'Git Versioning',
  'devex':             'Developer Experience',
  'tiptap':            'Tiptap Editorial',
};

function getDefaultSectionData(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':              return { title: 'New Hero', description: '' };
    case 'feature-grid':      return { sectionTitle: 'Features', cards: [] };
    case 'problem-statement': return { problemTag: 'Problem', problemTitle: '', problemItems: [], solutionTag: 'Solution', solutionTitle: '', solutionItems: [] };
    case 'cta-banner':        return { title: 'Call to Action', description: '', cliCommand: '' };
    case 'git-section':       return { title: 'Your content is code.', cards: [] };
    case 'devex':             return { title: 'Developer Experience', description: '', features: [] };
    case 'tiptap':            return { content: '# Post title\n\nStart writing in Markdown...' };
    default:                  return {};
  }
}

export const addSectionConfig: AddSectionConfig = {
  addableSectionTypes: [...addableSectionTypes],
  sectionTypeLabels,
  getDefaultSectionData,
};
