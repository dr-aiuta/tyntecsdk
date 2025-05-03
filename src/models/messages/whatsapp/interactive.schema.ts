import {z} from 'zod';
import {whatsAppBaseFields} from './base.schema';

export const buttonSchema = z.object({
	type: z.literal('reply'),
	reply: z.object({
		payload: z.string(),
		title: z.string(),
	}),
});

export const listSectionSchema = z.object({
	title: z.string(),
	rows: z.array(
		z.object({
			payload: z.string(),
			title: z.string(),
			description: z.string(),
		})
	),
});

export const productListSectionSchema = z.object({
	items: z.array(
		z.object({
			productId: z.string(),
		})
	),
});

export const interactiveComponentsSchema = z.object({
	header: z
		.object({
			type: z.literal('text'),
			text: z.string(),
		})
		.optional(),
	body: z
		.object({
			type: z.literal('text'),
			text: z.string(),
		})
		.optional(),
	footer: z
		.object({
			type: z.literal('text'),
			text: z.string(),
		})
		.optional(),
	buttons: z.array(buttonSchema).optional(),
	list: z
		.object({
			title: z.string(),
			sections: z.array(listSectionSchema),
		})
		.optional(),
	productList: z
		.object({
			catalogId: z.string(),
			sections: z.array(productListSectionSchema),
		})
		.optional(),
	product: z
		.object({
			catalogId: z.string(),
			productId: z.string(),
		})
		.optional(),
});

// Extending the base schema with interactive content
export const interactiveMessageSchema = whatsAppBaseFields.extend({
	contentType: z.literal('interactive'),
	interactive: z.object({
		subType: z.enum(['buttons', 'list', 'product', 'productList']),
		components: interactiveComponentsSchema,
	}),
});
