// messages.ts ─── owns *only* message endpoints
import {requestHttp} from './requestHttp';
import {RequestHttp, TyntecConfig} from './types';
import {Message, messageSchema, TemplateComponents} from '../models';

export interface MessageApi {
	/**
	 * Sends a message to the Tyntec API
	 * @param message - The message to send
	 * @returns The response data from the API
	 */
	sendMessage: (message: Message) => Promise<any>;
	/**
	 * Sends a text message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param text - The text of the message
	 * @returns The response data from the API
	 */
	sendTextMessage: (from: string, to: string, text: string) => Promise<any>;
	/**
	 * Sends an image message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param url - The URL of the image
	 * @param caption - The caption of the image
	 * @returns The response data from the API
	 */
	sendImageMessage: (from: string, to: string, url: string, caption?: string) => Promise<any>;
	/**
	 * Sends a video message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param url - The URL of the video
	 * @param caption - The caption of the video
	 * @returns The response data from the API
	 */
	sendVideoMessage: (from: string, to: string, url: string, caption?: string) => Promise<any>;
	/**
	 * Sends a document message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param url - The URL of the document
	 * @param caption - The caption of the document
	 * @param filename - The filename of the document
	 * @returns The response data from the API
	 */
	sendDocumentMessage: (from: string, to: string, url: string, caption?: string, filename?: string) => Promise<any>;
	/**
	 * Sends an audio message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param url - The URL of the audio
	 * @returns The response data from the API
	 */
	sendAudioMessage: (from: string, to: string, url: string) => Promise<any>;
	/**
	 * Sends a sticker message to the Tyntec API
	 * @param from - The sender of the message
	 * @param to - The recipient of the message
	 * @param url - The URL of the sticker
	 * @returns The response data from the API
	 */
	sendStickerMessage: (from: string, to: string, url: string) => Promise<any>;
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
	sendTemplateMessage: (
		from: string,
		to: string,
		templateId: string,
		templateLanguage: string,
		components: TemplateComponents
	) => Promise<any>;
	/**
	 * Sends a WhatsApp message to the Tyntec API
	 * @param message - The message to send
	 * @returns The response data from the API
	 */
	sendWhatsAppMessage: (message: Message) => Promise<any>;
}

export function createMessageApi(requestHttp: RequestHttp, cfg: TyntecConfig): MessageApi {
	const post = (message: Message) => requestHttp.send('POST', '/messages', message);

	return {
		async sendMessage(message: Message): Promise<any> {
			return post(message);
		},

		async sendTextMessage(from: string, to: string, text: string): Promise<any> {
			return post({
				from,
				to,
				channel: 'whatsapp',
				content: {
					contentType: 'text',
					text,
				},
			});
		},

		async sendImageMessage(from: string, to: string, url: string, caption?: string): Promise<any> {
			return post({
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
		},

		async sendVideoMessage(from: string, to: string, url: string, caption?: string): Promise<any> {
			return post({
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
		},

		async sendDocumentMessage(
			from: string,
			to: string,
			url: string,
			caption?: string,
			filename?: string
		): Promise<any> {
			return post({
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
		},

		async sendAudioMessage(from: string, to: string, url: string): Promise<any> {
			return post({
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
		},

		async sendStickerMessage(from: string, to: string, url: string): Promise<any> {
			return post({
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
		},

		async sendTemplateMessage(
			from: string,
			to: string,
			templateId: string,
			templateLanguage: string,
			components: TemplateComponents
		): Promise<any> {
			return post({
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
		},

		async sendWhatsAppMessage(message: Message): Promise<any> {
			// Validate the entire message using messageSchema
			const validatedMessage = messageSchema.parse(message);
			return post(validatedMessage);
		},
	};
}
