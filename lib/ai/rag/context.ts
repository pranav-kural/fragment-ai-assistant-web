import { getVectorStore } from './vector-store';

// Constants
const TOP_K = 10;

export default async function getContextData(query: string): Promise<string> {
	console.log('Processing query');
	// get vector store instance
	const vectorStore = await getVectorStore();
	console.log('Vector store instance retrieved');
	// perform similarity search and retrieve docs based on query
	// retrieve top k docs
	const retrievedDocs = await vectorStore.similaritySearch(query, TOP_K);
	console.log('Performed similarity search');
	// format retrieved docs
	const docsContent = retrievedDocs
		.map((doc) => doc.pageContent + '\n\n Metadata: ' + doc.metadata)
		.join('\n');
	console.log('Retrieved docs content');
	return docsContent;
}
