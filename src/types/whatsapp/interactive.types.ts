import {z} from 'zod';
import {
	buttonSchema,
	listSectionSchema,
	productListSectionSchema,
	interactiveComponentsSchema,
	interactiveMessageSchema,
} from '@/models/messages/whatsapp';

// Infer types from Zod schemas
export type Button = z.infer<typeof buttonSchema>;
export type ListSection = z.infer<typeof listSectionSchema>;
export type ProductListSection = z.infer<typeof productListSectionSchema>;
export type InteractiveComponents = z.infer<typeof interactiveComponentsSchema>;
export type InteractiveMessage = z.infer<typeof interactiveMessageSchema>;
