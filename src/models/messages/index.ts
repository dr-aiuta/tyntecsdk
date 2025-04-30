import {registerSchemas} from '../validator/registry';
import {messageSchema} from './base.schema';
import {
	mediaMessageSchema,
	textMessageSchema,
	locationMessageSchema,
	contactsMessageSchema,
	reactionMessageSchema,
	templateMessageSchema,
	interactiveMessageSchema,
} from './whatsapp';

// Register all message schemas
registerSchemas([
	{name: 'message', schema: messageSchema},
	{name: 'whatsapp.message', schema: messageSchema},
	{name: 'whatsapp.media', schema: mediaMessageSchema},
	{name: 'whatsapp.text', schema: textMessageSchema},
	{name: 'whatsapp.location', schema: locationMessageSchema},
	{name: 'whatsapp.contacts', schema: contactsMessageSchema},
	{name: 'whatsapp.reaction', schema: reactionMessageSchema},
	{name: 'whatsapp.template', schema: templateMessageSchema},
	{name: 'whatsapp.interactive', schema: interactiveMessageSchema},
]);

// Export all schemas
export * from './base.schema';
export * from './whatsapp';
