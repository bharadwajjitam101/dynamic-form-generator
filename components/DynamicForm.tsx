'use client';

import { useState, useCallback } from 'react';
import { FormSchema, FormField, FormSubmissionData, FieldErrors } from '@/lib/types';
import { Send, AlertCircle } from 'lucide-react';

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (data: FormSubmissionData) => void;
}

export default function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, string | boolean | string[]>>(() => {
    const initial: Record<string, string | boolean | string[]> = {};
    schema.fields.forEach((field) => {
      if (field.type === 'checkbox' && field.options) {
        initial[field.name] = [];
      } else if (field.type === 'checkbox') {
        initial[field.name] = false;
      } else {
        initial[field.name] = field.defaultValue?.toString() || '';
      }
    });
    return initial;
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((field: FormField, value: string | boolean | string[]): string | null => {
    if (field.required) {
      if (Array.isArray(value) && value.length === 0) {
        return `${field.label} is required`;
      }
      if (typeof value === 'string' && !value.trim()) {
        return `${field.label} is required`;
      }
      if (typeof value === 'boolean' && !value) {
        return `${field.label} is required`;
      }
    }

    if (typeof value === 'string' && value && field.validation) {
      const { minLength, maxLength, min, max, pattern, patternMessage } = field.validation;

      if (minLength && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`;
      }

      if (maxLength && value.length > maxLength) {
        return `${field.label} must be at most ${maxLength} characters`;
      }

      if (field.type === 'number' && value) {
        const numValue = parseFloat(value);
        if (min !== undefined && numValue < min) {
          return `${field.label} must be at least ${min}`;
        }
        if (max !== undefined && numValue > max) {
          return `${field.label} must be at most ${max}`;
        }
      }

      if (pattern) {
        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
          return patternMessage || `${field.label} is invalid`;
        }
      }
    }

    // Email validation
    if (field.type === 'email' && typeof value === 'string' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (field.type === 'tel' && typeof value === 'string' && value) {
      const phoneRegex = /^[\d\s\-+()]{7,}$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
    }

    return null;
  }, []);

  const handleChange = (field: FormField, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field.name]: value }));
    
    if (touched[field.name]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field.name]: error || '' }));
    }
  };

  const handleBlur = (field: FormField) => {
    setTouched((prev) => ({ ...prev, [field.name]: true }));
    const error = validateField(field, formData[field.name]);
    setErrors((prev) => ({ ...prev, [field.name]: error || '' }));
  };

  const handleCheckboxGroupChange = (field: FormField, option: string, checked: boolean) => {
    const currentValues = (formData[field.name] as string[]) || [];
    const newValues = checked
      ? [...currentValues, option]
      : currentValues.filter((v) => v !== option);
    handleChange(field, newValues);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FieldErrors = {};
    let hasErrors = false;

    schema.fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(
      schema.fields.reduce((acc, field) => ({ ...acc, [field.name]: true }), {})
    );

    if (hasErrors) {
      return;
    }

    // Build submission data with meta tags
    const submissionData: FormSubmissionData = {};
    schema.fields.forEach((field) => {
      submissionData[field.name] = {
        value: formData[field.name],
        meta_tag: field.meta_tag,
        label: field.label,
      };
    });

    onSubmit(submissionData);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];
    const showError = touched[field.name] && error;

    const baseInputClasses = `w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
      showError
        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
        : 'border-slate-600/50 focus:ring-emerald-500/50 focus:border-emerald-500/50'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={value as string}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            placeholder={field.placeholder}
            required={field.required}
            className={`${baseInputClasses} h-24 resize-none`}
          />
        );

      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={value as string}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            required={field.required}
            className={baseInputClasses}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleChange(field, e.target.value)}
                  onBlur={() => handleBlur(field)}
                  className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
                />
                <span className="text-slate-300 group-hover:text-slate-100 transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        if (field.options && field.options.length > 0) {
          return (
            <div className="space-y-2">
              {field.options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    name={field.name}
                    value={option}
                    checked={(value as string[])?.includes(option)}
                    onChange={(e) =>
                      handleCheckboxGroupChange(field, option, e.target.checked)
                    }
                    onBlur={() => handleBlur(field)}
                    className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-slate-300 group-hover:text-slate-100 transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          );
        }
        return (
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name={field.name}
              checked={value as boolean}
              onChange={(e) => handleChange(field, e.target.checked)}
              onBlur={() => handleBlur(field)}
              className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500 focus:ring-offset-slate-900"
            />
            <span className="text-slate-300 group-hover:text-slate-100 transition-colors">
              {field.placeholder || 'Yes'}
            </span>
          </label>
        );

      default:
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={value as string}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        {/* Form Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-slate-100">{schema.title}</h2>
          {schema.description && (
            <p className="mt-1 text-sm text-slate-400">{schema.description}</p>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {schema.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-slate-300"
              >
                {field.label}
                {field.required && (
                  <span className="ml-1 text-red-400">*</span>
                )}
              </label>
              
              {renderField(field)}

              {touched[field.name] && errors[field.name] && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors[field.name]}</span>
                </div>
              )}
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              <Send className="w-5 h-5" />
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

