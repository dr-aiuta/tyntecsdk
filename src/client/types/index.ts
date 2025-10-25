export type TyntecConfig = {
	apiKey: string;
	baseUrl?: string;
	idWhatsAppAccount?: string;
	retry?: {attempts: number; backoffMs: number};
};

export interface RequestHttp {
	send: (method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', endpoint: string, body?: unknown) => Promise<unknown>;
}
