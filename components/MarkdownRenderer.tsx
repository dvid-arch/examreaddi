import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      className="prose prose-slate max-w-none prose-p:text-slate-700 prose-li:text-slate-700"
      components={{
        table: ({node, ...props}) => (
          <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg">
            <table className="w-full text-sm" {...props} />
          </div>
        ),
        thead: ({node, ...props}) => <thead className="bg-slate-50" {...props} />,
        th: ({node, ...props}) => <th className="border-b border-slate-200 p-3 text-left font-semibold text-slate-800" {...props} />,
        tr: ({node, ...props}) => <tr className="border-b border-slate-200 last:border-b-0" {...props} />,
        td: ({node, ...props}) => <td className="p-3 align-top" {...props} />,
        code({node, inline, className, children, ...props}) {
            return !inline ? (
                <pre className="block bg-gray-800 text-white p-4 rounded-lg my-4 overflow-x-auto text-sm" {...props}>
                    <code>{children}</code>
                </pre>
            ) : (
                <code className="bg-gray-200 text-emerald-700 font-mono px-1.5 py-1 rounded text-sm" {...props}>
                    {children}
                </code>
            );
        },
        a: ({node, ...props}) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
      }}
    />
  );
};

export default MarkdownRenderer;