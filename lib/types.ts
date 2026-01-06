// Field validation rules
export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
}

// Individual form field definition
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'url' | 'password';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: FieldValidation;
  meta_tag: string;
  defaultValue?: string | number | boolean;
}

// Complete form schema returned by Gemini
export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
}

// Form data with values and meta tags
export interface FormSubmissionData {
  [fieldName: string]: {
    value: string | number | boolean | string[];
    meta_tag: string;
    label: string;
  };
}

// API response type
export interface GenerateFormResponse {
  success: boolean;
  schema?: FormSchema;
  error?: string;
}

// Field error state
export interface FieldErrors {
  [fieldName: string]: string;
}

