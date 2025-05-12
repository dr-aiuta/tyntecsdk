// http.ts ─── one tiny reusable wrapper
import {TyntecConfig} from './types';
import {RequestHttp} from './types';

export function requestHttp({
	apiKey,
	baseUrl = 'https://api.tyntec.com/conversations/v3',
	retry,
}: TyntecConfig): RequestHttp {
	return {
		async send(method: 'GET' | 'POST', endpoint: string, data?: unknown) {
			const res = await fetch(`${baseUrl}${endpoint}`, {
				method,
				headers: {'Content-Type': 'application/json', apikey: apiKey},
				body: data ? JSON.stringify(data) : undefined,
			});
			const jsonBody = await res.json();
			if (!res.ok)
				throw new Error(
					JSON.stringify({
						statusCode: res.status,
						statusText: res.statusText,
						data: jsonBody,
						endpoint,
					})
				);
			return {statusCode: res.status, statusText: res.statusText, data: jsonBody};
		},
	};
}
