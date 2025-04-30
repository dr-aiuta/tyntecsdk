import {z} from 'zod';
import {
	templateComponentSchema,
	templateButtonSchema,
	templateHeaderSchema,
	templateComponentsSchema,
	templateMessageSchema,
} from '@/models/messages/whatsapp';

// Infer types from Zod schemas
export type TemplateComponent = z.infer<typeof templateComponentSchema>;
export type TemplateButton = z.infer<typeof templateButtonSchema>;
export type TemplateHeader = z.infer<typeof templateHeaderSchema>;
export type TemplateComponents = z.infer<typeof templateComponentsSchema>;
export type TemplateMessage = z.infer<typeof templateMessageSchema>;
