import { PineconeStore } from '@langchain/pinecone';
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone';
import { getEmbeddingModel } from './embedding-model';

// Singleton instance for retriever
let vectorStore: PineconeStore | undefined;

/**
 * Function to get vector store instance.
 * @returns PineconeStore instance for vector store
 */
export async function getVectorStore(): Promise<PineconeStore> {
	// if vector store is not initialized, initialize it
	if (!vectorStore) {
		console.log('Initializing vector store');
		try {
			// Confirm environment variables are set
			if (
				!process.env.PINECONE_INDEX ||
				!process.env.PINECONE_HOST_URL ||
				!process.env.PINECONE_API_KEY
			) {
				throw new Error(
					'getVectorStore: Required environment variables are not set'
				);
			}

			// get embedding model
			const embeddings = getEmbeddingModel();

			// Initialize pinecone client
			const pinecone = new PineconeClient({
				apiKey: process.env.PINECONE_API_KEY!,
			});

			const pineconeIndex = pinecone.Index(
				process.env.PINECONE_INDEX!,
				process.env.PINECONE_HOST_URL!
			);

			// Initialize vector store
			vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
				pineconeIndex,
			});
			console.log('Vector store initialized');
		} catch (error) {
			throw new Error(`Unable to initialize vector store: ${error}`);
		}
	}
	// Return vector store instance
	return vectorStore;
}
