import {z} from 'zod';
import {
	whatsAppBaseFields,
	mediaContentSchema,
	locationContentSchema,
	contactSchema,
	reactionContentSchema,
} from './base.schema';

const documentContentSchema = z.object({
	url: z.string().url(),
	caption: z.string().optional(),
	filename: z.string().optional(),
	type: z.string().optional(),
	privateUrl: z.string().url().optional(),
	idFile: z.string().optional(),
});

// Media message schemas using discriminated unions
export const mediaMessageSchema = whatsAppBaseFields.extend({
	content: z
		.object({
			contentType: z.enum(['image', 'video', 'document', 'audio', 'sticker']),
		})
		.and(
			z.discriminatedUnion('contentType', [
				z.object({
					contentType: z.literal('image'),
					image: mediaContentSchema,
				}),
				z.object({
					contentType: z.literal('video'),
					video: mediaContentSchema,
				}),
				z.object({
					contentType: z.literal('document'),
					document: documentContentSchema,
				}),
				z.object({
					contentType: z.literal('audio'),
					audio: mediaContentSchema,
				}),
				z.object({
					contentType: z.literal('sticker'),
					sticker: mediaContentSchema,
				}),
			])
		),
});

export const textMessageSchema = whatsAppBaseFields.extend({
	content: z.object({
		contentType: z.literal('text'),
		text: z.string(),
	}),
});

export const locationMessageSchema = whatsAppBaseFields.extend({
	content: z.object({
		contentType: z.literal('location'),
		location: locationContentSchema,
	}),
});

export const contactsMessageSchema = whatsAppBaseFields.extend({
	content: z.object({
		contentType: z.literal('contacts'),
		contacts: z.array(contactSchema),
	}),
});

export const reactionMessageSchema = whatsAppBaseFields.extend({
	content: z.object({
		contentType: z.literal('reaction'),
		reaction: reactionContentSchema,
	}),
});
