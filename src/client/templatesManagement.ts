// templatesManagement.ts ─── template management operations
import {RequestHttp, TyntecConfig} from './types';

export interface TemplateManagementApi {
	/**
	 * Deletes a WhatsApp template
	 * DELETE /channels/whatsapp/accounts/{accountId}/templates/{templateName}
	 * @param templateName - The template name to delete
	 * @param [idWhatsAppAccount] - The WhatsApp Account ID
	 * @returns The response data from the API
	 */
	deleteTemplate: (templateName: string, idWhatsAppAccount?: string) => Promise<any>;

	/**
	 * Lists all localizations for a template
	 * GET /channels/whatsapp/accounts/{accountId}/templates/{templateName}/localizations
	 * @param templateName - The template name
	 * @param [idWhatsAppAccount] - The WhatsApp Account ID
	 * @returns The response data from the API
	 */
	listLocalizations: (templateName: string, idWhatsAppAccount?: string) => Promise<any>;

	/**
	 * Edits an existing template (partial update)
	 * PATCH /channels/whatsapp/accounts/{accountId}/templates/{templateName}
	 * @param templateName - The template name to edit
	 * @param updates - The updates to apply (see API docs for structure)
	 * @param [idWhatsAppAccount] - The WhatsApp Account ID
	 * @returns The response data from the API
	 */
	editTemplate: (
		templateName: string,
		localizationLanguage: string,
		updates: any,
		idWhatsAppAccount?: string
	) => Promise<any>;
}

export function createTemplateManagementApi(requestHttp: RequestHttp, cfg: TyntecConfig): TemplateManagementApi {
	const {idWhatsAppAccount: idDefaultWhatsAppAccount} = cfg;
	return {
		async deleteTemplate(templateName: string, idWhatsAppAccount?: string): Promise<any> {
			const idAccount = idWhatsAppAccount ?? idDefaultWhatsAppAccount;
			return requestHttp.send('DELETE', `/channels/whatsapp/accounts/${idAccount}/templates/${templateName}`);
		},

		async listLocalizations(templateName: string, idWhatsAppAccount?: string): Promise<any> {
			const idAccount = idWhatsAppAccount ?? idDefaultWhatsAppAccount;
			return requestHttp.send(
				'GET',
				`/channels/whatsapp/accounts/${idAccount}/templates/${templateName}/localizations`
			);
		},

		async editTemplate(
			templateName: string,
			localizationLanguage: string,
			updates: any,
			idWhatsAppAccount?: string
		): Promise<any> {
			const idAccount = idWhatsAppAccount ?? idDefaultWhatsAppAccount;
			return requestHttp.send(
				'PATCH',
				`/channels/whatsapp/accounts/${idAccount}/templates/${templateName}/${localizationLanguage}`,
				updates
			);
		},
	};
}
