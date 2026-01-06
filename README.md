# Dynamic Form Generator

A powerful web application that generates dynamic forms from natural language descriptions using Google Gemini AI.

## Features

- **Natural Language Input**: Describe your form in plain English
- **AI-Powered Generation**: Uses Google Gemini to understand and parse form requirements
- **Dynamic Rendering**: Forms are generated and rendered in real-time
- **Smart Field Types**: Automatically selects appropriate input types (text, email, tel, select, radio, checkbox, etc.)
- **Validation**: Built-in form validation with real-time error feedback
- **Meta-tag Mapping**: Each field has semantic metadata for data processing
- **Modern UI**: Clean, responsive design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository and navigate to the project:

```bash
cd folder_name
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

You can get your Gemini API key from: https://makersuite.google.com/app/apikey

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Describe Your Form**: Type a natural language description of the form you need in the input box. For example:
   - "I need a registration form for a doctors' conference with Name, Medical License Number, and Dietary Restrictions"
   - "Create a job application form with Name, Email, Phone, Resume summary, and Years of Experience"

2. **Generate**: Click the "Generate Form" button to create your form.

3. **Fill & Submit**: Fill out the generated form and submit it.

4. **View Results**: See your submitted data with meta-tag mappings in a structured format.

## Project Structure

```
folder_name/
├── app/
│   ├── api/
│   │   └── generate-form/
│   │       └── route.ts     # Gemini API proxy endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── DynamicForm.tsx      # Form renderer
│   ├── FormGenerator.tsx    # Input interface
│   ├── SchemaViewer.tsx     # JSON schema viewer
│   └── SubmissionResult.tsx # Results display
├── lib/
│   └── types.ts             # TypeScript interfaces
└── .env.local               # Environment variables (create this)
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Icons**: Lucide React

## Example Form Schema

The AI generates JSON schemas like this:

```json
{
  "title": "Conference Registration",
  "description": "Registration form for attendees",
  "fields": [
    {
      "name": "full_name",
      "label": "Full Name",
      "type": "text",
      "placeholder": "Enter your name",
      "required": true,
      "meta_tag": "participant_name"
    },
    {
      "name": "dietary_restrictions",
      "label": "Dietary Restrictions",
      "type": "select",
      "options": ["None", "Vegetarian", "Vegan", "Halal"],
      "required": false,
      "meta_tag": "dietary_preference"
    }
  ]
}
```

## License

MIT
