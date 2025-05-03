import {Message, messageSchema, TemplateComponents} from '../models';
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

	/**
	 * Sends a request to the Tyntec API
	 * @param method - The HTTP method to use
	 * @param endpoint - The endpoint to send the request to
	 * @param data - The data to send in the request body
	 * @returns The response data from the API
	 */
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

	/**
	 * Sends a message to the Tyntec API
	 * @param message - The message to send
	 * @returns The response data from the API
	 */
	async sendMessage(message: Message): Promise<any> {
		return this.sendRequest('POST', '/messages', message);
	}

	/**
	 * Sends a text message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param text - The text of the message
	 * @returns The response data from the API
	 */
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

	/**
	 * Sends an image message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param url - The URL of the image
	 * @param caption - The caption of the image
	 * @returns The response data from the API
	 */
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

	/**
	 * Sends a video message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param url - The URL of the video
	 * @param caption - The caption of the video
	 * @returns The response data from the API
	 */
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

	/**
	 * Sends a document message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param url - The URL of the document
	 * @param caption - The caption of the document
	 * @param filename - The filename of the document
	 * @returns The response data from the API
	 */
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

	/**
	 * Sends an audio message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param url - The URL of the audio
	 * @returns The response data from the API
	 */
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

	/**
	 * Sends a sticker message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param url - The URL of the sticker
	 * @returns The response data from the API
	 */
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

	/**
	 * Sends a template message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param templateId - The ID of the template
	 * @param templateLanguage - The language of the template
	 * @param bodyComponents - The body components of the template
	 * @param buttonComponents - The button components of the template
	 * @returns The response data from the API
	 */
	async sendTemplateMessage(
		from: string,
		to: string,
		templateId: string,
		templateLanguage: string,
		components: TemplateComponents
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
					components,
				},
			},
		});
	}

	/**
	 * Sends a WhatsApp message to the Tyntec API
	 * @param message - The message to send
	 * @returns The response data from the API
	 */
	async sendWhatsAppMessage(message: Message): Promise<any> {
		// Validate the entire message using messageSchema
		const validatedMessage = messageSchema.parse(message);
		return this.sendMessage(validatedMessage);
	}
}
