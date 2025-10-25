// http.ts ─── one tiny reusable wrapper
import {TyntecConfig} from './types';
import {RequestHttp} from './types';

export function requestHttp({
	apiKey,
	baseUrl = 'https://api.tyntec.com/conversations/v3',
	retry,
}: TyntecConfig): RequestHttp {
	return {
		async send(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', endpoint: string, data?: unknown) {
			const res = await fetch(`${baseUrl}${endpoint}`, {
				method,
				headers: {'Content-Type': 'application/json', apikey: apiKey},
				body: data ? JSON.stringify(data) : undefined,
			});

			// Try to parse JSON response, but handle cases where it's not JSON or parsing fails
			let jsonBody;
			try {
				const contentType = res.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					jsonBody = await res.json();
				} else {
					// If not JSON, try to get text
					const text = await res.text();
					jsonBody = text || null;
				}
			} catch (error) {
				// If parsing fails, try to get text as fallback
				try {
					const text = await res.text();
					jsonBody = text || null;
				} catch {
					jsonBody = null;
				}
			}

			if (!res.ok) {
				throw new Error(
					JSON.stringify({
						statusCode: res.status,
						statusText: res.statusText,
						data: jsonBody,
						endpoint,
					})
				);
			}

			return {statusCode: res.status, statusText: res.statusText, data: jsonBody};
		},
	};
}
