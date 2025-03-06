'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Geist_Mono } from 'next/font/google';
import { SquareArrowOutUpRight } from 'lucide-react';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const geistMono = Geist_Mono({
	subsets: ['latin'],
});

export function AppSidebar({ user }: { user: User | undefined }) {
	const router = useRouter();
	const { setOpenMobile } = useSidebar();

	return (
		<Sidebar className="group-data-[side=left]:border-r-0">
			<SidebarHeader>
				<SidebarMenu>
					<div className="flex flex-row justify-between items-center">
						<div className="w-full flex flex-col gap-2">
							<span className="text-md font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
								History
							</span>
						</div>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									type="button"
									className="p-2 h-fit"
									onClick={() => {
										setOpenMobile(false);
										router.push('/');
										router.refresh();
									}}
								>
									<PlusIcon />
								</Button>
							</TooltipTrigger>
							<TooltipContent align="end">
								New Chat
							</TooltipContent>
						</Tooltip>
					</div>
					<Link
						href="https://fragment.dev/docs"
						className="flex flex-row gap-1 px-2 hover:text-emerald-700 cursor-pointer"
						target="_blank"
					>
						<span className={`${geistMono.className} text-sm`}>
							FRAGMENT docs
						</span>
						<SquareArrowOutUpRight size={16} />
					</Link>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarHistory user={user} />
			</SidebarContent>
			<SidebarFooter>
				{user && <SidebarUserNav user={user} />}
			</SidebarFooter>
		</Sidebar>
	);
}
