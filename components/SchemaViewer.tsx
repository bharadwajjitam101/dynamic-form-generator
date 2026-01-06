'use client';

import { useState } from 'react';
import { FormSchema } from '@/lib/types';
import { ChevronDown, ChevronUp, Code2, Copy, Check } from 'lucide-react';

interface SchemaViewerProps {
  schema: FormSchema;
}

export default function SchemaViewer({ schema }: SchemaViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-all group"
      >
        <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-300">
          <Code2 className="w-4 h-4" />
          <span className="text-sm font-medium">View Generated Schema</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 animate-fadeIn">
          <div className="bg-slate-900/80 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                JSON Schema
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono max-h-96 overflow-y-auto">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

