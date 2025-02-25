import {Message, MessageContent, TemplateComponent} from '../types/message';

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

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
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
}
