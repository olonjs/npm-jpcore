import { z } from 'zod';
import { ContactSchema, ContactSettingsSchema } from './schema';

export type ContactData     = z.infer<typeof ContactSchema>;
export type ContactSettings = z.infer<typeof ContactSettingsSchema>;
