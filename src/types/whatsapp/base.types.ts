import {z} from 'zod';
import {
	mediaContentSchema,
	locationContentSchema,
	contactAddressSchema,
	contactNameSchema,
	contactSchema,
	reactionContentSchema,
} from '@/models/messages/whatsapp';

// Infer types from Zod schemas
export type MediaContent = z.infer<typeof mediaContentSchema>;
export type LocationContent = z.infer<typeof locationContentSchema>;
export type ContactAddress = z.infer<typeof contactAddressSchema>;
export type ContactName = z.infer<typeof contactNameSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type ReactionContent = z.infer<typeof reactionContentSchema>;
