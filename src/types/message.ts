// Types for message content
interface BaseContent {
	contentType: string;
}

interface TextContent extends BaseContent {
	contentType: 'text';
	text: string;
}

interface ImageContent extends BaseContent {
	contentType: 'image';
	image: {
		url: string;
		caption?: string;
	};
}

interface VideoContent extends BaseContent {
	contentType: 'video';
	video: {
		url: string;
		caption?: string;
	};
}

interface DocumentContent extends BaseContent {
	contentType: 'document';
	document: {
		url: string;
		caption?: string;
		filename?: string;
	};
}

interface AudioContent extends BaseContent {
	contentType: 'audio';
	audio: {
		url: string;
	};
}

interface StickerContent extends BaseContent {
	contentType: 'sticker';
	sticker: {
		url: string;
	};
}

interface TemplateComponent {
	type: 'text' | 'quick_reply';
	text?: string;
	index?: number;
	payload?: string;
}

interface TemplateContent extends BaseContent {
	contentType: 'template';
	template: {
		templateId: string;
		templateLanguage: string;
		components: {
			body?: TemplateComponent[];
			button?: TemplateComponent[];
		};
	};
}

interface InteractiveComponent {
	type: 'text' | 'quick_reply';
	text?: string;
	index?: number;
	payload?: string;
}

interface InteractiveContent extends BaseContent {
	contentType: 'interactive';
	interactive: {
		subType: 'buttons' | 'list' | 'product' | 'productList';
		components: InteractiveComponent[];
	};
}
export type MessageContent =
	| TextContent
	| ImageContent
	| VideoContent
	| DocumentContent
	| AudioContent
	| StickerContent
	| TemplateContent
	| InteractiveContent;

export interface Message {
	from: string;
	to: string;
	channel: 'whatsapp';
	content: MessageContent;
}

export type {TemplateComponent};
export type {InteractiveComponent};
