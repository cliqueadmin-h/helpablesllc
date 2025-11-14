import ReactMarkdown from 'react-markdown';

interface CMSRendererProps {
  content: string;
  className?: string;
}

export default function CMSRenderer({ content, className = '' }: CMSRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-heading font-bold text-dark dark:text-white mb-6 mt-8 first:mt-0" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-heading font-semibold text-dark dark:text-white mb-4 mt-8" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-heading font-semibold text-dark dark:text-white mb-3 mt-6" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-xl font-heading font-semibold text-dark dark:text-white mb-2 mt-4" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside ml-6 mb-6 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside ml-6 mb-6 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary dark:text-secondary hover:text-primary-dark dark:hover:text-secondary/80 underline font-medium" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary dark:border-secondary pl-6 py-2 my-6 italic text-gray-600 dark:text-gray-400 bg-light dark:bg-gray-700/50 rounded-r" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-light-gray dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-primary dark:text-secondary" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto mb-6 border border-gray-700" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-dark dark:text-white" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-gray-700 dark:text-gray-300" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-gray-300 dark:border-gray-600 my-8" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="rounded-lg shadow-md my-6 w-full" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
