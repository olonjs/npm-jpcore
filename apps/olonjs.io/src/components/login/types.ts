import { z } from 'zod';
import { LoginSchema, LoginSettingsSchema } from './schema';

export type LoginData     = z.infer<typeof LoginSchema>;
export type LoginSettings = z.infer<typeof LoginSettingsSchema>;
