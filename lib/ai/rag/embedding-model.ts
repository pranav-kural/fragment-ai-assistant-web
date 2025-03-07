import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { TaskType } from './google-gen-ai';

// Set default model provider: `google` or `openai`
type ModelProvider = 'google' | 'openai';
const DEFAULT_MODEL_PROVIDER: ModelProvider = 'google';

// Constants
const DEFAULT_GOOGLE_EMBEDDING_MODEL_NAME = 'text-embedding-004';
const DEFAULT_OPENAI_EMBEDDING_MODEL_NAME = 'text-embedding-3-small';

// Singleton embedding model instance
let embeddingModel: GoogleGenerativeAIEmbeddings | OpenAIEmbeddings | undefined;

/**
 * Function to get embedding model instance.
 * If no provider is provided, default provider is used.
 * @param provider - Model provider: `google` or `openai`
 * @returns Embeddings instance for embedding model
 */
export function getEmbeddingModel(
	provider?: ModelProvider
): GoogleGenerativeAIEmbeddings | OpenAIEmbeddings {
	// if embedding model is not initialized, initialize it
	if (!embeddingModel) {
		try {
			// Validate API Key
			if (!process.env.GOOGLE_API_KEY) {
				throw new Error(
					'getEmbeddingModel: Google GenAI API Key is not set'
				);
			}
			// set provider if not provided
			provider = provider || DEFAULT_MODEL_PROVIDER;
			// Initialize embedding model
			if (provider === 'google') {
				embeddingModel = new GoogleGenerativeAIEmbeddings({
					model: DEFAULT_GOOGLE_EMBEDDING_MODEL_NAME,
					taskType: TaskType.RETRIEVAL_QUERY,
				});
			} else {
				// Validate API Key
				if (!process.env.OPENAI_API_KEY) {
					throw new Error(
						'getEmbeddingModel: OpenAI API Key is not set'
					);
				}
				// Initialize embedding model
				embeddingModel = new OpenAIEmbeddings({
					apiKey: process.env.OPENAI_API_KEY,
					model: DEFAULT_OPENAI_EMBEDDING_MODEL_NAME,
				});
			}
		} catch (error) {
			throw new Error(`Unable to initialize embedding model: ${error}`);
		}
	}
	// Return embedding model instance
	return embeddingModel;
}
