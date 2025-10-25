import {z} from 'zod';
import {
	whatsAppTemplateRequestSchema,
	localizationRequestSchema,
	templatePatchRequestSchema,
	whatsAppTemplateResponseSchema,
	localizationResponseSchema,
	whatsAppTemplatesSchema,
	templateCategorySchema,
	templateStatusSchema,
	componentTypeSchema,
	languageCodeSchema,
	templateHeaderComponentRequestSchema,
	templateBodyComponentRequestSchema,
	templateFooterComponentRequestSchema,
	templateButtonsComponentRequestSchema,
	templateCarouselComponentRequestSchema,
	componentRequestSchema,
	templateManagementButtonSchema,
	templateHeaderComponentResponseSchema,
	templateBodyComponentResponseSchema,
	templateFooterComponentResponseSchema,
	templateButtonsComponentResponseSchema,
	templateCarouselComponentResponseSchema,
	componentResponseSchema,
	buttonResponseSchema,
} from '@/models/messages/whatsapp/templateManagement.schema';

// Infer types from Zod schemas - Request types
export type WhatsAppTemplateRequest = z.infer<typeof whatsAppTemplateRequestSchema>;
export type LocalizationRequest = z.infer<typeof localizationRequestSchema>;
export type TemplatePatchRequest = z.infer<typeof templatePatchRequestSchema>;
export type ComponentRequest = z.infer<typeof componentRequestSchema>;
export type TemplateHeaderComponentRequest = z.infer<typeof templateHeaderComponentRequestSchema>;
export type TemplateBodyComponentRequest = z.infer<typeof templateBodyComponentRequestSchema>;
export type TemplateFooterComponentRequest = z.infer<typeof templateFooterComponentRequestSchema>;
export type TemplateButtonsComponentRequest = z.infer<typeof templateButtonsComponentRequestSchema>;
export type TemplateCarouselComponentRequest = z.infer<typeof templateCarouselComponentRequestSchema>;
export type TemplateManagementButton = z.infer<typeof templateManagementButtonSchema>;

// Infer types from Zod schemas - Response types
export type WhatsAppTemplateResponse = z.infer<typeof whatsAppTemplateResponseSchema>;
export type LocalizationResponse = z.infer<typeof localizationResponseSchema>;
export type WhatsAppTemplates = z.infer<typeof whatsAppTemplatesSchema>;
export type ComponentResponse = z.infer<typeof componentResponseSchema>;
export type TemplateHeaderComponentResponse = z.infer<typeof templateHeaderComponentResponseSchema>;
export type TemplateBodyComponentResponse = z.infer<typeof templateBodyComponentResponseSchema>;
export type TemplateFooterComponentResponse = z.infer<typeof templateFooterComponentResponseSchema>;
export type TemplateButtonsComponentResponse = z.infer<typeof templateButtonsComponentResponseSchema>;
export type TemplateCarouselComponentResponse = z.infer<typeof templateCarouselComponentResponseSchema>;
export type ButtonResponse = z.infer<typeof buttonResponseSchema>;

// Infer types from Zod schemas - Enums
export type TemplateCategory = z.infer<typeof templateCategorySchema>;
export type TemplateStatus = z.infer<typeof templateStatusSchema>;
export type ComponentType = z.infer<typeof componentTypeSchema>;
export type LanguageCode = z.infer<typeof languageCodeSchema>;
