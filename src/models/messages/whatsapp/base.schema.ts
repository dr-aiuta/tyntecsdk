import {z} from 'zod';

export const whatsAppBaseFields = z.object({
	senderName: z.string().optional(),
	urlPreviewDisplayed: z.boolean().optional(),
});

export const mediaContentSchema = z.object({
	url: z.string().url(),
	caption: z.string().optional(),
	type: z.string().optional(),
	privateUrl: z.string().url().optional(),
	idFile: z.string().optional(),
});

export const locationContentSchema = z.object({
	longitude: z.number(),
	latitude: z.number(),
	name: z.string(),
	address: z.string(),
});

export const contactAddressSchema = z.object({
	city: z.string(),
	country: z.string(),
	countryCode: z.string(),
	street: z.string(),
	type: z.string(),
	zip: z.string(),
});

export const contactNameSchema = z.object({
	formattedName: z.string(),
	lastName: z.string().optional(),
});

export const contactSchema = z.object({
	addresses: z.array(contactAddressSchema),
	name: contactNameSchema,
});

export const reactionContentSchema = z.object({
	messageId: z.string(),
	emoji: z.string(),
});
