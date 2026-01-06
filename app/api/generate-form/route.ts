import { NextRequest, NextResponse } from 'next/server';
import { FormSchema, GenerateFormResponse } from '@/lib/types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent';

function sanitizeInput(input: string): string {
  // Remove any potentially harmful characters while keeping the meaning
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 1000); // Limit input length
}

function buildPrompt(userDescription: string): string {
  return `You are a form schema generator. Analyze the following form description and generate a JSON schema for a dynamic form.

User's form description: "${userDescription}"

Generate a JSON object with the following structure:
{
  "title": "Form title based on the description",
  "description": "Brief description of the form's purpose",
  "fields": [
    {
      "name": "field_name_snake_case",
      "label": "Human Readable Label",
      "type": "text|email|number|tel|textarea|select|radio|checkbox|date|url",
      "placeholder": "Helpful placeholder text",
      "required": true or false,
      "options": ["Option1", "Option2"] (only for select, radio, checkbox types),
      "validation": {
        "minLength": number (optional),
        "maxLength": number (optional),
        "min": number (optional, for number type),
        "max": number (optional, for number type),
        "pattern": "regex pattern" (optional),
        "patternMessage": "Error message for pattern" (optional)
      },
      "meta_tag": "semantic_identifier_for_this_field"
    }
  ]
}

Rules:
1. Choose appropriate input types based on the field content (email for emails, tel for phone numbers, textarea for long text, etc.)
2. Generate meaningful meta_tags that describe the semantic purpose of each field
3. Add sensible validation rules where appropriate
4. Include helpful placeholder text
5. Mark fields as required based on common form patterns
6. For selection fields (select, radio), provide relevant options based on context
7. Return ONLY the JSON object, no markdown formatting, no code blocks, no explanation

Generate the form schema now:`;
}

function parseGeminiResponse(responseText: string): FormSchema {
  // Clean the response - remove any markdown code blocks if present
  let cleanedText = responseText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim();

  // Try to find JSON object in the response
  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  const schema = JSON.parse(jsonMatch[0]) as FormSchema;

  // Validate the schema structure
  if (!schema.title || !schema.fields || !Array.isArray(schema.fields)) {
    throw new Error('Invalid schema structure');
  }

  // Ensure all fields have required properties
  schema.fields = schema.fields.map((field, index) => ({
    name: field.name || `field_${index}`,
    label: field.label || field.name || `Field ${index + 1}`,
    type: field.type || 'text',
    placeholder: field.placeholder || '',
    required: field.required ?? false,
    options: field.options,
    validation: field.validation,
    meta_tag: field.meta_tag || field.name || `field_${index}`,
  }));

  return schema;
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateFormResponse>> {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide a form description' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { success: false, error: 'Gemini API key is not configured. Please add your API key to .env.local' },
        { status: 500 }
      );
    }

    const sanitizedDescription = sanitizeInput(description);
    const prompt = buildPrompt(sanitizedDescription);

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { success: false, error: `Gemini API error: ${response.status} ${response.statusText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    
    // Extract text from Gemini response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      return NextResponse.json(
        { success: false, error: 'Empty response from Gemini API' },
        { status: 502 }
      );
    }

    const schema = parseGeminiResponse(responseText);

    return NextResponse.json({
      success: true,
      schema,
    });
  } catch (error) {
    console.error('Error generating form:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate form';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

