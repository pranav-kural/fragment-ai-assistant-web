import { motion } from 'framer-motion';
import Link from 'next/link';
import { Geist_Mono } from 'next/font/google';

import { MessageIcon, VercelIcon } from './icons';

const geistMono = Geist_Mono({
	subsets: ['latin'],
});

export const Overview = () => {
	return (
		<motion.div
			key="overview"
			className="max-w-3xl mx-auto md:mt-20"
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.98 }}
			transition={{ delay: 0.5 }}
		>
			<div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
				<p className="flex flex-row justify-center gap-4 items-center">
					<VercelIcon size={32} />
					<span>+</span>
					<MessageIcon size={32} />
				</p>
				<p>
					Get help with your queries related to{' '}
					<Link
						className="font-medium underline underline-offset-4 hover:text-blue-500"
						href="https://github.com/vercel/ai-chatbot"
						target="_blank"
					>
						<span className={`${geistMono.className}`}>
							FRAGMENT
						</span>
					</Link>{' '}
					.
				</p>
				<p className="text-md">
					This project demonstrates an{' '}
					<strong className="font-semibold">AI assistant</strong> for{' '}
					<strong className="font-semibold">
						FRAGMENT&apos;s documentation
					</strong>{' '}
					and presents a{' '}
					<strong className="font-semibold">
						Retrieval Augmented Generation (RAG)
					</strong>
					-based pipeline and workflow with{' '}
					<strong className="font-semibold">automation</strong> for
					handling source{' '}
					<strong className="font-semibold">data updates</strong>
					to ensure AI assistant can answer user queries related to
					the documentation{' '}
					<strong className="font-semibold">
						effectively
					</strong> and{' '}
					<strong className="font-semibold">accurately</strong>.
				</p>
				<p className="text-md">
					To learn more about how this project was developed,
					<br /> check{' '}
					<Link
						className="font-medium underline underline-offset-4 hover:text-blue-500"
						href="https://www.pkural.ca/blog/posts/fragment/"
						target="_blank"
					>
						Building AI Assistant for FRAGMENT documentation
					</Link>{' '}
					article.
				</p>
			</div>
		</motion.div>
	);
};
