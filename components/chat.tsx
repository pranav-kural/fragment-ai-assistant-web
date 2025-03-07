'use client';

import type { Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import type { VisibilityType } from './visibility-selector';
import { toast } from 'sonner';
import { Geist_Mono } from 'next/font/google';
import Link from 'next/link';

const geistMono = Geist_Mono({
	subsets: ['latin'],
});

export function Chat({
	id,
	initialMessages,
	selectedChatModel,
	selectedVisibilityType,
	isReadonly,
}: {
	id: string;
	initialMessages: Array<Message>;
	selectedChatModel: string;
	selectedVisibilityType: VisibilityType;
	isReadonly: boolean;
}) {
	const { mutate } = useSWRConfig();

	const {
		messages,
		setMessages,
		handleSubmit,
		input,
		setInput,
		append,
		isLoading,
		stop,
		reload,
	} = useChat({
		id,
		body: { id, selectedChatModel: selectedChatModel },
		initialMessages,
		experimental_throttle: 100,
		sendExtraMessageFields: true,
		generateId: generateUUID,
		onFinish: () => {
			mutate('/api/history');
		},
		onError: () => {
			toast.error('An error occured, please try again!');
		},
	});

	const { data: votes } = useSWR<Array<Vote>>(
		`/api/vote?chatId=${id}`,
		fetcher
	);

	return (
		<>
			<div className="flex flex-col min-w-0 h-dvh bg-neutral-100 dark:bg-zinc-950">
				<ChatHeader
					chatId={id}
					selectedModelId={selectedChatModel}
					selectedVisibilityType={selectedVisibilityType}
					isReadonly={isReadonly}
				/>

				<Messages
					chatId={id}
					isLoading={isLoading}
					votes={votes}
					messages={messages}
					setMessages={setMessages}
					reload={reload}
					isReadonly={isReadonly}
				/>

				<form className="flex mx-auto px-4 pb-2 gap-2 w-full md:max-w-3xl">
					{!isReadonly && (
						<MultimodalInput
							chatId={id}
							input={input}
							setInput={setInput}
							handleSubmit={handleSubmit}
							isLoading={isLoading}
							stop={stop}
							messages={messages}
							setMessages={setMessages}
							append={append}
						/>
					)}
				</form>

				<p className="w-full text-center text-xs pb-2 md:pb-4">
					This is a restricted chat. You will only be able to converse
					about{' '}
					<span className={`${geistMono.className} font-semibold`}>
						FRAGMENT
					</span>{' '}
					. Learn more about this project{' '}
					<Link
						className="font-medium hover:text-blue-500 underline underline-offset-2"
						href="https://www.pkural.ca/blog/posts/fragment/"
						target="_blank"
					>
						here
					</Link>
					.
				</p>
			</div>
		</>
	);
}
