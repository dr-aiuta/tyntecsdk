import {Message, MessageContent, TemplateComponent} from '../types/message';
import {z} from 'zod';
import {
	whatsAppBaseFields,
	mediaContentSchema,
	locationContentSchema,
	contactSchema,
	reactionContentSchema,
} from '../models/messages/whatsapp';

export class TyntecClient {
	private baseUrl: string;
	private apiKey: string;

	constructor(apiKey: string, baseUrl = 'https://api.tyntec.com/conversations/v3') {
		this.apiKey = apiKey;
		this.baseUrl = baseUrl;
	}

	private async sendRequest(method: string, endpoint: string, data?: any): Promise<any> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method,
			headers: {
				'Content-Type': 'application/json',
				apikey: this.apiKey,
			},
			body: data ? JSON.stringify(data) : undefined,
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(
				JSON.stringify({
					statusCode: response.status,
					statusText: response.statusText,
					data: responseData,
					endpoint,
				})
			);
		}

		return {
			statusCode: response.status,
			statusText: response.statusText,
			data: responseData,
		};
	}

	async sendMessage(message: Message): Promise<any> {
		return this.sendRequest('POST', '/messages', message);
	}

	async sendTextMessage(from: string, to: string, text: string): Promise<any> {
		return this.sendMessage({
			from,
			to,
			channel: 'whatsapp',
			content: {
				contentType: 'text',
				text,
			},
		});
	}

	async sendImageMessage(from: string, to: string, url: string, caption?: string): Promise<any> {
		return this.sendMessage({
			from,
			to,
			channel: 'whatsapp',
			content: {
				contentType: 'image',
				image: {
					url,
					caption,
				},
			},
		});
	}

	async sendVideoMessage(from: string, to: string, url: string, caption?: string): Promise<any> {
		return this.sendMessage({
			from,
			to,
			channel: 'whatsapp',
			content: {
				contentType: 'video',
				video: {
					url,
					caption,
				},
			},
		});
	}

	async sendDocumentMessage(from: string, to: string, url: string, caption?: string, filename?: string): Promise<any> {
		return this.sendMessage({
			from,
			to,
			channel: 'whatsapp',
			content: {
				contentType: 'document',
				document: {
					url,
					caption,
					filename,
				},
			},
		});
	}

	async sendAudioMessage(from: string, to: string, url: string): Promise<any> {
		return this.sendMessage({
			from,
			to,
			channel: 'whatsapp',
			content: {
				contentType: 'audio',
				audio: {
					url,
				},
			},
		});
	}

	async sendStickerMessage(from: string, to: string, url: string): Promise<any> {
		return this.sendMessage({
			from,
			to,
			channel: 'whatsapp',
			content: {
				contentType: 'sticker',
				sticker: {
					url,
				},
			},
		});
	}

	async sendTemplateMessage(
		from: string,
		to: string,
		templateId: string,
		templateLanguage: string,
		bodyComponents?: TemplateComponent[],
		buttonComponents?: TemplateComponent[]
	): Promise<any> {
		return this.sendMessage({
			from,
			to,
			channel: 'whatsapp',
			content: {
				contentType: 'template',
				template: {
					templateId,
					templateLanguage,
					components: {
						body: bodyComponents,
						button: buttonComponents,
					},
				},
			},
		});
	}

	async sendWhatsAppMessage(message: any): Promise<any> {
		// Base message validation
		const baseMessage = whatsAppBaseFields.parse({
			from: message.from,
			senderName: message.senderName,
			urlPreviewDisplayed: message.urlPreviewDisplayed,
		});

		// Validate content based on type
		let validatedContent: MessageContent;
		switch (message.content?.contentType) {
			case 'text':
				validatedContent = z
					.object({
						contentType: z.literal('text'),
						text: z.string(),
					})
					.parse(message.content);
				break;
			case 'image':
				validatedContent = z
					.object({
						contentType: z.literal('image'),
						image: mediaContentSchema,
					})
					.parse(message.content);
				break;
			case 'video':
				validatedContent = z
					.object({
						contentType: z.literal('video'),
						video: mediaContentSchema,
					})
					.parse(message.content);
				break;
			case 'document':
				validatedContent = z
					.object({
						contentType: z.literal('document'),
						document: mediaContentSchema.extend({
							filename: z.string().optional(),
						}),
					})
					.parse(message.content);
				break;
			case 'audio':
				validatedContent = z
					.object({
						contentType: z.literal('audio'),
						audio: z.object({
							url: z.string().url(),
						}),
					})
					.parse(message.content);
				break;
			case 'sticker':
				validatedContent = z
					.object({
						contentType: z.literal('sticker'),
						sticker: z.object({
							url: z.string().url(),
						}),
					})
					.parse(message.content);
				break;
			case 'template':
				validatedContent = z
					.object({
						contentType: z.literal('template'),
						template: z.object({
							templateId: z.string(),
							templateLanguage: z.string(),
							components: z.object({
								body: z
									.array(
										z.object({
											type: z.enum(['text', 'quick_reply']),
											text: z.string().optional(),
											index: z.number().optional(),
											payload: z.string().optional(),
										})
									)
									.optional(),
								button: z
									.array(
										z.object({
											type: z.enum(['text', 'quick_reply']),
											text: z.string().optional(),
											index: z.number().optional(),
											payload: z.string().optional(),
										})
									)
									.optional(),
							}),
						}),
					})
					.parse(message.content);
				break;
			default:
				throw new Error(`Unsupported content type: ${message.content?.contentType}`);
		}

		// Construct the validated message
		const validatedMessage: Message = {
			...baseMessage,
			to: message.to,
			channel: 'whatsapp' as const,
			content: validatedContent,
		};

		return this.sendMessage(validatedMessage);
	}
}
