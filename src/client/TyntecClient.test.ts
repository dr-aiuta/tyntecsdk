import {tyntecClient} from './index';

// Mock fetch globally
(globalThis as any).fetch = jest.fn();

describe('TyntecClient', () => {
	const apiKey = 'test-api-key';
	const baseUrl = 'https://api.tyntec.com/conversations/v3';
	let client: ReturnType<typeof tyntecClient>;

	beforeEach(() => {
		client = tyntecClient({apiKey});
		(fetch as jest.Mock).mockClear();
	});

	const mockFetchResponse = (data: any, ok = true, status = 200) => {
		(fetch as jest.Mock).mockResolvedValue({
			ok,
			status,
			statusText: ok ? 'OK' : 'Bad Request',
			headers: {
				get: (name: string) => (name === 'content-type' ? 'application/json' : null),
			},
			json: async () => data,
		});
	};

	it('sendTextMessage sends a valid text message', async () => {
		mockFetchResponse({id: 'msg1'});
		const res = await client.sendTextMessage('from', 'to', 'hello');
		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining('/messages'),
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({apikey: apiKey}),
				body: expect.stringContaining('hello'),
			})
		);
		expect(res.data).toEqual({id: 'msg1'});
	});

	it('sendImageMessage sends a valid image message', async () => {
		mockFetchResponse({id: 'img1'});
		const res = await client.sendImageMessage('from', 'to', 'http://img', 'caption');
		expect(fetch).toHaveBeenCalled();
		expect(res.data).toEqual({id: 'img1'});
	});

	it('sendVideoMessage sends a valid video message', async () => {
		mockFetchResponse({id: 'vid1'});
		const res = await client.sendVideoMessage('from', 'to', 'http://vid', 'caption');
		expect(fetch).toHaveBeenCalled();
		expect(res.data).toEqual({id: 'vid1'});
	});

	it('sendDocumentMessage sends a valid document message', async () => {
		mockFetchResponse({id: 'doc1'});
		const res = await client.sendDocumentMessage('from', 'to', 'http://doc', 'caption', 'file.pdf');
		expect(fetch).toHaveBeenCalled();
		expect(res.data).toEqual({id: 'doc1'});
	});

	it('sendAudioMessage sends a valid audio message', async () => {
		mockFetchResponse({id: 'aud1'});
		const res = await client.sendAudioMessage('from', 'to', 'http://aud');
		expect(fetch).toHaveBeenCalled();
		expect(res.data).toEqual({id: 'aud1'});
	});

	it('sendStickerMessage sends a valid sticker message', async () => {
		mockFetchResponse({id: 'stk1'});
		const res = await client.sendStickerMessage('from', 'to', 'http://stk');
		expect(fetch).toHaveBeenCalled();
		expect(res.data).toEqual({id: 'stk1'});
	});

	it('sendTemplateMessage sends a valid template message', async () => {
		mockFetchResponse({id: 'tpl1'});
		const res = await client.sendTemplateMessage('from', 'to', 'templateId', 'en', {
			body: [{type: 'text', text: 'body'}],
			button: [{type: 'quick_reply', index: 0, payload: 'btn'}],
		});
		expect(fetch).toHaveBeenCalled();
		expect(res.data).toEqual({id: 'tpl1'});
	});

	it('sendWhatsAppMessage validates and sends a text message', async () => {
		mockFetchResponse({id: 'msg2'});
		const res = await client.sendWhatsAppMessage({
			from: 'from',
			to: 'to',
			channel: 'whatsapp',
			content: {contentType: 'text', text: 'hi'},
		});
		expect(fetch).toHaveBeenCalled();
		expect(res.data).toEqual({id: 'msg2'});
	});

	it('sendWhatsAppMessage throws on invalid content', async () => {
		await expect(
			client.sendWhatsAppMessage({
				from: 'from',
				to: 'to',
				channel: 'whatsapp',
				content: {contentType: 'text'}, // missing text
			} as any)
		).rejects.toThrow();
	});

	it('sendRequest throws on HTTP error', async () => {
		(fetch as jest.Mock).mockResolvedValue({
			ok: false,
			status: 400,
			statusText: 'Bad Request',
			json: async () => ({error: 'fail'}),
		});
		await expect(client.sendTextMessage('from', 'to', 'fail')).rejects.toThrow(/400/);
	});

	it('listTemplates fetches all templates', async () => {
		mockFetchResponse([{name: 'template1'}, {name: 'template2'}]);
		const res = await client.listTemplates('accountId');
		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining('/channels/whatsapp/accounts/accountId/templates'),
			expect.objectContaining({
				method: 'GET',
				headers: expect.objectContaining({apikey: apiKey}),
			})
		);
		expect(res.data).toEqual([{name: 'template1'}, {name: 'template2'}]);
	});

	it('getTemplate fetches a specific template', async () => {
		mockFetchResponse({name: 'template1'});
		const res = await client.getTemplate('template1', 'accountId');
		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining('/channels/whatsapp/accounts/accountId/templates/template1'),
			expect.objectContaining({
				method: 'GET',
				headers: expect.objectContaining({apikey: apiKey}),
			})
		);
		expect(res.data).toEqual({name: 'template1'});
	});

	it('createTemplate creates a new template', async () => {
		const templatePayload = {
			name: 'newTemplate',
			category: 'UTILITY' as const,
			localizations: [
				{
					language: 'en',
					components: [
						{
							type: 'BODY' as const,
							text: 'Hello {{1}}',
							example: {
								texts: ['World'],
							},
						},
					],
				},
			],
		};
		mockFetchResponse({id: 'tpl2'});
		const res = await client.createTemplate(templatePayload, 'accountId');
		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining('/channels/whatsapp/accounts/accountId/templates'),
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({apikey: apiKey}),
				body: expect.stringContaining('newTemplate'),
			})
		);
		expect(res.data).toEqual({id: 'tpl2'});
	});

	it('addTemplateLocalization adds a localization to a template', async () => {
		const localizationPayload = {
			language: 'es',
			components: [
				{
					type: 'BODY' as const,
					text: 'Hola {{1}}',
					example: {
						texts: ['Mundo'],
					},
				},
			],
		};
		mockFetchResponse({success: true});
		const res = await client.addTemplateLocalization('template1', localizationPayload, 'accountId');
		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining('/channels/whatsapp/accounts/accountId/templates/template1/localizations'),
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({apikey: apiKey}),
				body: expect.stringContaining('Hola'),
			})
		);
		expect(res.data).toEqual({success: true});
	});
});
