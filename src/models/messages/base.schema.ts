import {z} from 'zod';
import {whatsAppMessageSchema} from './whatsapp';
import {templateComponentsSchema} from './whatsapp/template.schema';
// Define supported channels
const SUPPORTED_CHANNELS = ['whatsapp', 'telegram', 'facebook'] as const;
export type SupportedChannel = (typeof SUPPORTED_CHANNELS)[number];

// Base fields that are common to all message types
export const messageBaseFields = z.object({
	to: z.string(),
	idSender: z.string().optional(),
	channel: z.enum(SUPPORTED_CHANNELS),
	sender: z.boolean().optional(),
});

// WhatsApp specific message structure
export const whatsAppMessageStructure = z.object({
	channel: z.literal(SUPPORTED_CHANNELS.find((c) => c === 'whatsapp')!),
	content: whatsAppMessageSchema,
	from: z.string(),
	senderName: z.string().optional(),
});

// Combined message schema that supports multiple channels
export const messageSchema = messageBaseFields.and(
	z.discriminatedUnion('channel', [
		whatsAppMessageStructure,
		// Add other channel message structures here as needed
	])
);

// Type inference
export type Message = z.infer<typeof messageSchema>;
export type WhatsAppMessage = z.infer<typeof whatsAppMessageStructure>;
export type TemplateComponents = z.infer<typeof templateComponentsSchema>;

// Validation function
export function validateMessage(message: unknown) {
	const result = messageSchema.safeParse(message);

	if (!result.success) {
		return {
			success: false as const,
			error: result.error,
		};
	}

	return {
		success: true as const,
		data: result.data,
	};
}

// Export the WhatsApp message schema as the base message schema
export const whatsAppMessageSchemaAsBase = whatsAppMessageSchema;

// Type inference for the base message schema
export type MessageSchema = z.infer<typeof whatsAppMessageSchemaAsBase>;
