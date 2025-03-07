/**
 * Type interface for chat models
 */
interface ChatModel {
	id: string;
	name: string;
	description: string;
}

// Default chat model
export const DEFAULT_CHAT_MODEL: string = 'gpt-4o-mini';

/**
 * Array of chat models.
 * These will be visible to the user in the UI in the
 * model selector dropdown.
 */
export const chatModels: Array<ChatModel> = [
	{
		id: 'gpt-4o-mini',
		name: 'GPT-4o mini',
		description: 'OpenAI GPT-4o mini model',
	},
	{
		id: 'gpt-4o',
		name: 'GPT-4o',
		description: 'OpenAI GPT-4o model',
	},
	{
		id: 'gemini-2.0-flash-001',
		name: 'Gemini 2.0 Flash 001',
		description: 'Google Gemini 2.0 Flash 001 model',
	},
	{
		id: 'gemini-2.0-pro',
		name: 'Gemini 2.0 Pro',
		description: 'Google Gemini 2.0 Pro model',
	},
];
