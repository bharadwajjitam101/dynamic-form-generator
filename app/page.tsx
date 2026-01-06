'use client';

import { useState } from 'react';
import { FormSchema, FormSubmissionData } from '@/lib/types';
import FormGenerator from '@/components/FormGenerator';
import DynamicForm from '@/components/DynamicForm';
import SubmissionResult from '@/components/SubmissionResult';
import SchemaViewer from '@/components/SchemaViewer';
import { Wand2, ArrowDown } from 'lucide-react';

export default function Home() {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [submittedData, setSubmittedData] = useState<FormSubmissionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormGenerated = (newSchema: FormSchema) => {
    setSchema(newSchema);
    setSubmittedData(null);
  };

  const handleFormSubmit = (data: FormSubmissionData) => {
    setSubmittedData(data);
  };

  const handleReset = () => {
    setSchema(null);
    setSubmittedData(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Dynamic Form Generator
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Describe the form you need in plain English, and watch AI transform your words into a fully functional form.
          </p>
        </header>

        {/* Form Generator Input */}
        <section className="mb-12">
          <FormGenerator
            onFormGenerated={handleFormGenerated}
            onReset={handleReset}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </section>

        {/* Generated Form Display */}
        {schema && !submittedData && (
          <>
            {/* Transition Arrow */}
            <div className="flex justify-center mb-8">
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <ArrowDown className="w-6 h-6 animate-bounce" />
                <span className="text-sm font-medium">Generated Form</span>
              </div>
            </div>

            {/* Schema Viewer */}
            <section className="mb-6">
              <SchemaViewer schema={schema} />
            </section>

            {/* Dynamic Form */}
            <section>
              <DynamicForm schema={schema} onSubmit={handleFormSubmit} />
            </section>
          </>
        )}

        {/* Submission Result */}
        {submittedData && (
          <>
            {/* Transition Arrow */}
            <div className="flex justify-center mb-8">
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <ArrowDown className="w-6 h-6 animate-bounce" />
                <span className="text-sm font-medium">Submission Result</span>
              </div>
            </div>

            <section>
              <SubmissionResult data={submittedData} />
            </section>

            {/* Back to Form Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setSubmittedData(null)}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all border border-slate-600/50"
              >
                ← Back to Form
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-slate-600">
          <p>Powered by Google Gemini AI • Built with Next.js & Tailwind CSS</p>
        </footer>
      </div>
    </main>
  );
}
