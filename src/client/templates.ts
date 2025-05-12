// templates.ts ─── template management only
import {RequestHttp, TyntecConfig} from './types';

export interface TemplateApi {
	/**
	 * Lists all WhatsApp templates for an account
	 * @param [idWhatsAppAccount] - The WhatsApp Account ID
	 * @returns The response data from the API
	 */
	listTemplates: (idWhatsAppAccount?: string) => Promise<any>;
	/**
	 * Gets a specific WhatsApp template by name
	 * @param templateName - The template name
	 * @param [idWhatsAppAccount] - The WhatsApp Account ID
	 * @returns The response data from the API
	 */
	getTemplate: (templateName: string, idWhatsAppAccount?: string) => Promise<any>;
	/**
	 * Creates a new WhatsApp template
	 * @param template - The template payload (see API docs for structure)
	 * @param [idWhatsAppAccount] - The WhatsApp Account ID
	 * @returns The response data from the API
	 */
	createTemplate: (template: any, idWhatsAppAccount?: string) => Promise<any>;

	/**
	 * Adds a localization to an existing WhatsApp template
	 * @param templateName - The template name
	 * @param localization - The localization payload (see API docs for structure)
	 * @param [idWhatsAppAccount] - The WhatsApp Account ID
	 * @returns The response data from the API
	 */
	addTemplateLocalization: (templateName: string, localization: any, idWhatsAppAccount?: string) => Promise<any>;
}

export function createTemplateApi(requestHttp: RequestHttp, cfg: TyntecConfig): TemplateApi {
	const {idWhatsAppAccount: idDefaultWhatsAppAccount} = cfg;
	return {
		async listTemplates(idWhatsAppAccount?: string): Promise<any> {
			const idAccount = idWhatsAppAccount ?? idDefaultWhatsAppAccount;
			return requestHttp.send('GET', `/channels/whatsapp/accounts/${idAccount}/templates`);
		},

		async getTemplate(templateName: string, idWhatsAppAccount?: string): Promise<any> {
			const idAccount = idWhatsAppAccount ?? idDefaultWhatsAppAccount;
			return requestHttp.send('GET', `/channels/whatsapp/accounts/${idAccount}/templates/${templateName}`);
		},
		async createTemplate(template: any, idWhatsAppAccount?: string): Promise<any> {
			const idAccount = idWhatsAppAccount ?? idDefaultWhatsAppAccount;
			return requestHttp.send('POST', `/channels/whatsapp/accounts/${idAccount}/templates`, template);
		},

		async addTemplateLocalization(templateName: string, localization: any, idWhatsAppAccount?: string): Promise<any> {
			const idAccount = idWhatsAppAccount ?? idDefaultWhatsAppAccount;
			return requestHttp.send(
				'POST',
				`/channels/whatsapp/accounts/${idAccount}/templates/${templateName}/localizations`,
				localization
			);
		},
	};
}
