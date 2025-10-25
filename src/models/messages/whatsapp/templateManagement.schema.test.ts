import {
	whatsAppTemplateRequestSchema,
	localizationRequestSchema,
	templatePatchRequestSchema,
	whatsAppTemplateResponseSchema,
	localizationResponseSchema,
	whatsAppTemplatesSchema,
	templateCategorySchema,
	templateStatusSchema,
	templateManagementButtonSchema,
} from './templateManagement.schema';

describe('Template Management Schemas', () => {
	describe('templateCategorySchema', () => {
		it('should validate valid categories', () => {
			expect(templateCategorySchema.parse('AUTHENTICATION')).toBe('AUTHENTICATION');
			expect(templateCategorySchema.parse('MARKETING')).toBe('MARKETING');
			expect(templateCategorySchema.parse('UTILITY')).toBe('UTILITY');
		});

		it('should reject invalid categories', () => {
			expect(() => templateCategorySchema.parse('INVALID')).toThrow();
		});
	});

	describe('templateStatusSchema', () => {
		it('should validate valid statuses', () => {
			expect(templateStatusSchema.parse('APPROVED')).toBe('APPROVED');
			expect(templateStatusSchema.parse('PENDING')).toBe('PENDING');
			expect(templateStatusSchema.parse('REJECTED')).toBe('REJECTED');
			expect(templateStatusSchema.parse('DISABLED')).toBe('DISABLED');
			expect(templateStatusSchema.parse('DELETED')).toBe('DELETED');
		});

		it('should reject invalid statuses', () => {
			expect(() => templateStatusSchema.parse('UNKNOWN')).toThrow();
		});
	});

	describe('templateManagementButtonSchema', () => {
		it('should validate quick reply button', () => {
			const button = {
				type: 'QUICK_REPLY',
				text: 'Yes',
			};
			const result = templateManagementButtonSchema.parse(button);
			expect(result).toEqual(button);
		});

		it('should validate URL button', () => {
			const button = {
				type: 'URL',
				text: 'Visit Site',
				url: 'https://example.com',
			};
			const result = templateManagementButtonSchema.parse(button);
			expect(result).toEqual(button);
		});

		it('should validate phone number button', () => {
			const button = {
				type: 'PHONE_NUMBER',
				text: 'Call Us',
				phoneNumber: '+1234567890',
			};
			const result = templateManagementButtonSchema.parse(button);
			expect(result).toEqual(button);
		});

		it('should validate copy code OTP button', () => {
			const button = {
				type: 'OTP',
				otpType: 'COPY_CODE',
				text: 'Copy Code',
			};
			const result = templateManagementButtonSchema.parse(button);
			expect(result).toEqual(button);
		});

		it('should validate flow button', () => {
			const button = {
				type: 'FLOW',
				text: 'Start Flow',
				flowId: 'flow-123',
				flowAction: 'navigate',
			};
			const result = templateManagementButtonSchema.parse(button);
			expect(result).toEqual(button);
		});

		it('should reject invalid button type', () => {
			const button = {
				type: 'INVALID',
				text: 'Button',
			};
			expect(() => templateManagementButtonSchema.parse(button)).toThrow();
		});
	});

	describe('localizationRequestSchema', () => {
		it('should validate basic localization request', () => {
			const localization = {
				language: 'en',
				components: [
					{
						type: 'BODY',
						text: 'Hello {{1}}',
						example: {
							texts: ['World'],
						},
					},
				],
			};
			const result = localizationRequestSchema.parse(localization);
			expect(result.language).toBe('en');
			expect(result.components).toHaveLength(1);
		});

		it('should validate localization with multiple components', () => {
			const localization = {
				language: 'en',
				components: [
					{
						type: 'TEXT',
						text: 'Welcome',
					},
					{
						type: 'BODY',
						text: 'Hello {{1}}',
					},
					{
						type: 'FOOTER',
						text: 'Thanks',
					},
				],
			};
			const result = localizationRequestSchema.parse(localization);
			expect(result.components).toHaveLength(3);
		});

		it('should reject localization without language', () => {
			const localization = {
				components: [],
			};
			expect(() => localizationRequestSchema.parse(localization)).toThrow();
		});
	});

	describe('whatsAppTemplateRequestSchema', () => {
		it('should validate authentication template request', () => {
			const template = {
				name: 'auth_template',
				category: 'AUTHENTICATION',
				allowCategoryChange: false,
				localizations: [
					{
						language: 'en',
						components: [
							{
								type: 'BODY',
								addSecurityRecommendation: true,
							},
							{
								type: 'FOOTER',
								codeExpirationMinutes: 10,
							},
							{
								type: 'BUTTONS',
								buttons: [
									{
										type: 'OTP',
										otpType: 'COPY_CODE',
										text: 'Copy Code',
									},
								],
							},
						],
					},
				],
			};
			const result = whatsAppTemplateRequestSchema.parse(template);
			expect(result.name).toBe('auth_template');
			expect(result.category).toBe('AUTHENTICATION');
		});

		it('should validate utility template request', () => {
			const template = {
				name: 'utility_template',
				category: 'UTILITY',
				localizations: [
					{
						language: 'en',
						components: [
							{
								type: 'BODY',
								text: 'Hello {{1}}',
								example: {
									texts: ['John'],
								},
							},
						],
					},
				],
			};
			const result = whatsAppTemplateRequestSchema.parse(template);
			expect(result.name).toBe('utility_template');
		});

		it('should reject template without name', () => {
			const template = {
				category: 'UTILITY',
				localizations: [],
			};
			expect(() => whatsAppTemplateRequestSchema.parse(template)).toThrow();
		});

		it('should reject template without localizations', () => {
			const template = {
				name: 'test',
				category: 'UTILITY',
			};
			expect(() => whatsAppTemplateRequestSchema.parse(template)).toThrow();
		});
	});

	describe('templatePatchRequestSchema', () => {
		it('should validate category update', () => {
			const patch = {
				category: 'MARKETING',
			};
			const result = templatePatchRequestSchema.parse(patch);
			expect(result.category).toBe('MARKETING');
		});

		it('should allow empty patch', () => {
			const patch = {};
			const result = templatePatchRequestSchema.parse(patch);
			expect(result).toEqual({});
		});

		it('should reject invalid category in patch', () => {
			const patch = {
				category: 'INVALID',
			};
			expect(() => templatePatchRequestSchema.parse(patch)).toThrow();
		});
	});

	describe('localizationResponseSchema', () => {
		it('should validate approved localization response', () => {
			const response = {
				language: 'en',
				status: 'APPROVED',
				components: [
					{
						type: 'BODY',
						text: 'Hello World',
					},
				],
			};
			const result = localizationResponseSchema.parse(response);
			expect(result.status).toBe('APPROVED');
		});

		it('should validate rejected localization with reason', () => {
			const response = {
				language: 'en',
				status: 'REJECTED',
				components: [],
				rejectionReason: 'Invalid content',
			};
			const result = localizationResponseSchema.parse(response);
			expect(result.rejectionReason).toBe('Invalid content');
		});
	});

	describe('whatsAppTemplateResponseSchema', () => {
		it('should validate complete template response', () => {
			const response = {
				id: 'tpl-123',
				name: 'my_template',
				category: 'UTILITY',
				status: 'APPROVED',
				language: 'en',
				localizations: [
					{
						language: 'en',
						status: 'APPROVED',
						components: [],
					},
				],
			};
			const result = whatsAppTemplateResponseSchema.parse(response);
			expect(result.id).toBe('tpl-123');
			expect(result.name).toBe('my_template');
		});

		it('should validate minimal template response', () => {
			const response = {
				name: 'my_template',
				category: 'UTILITY',
			};
			const result = whatsAppTemplateResponseSchema.parse(response);
			expect(result.name).toBe('my_template');
		});
	});

	describe('whatsAppTemplatesSchema', () => {
		it('should validate list of templates', () => {
			const response = {
				templates: [
					{
						name: 'template1',
						category: 'UTILITY',
					},
					{
						name: 'template2',
						category: 'MARKETING',
					},
				],
			};
			const result = whatsAppTemplatesSchema.parse(response);
			expect(result.templates).toHaveLength(2);
		});

		it('should validate empty template list', () => {
			const response = {
				templates: [],
			};
			const result = whatsAppTemplatesSchema.parse(response);
			expect(result.templates).toHaveLength(0);
		});

		it('should reject response without templates array', () => {
			const response = {};
			expect(() => whatsAppTemplatesSchema.parse(response)).toThrow();
		});
	});

	describe('Complex Template Scenarios', () => {
		it('should validate template with carousel component', () => {
			const localization = {
				language: 'en',
				components: [
					{
						type: 'CAROUSEL',
						cards: [
							{
								components: [
									{
										type: 'IMAGE',
										example: {
											url: 'https://example.com/image.jpg',
										},
									},
									{
										type: 'BODY',
										text: 'Card 1 body',
									},
								],
							},
							{
								components: [
									{
										type: 'IMAGE',
										example: {
											url: 'https://example.com/image2.jpg',
										},
									},
									{
										type: 'BODY',
										text: 'Card 2 body',
									},
								],
							},
						],
					},
				],
			};
			const result = localizationRequestSchema.parse(localization);
			expect(result.components[0].type).toBe('CAROUSEL');
		});

		it('should validate template with all component types', () => {
			const localization = {
				language: 'en',
				components: [
					{
						type: 'TEXT',
						text: 'Header',
					},
					{
						type: 'BODY',
						text: 'Body',
					},
					{
						type: 'FOOTER',
						text: 'Footer',
					},
					{
						type: 'BUTTONS',
						buttons: [
							{
								type: 'QUICK_REPLY',
								text: 'Yes',
							},
							{
								type: 'URL',
								text: 'More Info',
								url: 'https://example.com',
							},
						],
					},
				],
			};
			const result = localizationRequestSchema.parse(localization);
			expect(result.components).toHaveLength(4);
		});
	});
});
