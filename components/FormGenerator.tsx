'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { FormSchema, GenerateFormResponse } from '@/lib/types';

interface FormGeneratorProps {
  onFormGenerated: (schema: FormSchema) => void;
  onReset: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const EXAMPLE_PROMPTS = [
  "I need a registration form for a doctors' conference with Name, Medical License Number, Specialty, and Dietary Restrictions",
  "Create a job application form with Name, Email, Phone, Resume upload description, Years of Experience, and Why you want this job",
  "I need a customer feedback form with Name, Email, Rating (1-5), Product purchased, and detailed feedback",
  "Build a event RSVP form with Name, Email, Number of guests, Meal preference, and any special requirements",
];

export default function FormGenerator({ onFormGenerated, onReset, isLoading, setIsLoading }: FormGeneratorProps) {
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Please describe the form you want to generate');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: description.trim() }),
      });

      const data: GenerateFormResponse = await response.json();

      if (!data.success || !data.schema) {
        throw new Error(data.error || 'Failed to generate form');
      }

      onFormGenerated(data.schema);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setDescription(example);
    setError(null);
  };

  const handleReset = () => {
    setDescription('');
    setError(null);
    onReset();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-slate-300"
          >
            Describe your form in natural language
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., I need a registration form for a tech conference with Name, Email, Company, Job Title, and T-shirt size..."
            className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isLoading || !description.trim()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Form
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-medium rounded-xl transition-all border border-slate-600/50"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Example Prompts */}
      <div className="mt-8 p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4 text-amber-400">
          <Lightbulb className="w-5 h-5" />
          <span className="font-medium text-sm">Try these examples</span>
        </div>
        <div className="grid gap-2">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-all border border-transparent hover:border-slate-600/50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

