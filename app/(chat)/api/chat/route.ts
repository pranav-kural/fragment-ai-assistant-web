import {
	type Message,
	createDataStreamResponse,
	smoothStream,
	streamText,
} from 'ai';
import { auth } from '@/app/(auth)/auth';
import { RAGPrompt } from '@/lib/ai/prompts';
import {
	deleteChatById,
	getChatById,
	saveChat,
	saveMessages,
} from '@/lib/db/queries';
import {
	generateUUID,
	getMostRecentUserMessage,
	sanitizeResponseMessages,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { getContext } from '@/lib/ai/tools/get-context';
import { isProductionEnvironment } from '@/lib/constants';
import { NextResponse } from 'next/server';
import { myProvider } from '@/lib/ai/providers';

export const maxDuration = 60;

export async function POST(request: Request) {
	try {
		const {
			id,
			messages,
			selectedChatModel,
		}: {
			id: string;
			messages: Array<Message>;
			selectedChatModel: string;
		} = await request.json();

		const session = await auth();

		if (!session || !session.user || !session.user.id) {
			return new Response('Unauthorized', { status: 401 });
		}
		console.log('User authorized');

		const userMessage = getMostRecentUserMessage(messages);

		if (!userMessage) {
			return new Response('No user message found', { status: 400 });
		}
		console.log('User message found:', userMessage);

		const chat = await getChatById({ id });

		if (!chat) {
			console.log('Chat not found');
			console.log('Creating new chat');
			const title = await generateTitleFromUserMessage({
				message: userMessage,
			});

			await saveChat({ id, userId: session.user.id, title });

			console.log('Chat created');
		} else {
			if (chat.userId !== session.user.id) {
				return new Response('Unauthorized', { status: 401 });
			}
		}

		await saveMessages({
			messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
		});
		console.log('User message saved');

		return createDataStreamResponse({
			execute: (dataStream) => {
				const result = streamText({
					model: myProvider.languageModel(selectedChatModel),
					system: RAGPrompt,
					messages,
					maxSteps: 3,
					experimental_activeTools: ['getContext'],
					experimental_transform: smoothStream({ chunking: 'word' }),
					experimental_generateMessageId: generateUUID,
					tools: {
						getContext,
					},
					onFinish: async ({ response, reasoning }) => {
						if (session.user?.id) {
							try {
								const sanitizedResponseMessages =
									sanitizeResponseMessages({
										messages: response.messages,
										reasoning,
									});

								await saveMessages({
									messages: sanitizedResponseMessages.map(
										(message) => {
											return {
												id: message.id,
												chatId: id,
												role: message.role,
												content: message.content,
												createdAt: new Date(),
											};
										}
									),
								});
							} catch (error) {
								console.error('Failed to save chat');
							}
						}
					},
					experimental_telemetry: {
						isEnabled: isProductionEnvironment,
						functionId: 'stream-text',
					},
				});

				result.consumeStream();

				result.mergeIntoDataStream(dataStream, {
					sendReasoning: true,
				});
			},
			onError: () => {
				return 'Oops, an error occured!';
			},
		});
	} catch (error) {
		return NextResponse.json({ error }, { status: 400 });
	}
}

export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	if (!id) {
		return new Response('Not Found', { status: 404 });
	}

	const session = await auth();

	if (!session || !session.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const chat = await getChatById({ id });

		if (chat.userId !== session.user.id) {
			return new Response('Unauthorized', { status: 401 });
		}

		await deleteChatById({ id });

		return new Response('Chat deleted', { status: 200 });
	} catch (error) {
		return new Response('An error occurred while processing your request', {
			status: 500,
		});
	}
}
