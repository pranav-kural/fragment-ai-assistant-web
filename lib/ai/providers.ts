import { customProvider } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { isTestEnvironment } from '../constants';
import { chatModel } from './models.test';

if (process.env.GOOGLE_API_KEY === undefined) {
	throw new Error('GOOGLE_API_KEY is not defined');
}

const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_API_KEY,
});

export const myProvider = isTestEnvironment
	? customProvider({
			languageModels: {
				'gpt-4o-mini': chatModel,
				'gpt-4o': chatModel,
				'gemini-2.0-flash-001': chatModel,
				'gemini-2.0-pro': chatModel,
				'chat-history-title-model': chatModel,
			},
	  })
	: customProvider({
			languageModels: {
				'gpt-4o-mini': openai('gpt-4o-mini'),
				'gpt-4o': openai('gpt-4o'),
				'gemini-2.0-flash-001': google('gemini-2.0-flash-001'),
				'gemini-2.0-pro': google('gemini-2.0-pro-exp-02-05'),
				'chat-history-title-model': google('gemini-2.0-flash-001'),
			},
	  });
