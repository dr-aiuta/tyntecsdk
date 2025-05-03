import {z} from 'zod';
import {whatsAppBaseFields, mediaContentSchema, locationContentSchema} from './base.schema';

const documentContentSchema = z.object({
	url: z.string().url(),
	caption: z.string().optional(),
	filename: z.string().optional(),
});

export const templateComponentSchema = z.object({
	type: z.literal('text'),
	text: z.string(),
});

// Template button schema with discriminated union
export const templateButtonSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('quick_reply'),
		index: z.number(),
		payload: z.string(),
	}),
	z.object({
		type: z.literal('url'),
		index: z.number(),
		text: z.string(),
	}),
]);

// Template header schema with discriminated union
export const templateHeaderSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('text'),
		text: z.string(),
	}),
	z.object({
		type: z.literal('image'),
		image: mediaContentSchema,
	}),
	z.object({
		type: z.literal('video'),
		video: mediaContentSchema,
	}),
	z.object({
		type: z.literal('document'),
		document: documentContentSchema,
	}),
	z.object({
		type: z.literal('location'),
		location: locationContentSchema,
	}),
]);

export const templateComponentsSchema = z.object({
	header: z.array(templateHeaderSchema).optional(),
	body: z.array(templateComponentSchema).optional(),
	button: z.array(templateButtonSchema).optional(),
});

export const templateMessageSchema = whatsAppBaseFields.extend({
	contentType: z.literal('template'),
	template: z.object({
		templateId: z.string(),
		templateLanguage: z.string(),
		components: templateComponentsSchema,
	}),
});
