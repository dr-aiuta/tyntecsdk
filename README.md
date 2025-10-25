# Tyntec SDK

A TypeScript SDK for the Tyntec Conversations API V3, making it easy to send WhatsApp messages using various content types and manage WhatsApp templates.

## Requirements

- Node.js >= 20.0.0

## Installation

```bash
npm install tyntec-sdk
```

## Usage

First, import and initialize the client:

```typescript
import {tyntecClient} from 'tyntec-sdk';

const client = tyntecClient({apiKey: 'your-api-key'});
```

### Sending Text Messages

```typescript
await client.sendTextMessage(
	'1234567890', // from
	'0987654321', // to
	'Hello, World!' // text
);
```

### Sending Media Messages

```typescript
// Send an image
await client.sendImageMessage('1234567890', '0987654321', 'https://example.com/image.jpg', 'Optional caption');

// Send a video
await client.sendVideoMessage('1234567890', '0987654321', 'https://example.com/video.mp4', 'Optional caption');

// Send a document
await client.sendDocumentMessage(
	'1234567890',
	'0987654321',
	'https://example.com/document.pdf',
	'Optional caption',
	'document.pdf'
);

// Send an audio message
await client.sendAudioMessage('1234567890', '0987654321', 'https://example.com/audio.mp3');

// Send a sticker
await client.sendStickerMessage('1234567890', '0987654321', 'https://example.com/sticker.webp');
```

### Sending Template Messages

```typescript
await client.sendTemplateMessage('1234567890', '0987654321', 'your_template_id', 'en', {
	header: [
		{type: 'text', text: 'Header text'},
		// or { type: 'image', image: { url: 'https://example.com/header.jpg' } }, etc.
	],
	body: [
		{type: 'text', text: 'John'},
		{type: 'text', text: '123456'},
	],
	button: [
		{type: 'quick_reply', index: 0, payload: 'YES'},
		{type: 'quick_reply', index: 1, payload: 'NO'},
		// or { type: 'url', index: 2, text: 'Visit' }
	],
});
```

### Sending Custom WhatsApp Messages

For advanced use cases, you can send any valid WhatsApp message object (validated against the schema):

```typescript
import type {Message} from 'tyntec-sdk';

const message: Message = {
	from: '1234567890',
	to: '0987654321',
	channel: 'whatsapp',
	content: {
		contentType: 'text',
		text: 'Hello from a custom message!',
	},
};

await client.sendWhatsAppMessage(message);
```

---

## Managing WhatsApp Templates

You can manage WhatsApp message templates using the following methods:

### List Templates

```typescript
const res = await client.listTemplates('yourAccountId');
console.log(res.data); // Array of templates
```

### Get a Template

```typescript
const res = await client.getTemplate('templateName', 'yourAccountId');
console.log(res.data); // Template details
```

### Create a Template

```typescript
const templatePayload = {
	name: 'newTemplate',
	language: 'en',
	// ...other template fields
};
const res = await client.createTemplate(templatePayload, 'yourAccountId');
console.log(res.data); // Created template info
```

### Add a Template Localization

```typescript
const localizationPayload = {
	language: 'es',
	body: 'Hola',
	// ...other localization fields
};
const res = await client.addTemplateLocalization('templateName', localizationPayload, 'yourAccountId');
console.log(res.data); // Success info
```

### List Template Localizations

```typescript
const res = await client.listLocalizations('templateName', 'yourAccountId');
console.log(res.data); // Array of localizations for the template
```

### Edit a Template

```typescript
const updates = {
	category: 'MARKETING',
	components: [
		{
			type: 'BODY',
			text: 'Updated body text with {{1}} placeholder',
		},
	],
};
const res = await client.editTemplate('templateName', 'en', updates, 'yourAccountId');
console.log(res.data); // Updated template info
```

### Delete a Template

```typescript
const res = await client.deleteTemplate('templateName', 'yourAccountId');
console.log(res.data); // Deletion confirmation
```

---

## API Reference

### tyntecClient

The main function for initializing the Tyntec API client.

#### Initialization

```typescript
import {tyntecClient} from 'tyntec-sdk';
const client = tyntecClient({apiKey: 'your-api-key', baseUrl: string});
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
- `sendTemplateMessage(from: string, to: string, templateId: string, templateLanguage: string, components: TemplateComponents)`
- `sendWhatsAppMessage(message: Message)` — Validates and sends any WhatsApp message object
- `sendMessage(message: Message)` — Sends any message object (no validation)
- `listTemplates(accountId: string)` — List all WhatsApp templates for an account
- `getTemplate(templateName: string, accountId: string)` — Get a specific WhatsApp template
- `createTemplate(templatePayload: object, accountId: string)` — Create a new WhatsApp template
- `addTemplateLocalization(templateName: string, localizationPayload: object, accountId: string)` — Add a localization to a template
- `listLocalizations(templateName: string, accountId?: string)` — List all localizations for a specific template
- `editTemplate(templateName: string, localizationLanguage: string, updates: object, accountId?: string)` — Edit an existing template (partial update)
- `deleteTemplate(templateName: string, accountId?: string)` — Delete a WhatsApp template

#### Types

The SDK exports TypeScript types for all message structures, including `Message`, `TemplateComponent`, and more, for advanced usage and type safety.

## Error Handling

The SDK throws errors when:

- The API request fails (non-2xx status code)
- The API returns a non-200 status code
- Required parameters are missing
- The message object fails validation (for `sendWhatsAppMessage`)

Example error handling:

```typescript
try {
	await client.sendTextMessage(from, to, text);
} catch (error) {
	console.error('Failed to send message:', error);
}
```

## Contributing

This SDK is open source and welcomes contributions from the community! If you have ideas, bug fixes, or new features, feel free to open an issue or submit a pull request.

Whether you're fixing a typo, improving documentation, or adding new functionality, your help is appreciated. See the repository for guidelines and details.

**Let's make messaging easier together!**

## License

MIT
