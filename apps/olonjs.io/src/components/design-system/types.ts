import { z } from 'zod';
import { DesignSystemSchema, DesignSystemSettingsSchema } from './schema';

export type DesignSystemData     = z.infer<typeof DesignSystemSchema>;
export type DesignSystemSettings = z.infer<typeof DesignSystemSettingsSchema>;
