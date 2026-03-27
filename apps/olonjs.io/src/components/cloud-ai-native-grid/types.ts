import { z } from 'zod';
import { CloudAiNativeGridSchema, CloudAiNativeGridSettingsSchema } from './schema';

export type CloudAiNativeGridData     = z.infer<typeof CloudAiNativeGridSchema>;
export type CloudAiNativeGridSettings = z.infer<typeof CloudAiNativeGridSettingsSchema>;
