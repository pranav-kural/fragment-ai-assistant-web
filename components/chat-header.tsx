'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';
import { Geist_Mono } from 'next/font/google';

import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, GitIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { VisibilityType, VisibilitySelector } from './visibility-selector';

const geistMono = Geist_Mono({
	subsets: ['latin'],
});

function PureChatHeader({
	chatId,
	selectedModelId,
	selectedVisibilityType,
	isReadonly,
}: {
	chatId: string;
	selectedModelId: string;
	selectedVisibilityType: VisibilityType;
	isReadonly: boolean;
}) {
	const router = useRouter();
	const { open, setOpenMobile } = useSidebar();

	const { width: windowWidth } = useWindowSize();

	return (
		<header className="flex flex-col sticky top-0 bg-neutral-100 dark:bg-zinc-950 py-1.5 items-center px-2 md:px-2 gap-2">
			<Link
				href="/"
				onClick={() => {
					setOpenMobile(false);
				}}
				className="flex flex-col gap-1 w-full text-center lg:mr-[250px] xs:hidden px-2 hover:bg-muted rounded-md cursor-pointer"
			>
				<span
					className={`${geistMono.className} text-lg font-semibold px-2 hover:bg-muted`}
				>
					FRAGMENT AI Assistant
				</span>
			</Link>

			<div className="xs:w-unset w-full flex sticky top-0 items-center gap-2">
				<SidebarToggle />

				{(!open || windowWidth < 768) && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-0"
								onClick={() => {
									router.push('/');
									router.refresh();
								}}
							>
								<PlusIcon />
								<span className="md:sr-only">New Chat</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>New Chat</TooltipContent>
					</Tooltip>
				)}

				{!isReadonly && (
					<ModelSelector
						selectedModelId={selectedModelId}
						className="order-1 md:order-2"
					/>
				)}

				{!isReadonly && (
					<VisibilitySelector
						chatId={chatId}
						selectedVisibilityType={selectedVisibilityType}
						className="order-1 md:order-3"
					/>
				)}

				<Link
					href="/"
					onClick={() => {
						setOpenMobile(false);
					}}
					className="text-right px-2 w-full order-4 lg:text-center lg:block lg:mr-[250px] hidden xs:block rounded-md cursor-pointer"
				>
					<span
						className={`${geistMono.className} text-lg font-semibold px-2 hover:bg-muted`}
					>
						FRAGMENT AI Assistant
					</span>
				</Link>

				<Button
					className="bg-zinc-700 dark:bg-zinc-300 hover:bg-zinc-900 hover:shadow-md dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-5 md:ml-auto md:mr-5"
					asChild
				>
					<Link
						href="https://github.com/pranav-kural/fragment-ai-assistant-web"
						target="_noblank"
					>
						<GitIcon />
					</Link>
				</Button>
			</div>
		</header>
	);
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
	return prevProps.selectedModelId === nextProps.selectedModelId;
});
