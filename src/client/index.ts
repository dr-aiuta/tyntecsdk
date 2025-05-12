// src/tyntec/index.ts ─── public SDK surface
import {requestHttp} from './requestHttp';
import {createMessageApi} from './messages';
import {createTemplateApi} from './templates';
import {TyntecConfig} from './types';

export interface TyntecClient // façade for consumers
	extends ReturnType<typeof createMessageApi>,
		ReturnType<typeof createTemplateApi> {}

let cached: TyntecClient | null = null;

/** Initialise once (e.g. in app bootstrap) */
export function tyntecClient(cfg: TyntecConfig): TyntecClient {
	if (!cached) {
		const http = requestHttp(cfg); // cfg closes over every call
		cached = {
			...createMessageApi(http, cfg),
			...createTemplateApi(http, cfg),
		};
	}
	return cached!;
}

/** Safe getter anywhere in code */
export function tyntec(): TyntecClient | null {
	if (!cached) throw new Error('Call initTyntec() before first use');
	return cached;
}
