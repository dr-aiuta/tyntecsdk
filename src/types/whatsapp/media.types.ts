import {z} from 'zod';
import {
	mediaMessageSchema,
	textMessageSchema,
	locationMessageSchema,
	contactsMessageSchema,
	reactionMessageSchema,
} from '@/models/messages/whatsapp';

// Infer types from Zod schemas
export type MediaMessage = z.infer<typeof mediaMessageSchema>;
export type TextMessage = z.infer<typeof textMessageSchema>;
export type LocationMessage = z.infer<typeof locationMessageSchema>;
export type ContactsMessage = z.infer<typeof contactsMessageSchema>;
export type ReactionMessage = z.infer<typeof reactionMessageSchema>;
