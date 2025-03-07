import { tool } from 'ai';
import { z } from 'zod';
import getContextData from '../rag/context';

export const getContext = tool({
	description:
		'Retrieve context data required to understand the query and to provide a relevant response. Must use this tool.',
	parameters: z.object({
		query: z
			.string()
			.describe(
				'Query to be used for retrieval of similar data from vector store. Must consider current query and any past conversation history to formulate a query that is optimal for vector store search.'
			),
	}),
	execute: async ({ query }, { toolCallId, messages }) => {
		console.log(`Tool call ${toolCallId} with query: ${query}`);
		console.log(`Messages: ${JSON.stringify(messages)}`);
		try {
			const result = await getContextData(query);
			return { result };
		} catch (error) {
			console.error('Failed to get context data', error);
			throw error;
		}
	},
});
