export * from './base.schema';
export * from './interactive.schema';
export * from './template.schema';
export * from './media.schema';

// Combined schema for all WhatsApp message types
import {z} from 'zod';
import {mediaMessageSchema} from './media.schema';
import {textMessageSchema} from './media.schema';
import {locationMessageSchema} from './media.schema';
import {contactsMessageSchema} from './media.schema';
import {reactionMessageSchema} from './media.schema';
import {templateMessageSchema} from './template.schema';
import {interactiveMessageSchema} from './interactive.schema';

// Using Zod's union to combine all message schemas
export const whatsAppMessageSchema = z.union([
	mediaMessageSchema,
	textMessageSchema,
	locationMessageSchema,
	contactsMessageSchema,
	reactionMessageSchema,
	templateMessageSchema,
	interactiveMessageSchema,
]);

// Type inference for the combined schema
export type WhatsAppMessageSchema = z.infer<typeof whatsAppMessageSchema>;
