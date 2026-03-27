import { z } from 'zod';

/**
 * 📝 HEADER SCHEMA (Contract)
 * Definisce la struttura dati che l'Admin userà per generare la form.
 */
export const HeaderSchema = z.object({
  logoText: z.string().describe('ui:text'),
  logoHighlight: z.string().optional().describe('ui:text'),
  logoIconText: z.string().optional().describe('ui:text'),
  badge: z.string().optional().describe('ui:text'),
  links: z.array(z.object({
    label: z.string().describe('ui:text'),
    href: z.string().describe('ui:text'),
    isCta: z.boolean().default(false).describe('ui:checkbox'),
    external: z.boolean().default(false).optional().describe('ui:checkbox'),
  })).describe('ui:list'),
});

/**
 * ⚙️ HEADER SETTINGS
 * Definisce i parametri tecnici (non di contenuto).
 */
export const HeaderSettingsSchema = z.object({
  sticky: z.boolean().default(true).describe('ui:checkbox'),
});