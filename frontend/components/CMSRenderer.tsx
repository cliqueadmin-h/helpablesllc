import ReactMarkdown from 'react-markdown';

interface CMSRendererProps {
  content: string;
  className?: string;
}

export default function CMSRenderer({ content, className = '' }: CMSRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-heading font-bold text-dark mb-6" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-heading font-semibold text-dark mb-4 mt-8" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-heading font-semibold text-dark mb-3 mt-6" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 mb-4 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-700" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary hover:text-primary-dark underline" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-light-gray px-2 py-1 rounded text-sm font-mono" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
