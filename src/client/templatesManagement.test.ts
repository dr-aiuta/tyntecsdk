import {tyntecClient} from './index';

// Mock fetch globally
(globalThis as any).fetch = jest.fn();

describe('Template Management API', () => {
	const apiKey = 'test-api-key';
	const baseUrl = 'https://api.tyntec.com/conversations/v3';
	const accountId = 'test-account-id';
	let client: ReturnType<typeof tyntecClient>;

	beforeEach(() => {
		client = tyntecClient({apiKey, idWhatsAppAccount: accountId});
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

	describe('deleteTemplate', () => {
		it('should delete a template successfully', async () => {
			mockFetchResponse({success: true});
			const res = await client.deleteTemplate('test-template');

			expect(fetch).toHaveBeenCalledWith(
				`${baseUrl}/channels/whatsapp/accounts/${accountId}/templates/test-template`,
				expect.objectContaining({
					method: 'DELETE',
					headers: expect.objectContaining({apikey: apiKey}),
				})
			);
			expect(res.data).toEqual({success: true});
		});

		it('should delete a template with custom account id', async () => {
			mockFetchResponse({success: true});
			const customAccountId = 'custom-account-id';
			await client.deleteTemplate('test-template', customAccountId);

			expect(fetch).toHaveBeenCalledWith(
				`${baseUrl}/channels/whatsapp/accounts/${customAccountId}/templates/test-template`,
				expect.objectContaining({
					method: 'DELETE',
				})
			);
		});

		it('should throw error on failed delete', async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found',
				json: async () => ({error: 'Template not found'}),
			});

			await expect(client.deleteTemplate('nonexistent-template')).rejects.toThrow(/404/);
		});
	});

	describe('listLocalizations', () => {
		it('should list all localizations for a template', async () => {
			const mockLocalizations = [
				{language: 'en', status: 'APPROVED'},
				{language: 'de', status: 'PENDING'},
			];
			mockFetchResponse(mockLocalizations);

			const res = await client.listLocalizations('test-template');

			expect(fetch).toHaveBeenCalledWith(
				`${baseUrl}/channels/whatsapp/accounts/${accountId}/templates/test-template/localizations`,
				expect.objectContaining({
					method: 'GET',
					headers: expect.objectContaining({apikey: apiKey}),
				})
			);
			expect(res.data).toEqual(mockLocalizations);
		});

		it('should list localizations with custom account id', async () => {
			mockFetchResponse([]);
			const customAccountId = 'custom-account-id';
			await client.listLocalizations('test-template', customAccountId);

			expect(fetch).toHaveBeenCalledWith(
				`${baseUrl}/channels/whatsapp/accounts/${customAccountId}/templates/test-template/localizations`,
				expect.objectContaining({
					method: 'GET',
				})
			);
		});

		it('should throw error when template not found', async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found',
				json: async () => ({error: 'Template not found'}),
			});

			await expect(client.listLocalizations('nonexistent-template')).rejects.toThrow(/404/);
		});
	});

	describe('editTemplate', () => {
		it('should edit a template successfully', async () => {
			const updates = {category: 'MARKETING'};
			mockFetchResponse({success: true, category: 'MARKETING'});

			const res = await client.editTemplate('test-template', 'en', updates);

			expect(fetch).toHaveBeenCalledWith(
				`${baseUrl}/channels/whatsapp/accounts/${accountId}/templates/test-template/en`,
				expect.objectContaining({
					method: 'PATCH',
					headers: expect.objectContaining({apikey: apiKey}),
					body: JSON.stringify(updates),
				})
			);
			expect(res.data).toEqual({success: true, category: 'MARKETING'});
		});

		it('should edit a template with custom account id', async () => {
			const updates = {category: 'UTILITY'};
			mockFetchResponse({success: true});
			const customAccountId = 'custom-account-id';

			await client.editTemplate('test-template', 'en', updates, customAccountId);

			expect(fetch).toHaveBeenCalledWith(
				`${baseUrl}/channels/whatsapp/accounts/${customAccountId}/templates/test-template/en`,
				expect.objectContaining({
					method: 'PATCH',
					body: JSON.stringify(updates),
				})
			);
		});

		it('should throw error on invalid update', async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				headers: {
					get: (name: string) => (name === 'content-type' ? 'application/json' : null),
				},
				json: async () => ({error: 'Invalid category'}),
			});

			await expect(client.editTemplate('test-template', 'en', {category: 'INVALID'})).rejects.toThrow(/400/);
		});
	});

	describe('Integration with existing template API', () => {
		it('should have access to all template and template management methods', () => {
			// Check existing template methods
			expect(typeof client.listTemplates).toBe('function');
			expect(typeof client.getTemplate).toBe('function');
			expect(typeof client.createTemplate).toBe('function');
			expect(typeof client.addTemplateLocalization).toBe('function');

			// Check new template management methods
			expect(typeof client.deleteTemplate).toBe('function');
			expect(typeof client.listLocalizations).toBe('function');
			expect(typeof client.editTemplate).toBe('function');
		});

		it('should perform complete template lifecycle', async () => {
			// Create template
			mockFetchResponse({id: 'tpl-1', name: 'test-template'});
			await client.createTemplate({
				name: 'test-template',
				category: 'UTILITY',
				localizations: [{language: 'en', components: []}],
			});

			// Get template
			mockFetchResponse({id: 'tpl-1', name: 'test-template', status: 'APPROVED'});
			await client.getTemplate('test-template');

			// List localizations
			mockFetchResponse([{language: 'en', status: 'APPROVED'}]);
			await client.listLocalizations('test-template');

			// Add localization
			mockFetchResponse({success: true});
			await client.addTemplateLocalization('test-template', {
				language: 'de',
				components: [],
			});

			// Edit template
			mockFetchResponse({success: true});
			await client.editTemplate('test-template', 'en', {category: 'MARKETING'});

			// Delete template
			mockFetchResponse({success: true});
			await client.deleteTemplate('test-template');

			expect(fetch).toHaveBeenCalledTimes(6);
		});
	});

	describe('HTTP method validation', () => {
		it('should use DELETE method for deleteTemplate', async () => {
			mockFetchResponse({});
			await client.deleteTemplate('test-template');

			expect((fetch as jest.Mock).mock.calls[0][1].method).toBe('DELETE');
		});

		it('should use GET method for listLocalizations', async () => {
			mockFetchResponse([]);
			await client.listLocalizations('test-template');

			expect((fetch as jest.Mock).mock.calls[0][1].method).toBe('GET');
		});

		it('should use PATCH method for editTemplate', async () => {
			mockFetchResponse({});
			await client.editTemplate('test-template', 'en', {category: 'UTILITY'});

			expect((fetch as jest.Mock).mock.calls[0][1].method).toBe('PATCH');
		});
	});
});
