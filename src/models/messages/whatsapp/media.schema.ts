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
export const mediaMessageSchema = z.union([
	whatsAppBaseFields.extend({
		contentType: z.literal('image'),
		image: mediaContentSchema.optional(),
		// TODO: use separate schema for messageRequest since files could be loaded separately
	}),
	whatsAppBaseFields.extend({
		contentType: z.literal('video'),
		video: mediaContentSchema.optional(),
		// TODO: use separate schema for messageRequest since files could be loaded separately
	}),
	whatsAppBaseFields.extend({
		contentType: z.literal('document'),
		document: documentContentSchema.optional(),
		// TODO: use separate schema for messageRequest since files could be loaded separately
	}),
	whatsAppBaseFields.extend({
		contentType: z.literal('audio'),
		audio: mediaContentSchema.optional(),
		// TODO: use separate schema for messageRequest since files could be loaded separately
	}),
	whatsAppBaseFields.extend({
		contentType: z.literal('sticker'),
		sticker: mediaContentSchema.optional(),
		// TODO: use separate schema for messageRequest since files could be loaded separately
	}),
]);

export const textMessageSchema = whatsAppBaseFields.extend({
	contentType: z.literal('text'),
	text: z.string(),
});

export const locationMessageSchema = whatsAppBaseFields.extend({
	contentType: z.literal('location'),
	location: locationContentSchema,
});

export const contactsMessageSchema = whatsAppBaseFields.extend({
	contentType: z.literal('contacts'),
	contacts: z.array(contactSchema),
});

export const reactionMessageSchema = whatsAppBaseFields.extend({
	contentType: z.literal('reaction'),
	reaction: reactionContentSchema,
});
