import ReactMarkdown from 'react-markdown'

interface MarkdownRendererProps {
    content: string
    className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div className={`prose prose-sm max-w-none ${className}`}>
            <ReactMarkdown
                components={{
                    // Custom styling for markdown elements
                    h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-gray-900 mb-3 mt-4 first:mt-0">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-3 first:mt-0">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-base font-semibold text-gray-900 mb-2 mt-2 first:mt-0">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="text-gray-800 mb-2 last:mb-0">
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside text-gray-800 mb-2 space-y-1">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-gray-800 mb-2 space-y-1">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-gray-800">
                            {children}
                        </li>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                            {children}
                        </strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic text-gray-800">
                            {children}
                        </em>
                    ),
                    code: ({ children }) => (
                        <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                            {children}
                        </code>
                    ),
                    pre: ({ children }) => (
                        <pre className="bg-gray-100 text-gray-800 p-3 rounded-lg overflow-x-auto text-sm font-mono mb-2">
                            {children}
                        </pre>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-2">
                            {children}
                        </blockquote>
                    ),
                    hr: () => (
                        <hr className="border-gray-300 my-4" />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
