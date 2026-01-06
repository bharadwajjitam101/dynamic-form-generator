'use client';

import { FormSubmissionData } from '@/lib/types';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SubmissionResultProps {
  data: FormSubmissionData;
}

export default function SubmissionResult({ data }: SubmissionResultProps) {
  const [copied, setCopied] = useState(false);

  const formatValue = (value: string | number | boolean | string[]): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Form Submitted Successfully!
              </h2>
              <p className="text-sm text-slate-400">
                Here&apos;s your submitted data with metadata mappings
              </p>
            </div>
          </div>
        </div>

        {/* Data Display */}
        <div className="p-6 space-y-4">
          {Object.entries(data).map(([fieldName, fieldData]) => (
            <div
              key={fieldName}
              className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <span className="text-sm font-medium text-slate-300">
                  {fieldData.label}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                  {fieldData.meta_tag}
                </span>
              </div>
              <p className="text-slate-100 break-words">
                {formatValue(fieldData.value) || (
                  <span className="text-slate-500 italic">Not provided</span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* JSON Output */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-400">
              Raw JSON Output
            </span>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy JSON
                </>
              )}
            </button>
          </div>
          <pre className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/30 overflow-x-auto text-sm text-slate-300 font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

