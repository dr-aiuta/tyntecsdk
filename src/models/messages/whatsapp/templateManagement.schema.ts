import {z} from 'zod';

// Enums and constants
export const templateCategorySchema = z.enum(['AUTHENTICATION', 'MARKETING', 'UTILITY']);
export const templateStatusSchema = z.enum(['APPROVED', 'PENDING', 'REJECTED', 'DISABLED', 'DELETED']);
export const componentTypeSchema = z.enum(['HEADER', 'BODY', 'FOOTER', 'BUTTONS', 'CAROUSEL']);
export const languageCodeSchema = z.string(); // ISO 639-1 codes like "en", "de", etc.

// Header component request schemas
const textHeaderComponentRequestSchema = z.object({
	type: z.literal('TEXT'),
	text: z.string().optional(),
	example: z
		.object({
			texts: z.array(z.string()),
		})
		.optional(),
});

const mediaHeaderComponentRequestSchema = z.object({
	type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']),
	example: z.object({
		url: z.string().url(),
	}),
});

const locationHeaderComponentRequestSchema = z.object({
	type: z.literal('LOCATION'),
});

export const templateHeaderComponentRequestSchema = z.discriminatedUnion('type', [
	textHeaderComponentRequestSchema,
	mediaHeaderComponentRequestSchema,
	locationHeaderComponentRequestSchema,
]);

// Body component request schema
export const templateBodyComponentRequestSchema = z.object({
	type: z.literal('BODY'),
	text: z.string().optional(),
	addSecurityRecommendation: z.boolean().optional(),
	example: z
		.object({
			texts: z.array(z.string()),
		})
		.optional(),
});

// Footer component request schema
export const templateFooterComponentRequestSchema = z.object({
	type: z.literal('FOOTER'),
	text: z.string().optional(),
	codeExpirationMinutes: z.number().optional(),
});

// Button component request schemas
const quickReplyButtonSchema = z.object({
	type: z.literal('QUICK_REPLY'),
	text: z.string(),
});

const urlButtonSchema = z.object({
	type: z.literal('URL'),
	text: z.string(),
	url: z.string().url(),
	example: z.array(z.string()).optional(),
});

const phoneNumberButtonSchema = z.object({
	type: z.literal('PHONE_NUMBER'),
	text: z.string(),
	phoneNumber: z.string(),
});

const otpButtonSchema = z.object({
	type: z.literal('OTP'),
	otpType: z.enum(['COPY_CODE', 'ONE_TAP', 'ZERO_TAP']),
	text: z.string().optional(),
	autofillButtonText: z.string().optional(),
	packageName: z.string().optional(),
	signatureHash: z.string().optional(),
});

const flowButtonSchema = z.object({
	type: z.literal('FLOW'),
	text: z.string(),
	flowId: z.string().optional(),
	flowAction: z.enum(['navigate', 'data_exchange']).optional(),
	navigateScreen: z.string().optional(),
});

export const templateManagementButtonSchema = z.discriminatedUnion('type', [
	quickReplyButtonSchema,
	urlButtonSchema,
	phoneNumberButtonSchema,
	otpButtonSchema,
	flowButtonSchema,
]);

// Buttons component request schema
export const templateButtonsComponentRequestSchema = z.object({
	type: z.literal('BUTTONS'),
	buttons: z.array(templateManagementButtonSchema),
});

// Carousel component request schemas
const carouselCardComponentSchema = z.object({
	components: z.array(
		z.union([
			templateHeaderComponentRequestSchema,
			templateBodyComponentRequestSchema,
			templateButtonsComponentRequestSchema,
		])
	),
});

export const templateCarouselComponentRequestSchema = z.object({
	type: z.literal('CAROUSEL'),
	cards: z.array(carouselCardComponentSchema),
});

// Combined component request schema
export const componentRequestSchema = z.union([
	templateHeaderComponentRequestSchema,
	templateBodyComponentRequestSchema,
	templateFooterComponentRequestSchema,
	templateButtonsComponentRequestSchema,
	templateCarouselComponentRequestSchema,
]);

// Localization request schema
export const localizationRequestSchema = z.object({
	language: languageCodeSchema,
	components: z.array(componentRequestSchema),
});

// Template request schema (for creating templates)
export const whatsAppTemplateRequestSchema = z.object({
	name: z.string(),
	category: templateCategorySchema,
	allowCategoryChange: z.boolean().optional(),
	localizations: z.array(localizationRequestSchema),
});

// Template patch request schema (for editing templates)
export const templatePatchRequestSchema = z.object({
	category: templateCategorySchema.optional(),
});

// Response schemas
export const templateHeaderComponentResponseSchema = z.object({
	type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'LOCATION']),
	text: z.string().optional(),
	format: z.string().optional(),
	example: z
		.object({
			headerText: z.array(z.string()).optional(),
			headerHandle: z.array(z.string()).optional(),
		})
		.optional(),
});

export const templateBodyComponentResponseSchema = z.object({
	type: z.literal('BODY'),
	text: z.string(),
	example: z
		.object({
			bodyText: z.array(z.array(z.string())),
		})
		.optional(),
});

export const templateFooterComponentResponseSchema = z.object({
	type: z.literal('FOOTER'),
	text: z.string(),
	codeExpirationMinutes: z.number().optional(),
});

export const buttonResponseSchema = z.object({
	type: z.enum(['QUICK_REPLY', 'URL', 'PHONE_NUMBER', 'OTP', 'FLOW']),
	text: z.string(),
	url: z.string().optional(),
	phoneNumber: z.string().optional(),
	example: z.array(z.string()).optional(),
	otpType: z.enum(['COPY_CODE', 'ONE_TAP', 'ZERO_TAP']).optional(),
	autofillButtonText: z.string().optional(),
	packageName: z.string().optional(),
	signatureHash: z.string().optional(),
	flowId: z.string().optional(),
	flowAction: z.string().optional(),
	navigateScreen: z.string().optional(),
});

export const templateButtonsComponentResponseSchema = z.object({
	type: z.literal('BUTTONS'),
	buttons: z.array(buttonResponseSchema),
});

export const carouselCardComponentResponseSchema = z.object({
	components: z.array(
		z.union([
			templateHeaderComponentResponseSchema,
			templateBodyComponentResponseSchema,
			templateButtonsComponentResponseSchema,
		])
	),
});

export const templateCarouselComponentResponseSchema = z.object({
	type: z.literal('CAROUSEL'),
	cards: z.array(carouselCardComponentResponseSchema),
});

export const componentResponseSchema = z.union([
	templateHeaderComponentResponseSchema,
	templateBodyComponentResponseSchema,
	templateFooterComponentResponseSchema,
	templateButtonsComponentResponseSchema,
	templateCarouselComponentResponseSchema,
]);

// Localization response schema
export const localizationResponseSchema = z.object({
	language: languageCodeSchema,
	status: templateStatusSchema,
	components: z.array(componentResponseSchema),
	rejectionReason: z.string().optional(),
});

// Template response schema
export const whatsAppTemplateResponseSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	category: templateCategorySchema,
	status: templateStatusSchema.optional(),
	language: languageCodeSchema.optional(),
	localizations: z.array(localizationResponseSchema).optional(),
	rejectionReason: z.string().optional(),
});

// List templates response schema
export const whatsAppTemplatesSchema = z.object({
	templates: z.array(whatsAppTemplateResponseSchema),
});
