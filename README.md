# tyntecsdk# Tyntec Conversations SDK

A TypeScript SDK for the Tyntec Conversations API V3, making it easy to send WhatsApp messages using various content types.

## Installation

```bash
npm install tyntec-conversations-sdk
```

## Usage

First, import and initialize the client:

```typescript
import {TyntecClient} from 'tyntec-conversations-sdk';

const client = new TyntecClient('your-api-key');
```

### Sending Text Messages

```typescript
await client.sendTextMessage(
	'whatsapp:+1234567890', // from
	'whatsapp:+0987654321', // to
	'Hello, World!' // text
);
```

### Sending Media Messages

```typescript
// Send an image
await client.sendImageMessage(
	'whatsapp:+1234567890',
	'whatsapp:+0987654321',
	'https://example.com/image.jpg',
	'Optional caption'
);

// Send a video
await client.sendVideoMessage(
	'whatsapp:+1234567890',
	'whatsapp:+0987654321',
	'https://example.com/video.mp4',
	'Optional caption'
);

// Send a document
await client.sendDocumentMessage(
	'whatsapp:+1234567890',
	'whatsapp:+0987654321',
	'https://example.com/document.pdf',
	'Optional caption',
	'document.pdf'
);

// Send an audio message
await client.sendAudioMessage('whatsapp:+1234567890', 'whatsapp:+0987654321', 'https://example.com/audio.mp3');

// Send a sticker
await client.sendStickerMessage('whatsapp:+1234567890', 'whatsapp:+0987654321', 'https://example.com/sticker.webp');
```

### Sending Template Messages

```typescript
await client.sendTemplateMessage(
	'whatsapp:+1234567890',
	'whatsapp:+0987654321',
	'your_template_id',
	'en',
	[
		{type: 'text', text: 'John'},
		{type: 'text', text: '123456'},
	],
	[
		{type: 'quick_reply', text: 'Yes', payload: 'YES'},
		{type: 'quick_reply', text: 'No', payload: 'NO'},
	]
);
```

## API Reference

### TyntecClient

The main class for interacting with the Tyntec API.

#### Constructor

```typescript
constructor(apiKey: string, baseUrl?: string)
```

- `apiKey`: Your Tyntec API key
- `baseUrl`: Optional base URL for the API (defaults to 'https://api.tyntec.com/conversations/v3')

#### Methods

All methods return a Promise that resolves to the API response.

- `sendTextMessage(from: string, to: string, text: string)`
- `sendImageMessage(from: string, to: string, url: string, caption?: string)`
- `sendVideoMessage(from: string, to: string, url: string, caption?: string)`
- `sendDocumentMessage(from: string, to: string, url: string, caption?: string, filename?: string)`
- `sendAudioMessage(from: string, to: string, url: string)`
- `sendStickerMessage(from: string, to: string, url: string)`
- `sendTemplateMessage(from: string, to: string, templateId: string, templateLanguage: string, bodyComponents?: TemplateComponent[], buttonComponents?: TemplateComponent[])`

## Error Handling

The SDK throws errors when:

- The API request fails
- The API returns a non-200 status code
- Required parameters are missing

Example error handling:

```typescript
try {
	await client.sendTextMessage(from, to, text);
} catch (error) {
	console.error('Failed to send message:', error);
}
```

## License

MIT
