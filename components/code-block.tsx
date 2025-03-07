'use client';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import graphql from 'react-syntax-highlighter/dist/esm/languages/prism/graphql';

import hljs from 'highlight.js';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('graphql', graphql);
SyntaxHighlighter.registerLanguage('bash', bash);

interface CodeBlockProps {
	node: any;
	inline: boolean;
	className: string;
	children: any;
}

export function CodeBlock({
	node,
	inline,
	className,
	children,
	...props
}: CodeBlockProps) {
	const SELECTED_HLJS_LANGUAGES = ['javascript', 'typescript', 'bash'];
	const res = hljs.highlightAuto(children, SELECTED_HLJS_LANGUAGES);
	const codeLanguage =
		res.language &&
		SELECTED_HLJS_LANGUAGES.includes(res.language) &&
		res.relevance > 8
			? res.language
			: res.relevance < 3
			? 'bash'
			: 'graphql';

	if (!inline) {
		return (
			<div
				{...props}
				className={`not-prose flex flex-col text-sm w-full overflow-x-auto bg-zinc-900 dark:bg-zinc-50 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-50`}
			>
				<SyntaxHighlighter language={codeLanguage} style={vscDarkPlus}>
					{children}
				</SyntaxHighlighter>
			</div>
		);
	} else {
		return (
			<div
				className={`${className} inline text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
				{...props}
			>
				{children}
			</div>
		);
	}
}
