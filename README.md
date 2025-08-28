Prompt Studio
Tagline: "Build bulletproof prompts that make LLMs follow instructions to the letter."

Overview
Prompt Studio is a specialized engineering environment designed to tackle a common and frustrating problem: Large Language Models (LLMs) ignoring critical constraints in prompts. This leads to unreliable, unpredictable, and sometimes unsafe outputs.

This application provides a structured and test-driven workflow to create, debug, and verify high-fidelity prompts. It leverages the incredible speed of Groq's Llama 3 API for rapid iteration and the semantic power of Jina AI's embedding models for nuanced, intelligent analysis.

Key Features
📝 Structured Editor: Move beyond a simple textarea. Define prompts with dedicated sections for System Role, Instruction, Constraints, and Examples.

🔬 Strictness Tester: Run prompts against a suite of adversarial test cases to calculate a verifiable Strictness Score.

🧠 Semantic Analysis: Go beyond keyword matching. Use Jina AI to calculate a Semantic Similarity Score, ensuring the LLM's output matches your intent.

⚡ Groq-Powered Speed: Iterate in seconds, not minutes. Get near-instant feedback on prompt changes thanks to the low-latency Groq API.

💾 Database Persistence: Save and load your prompt sessions to a Supabase database using the Drizzle ORM for a type-safe, seamless experience.

📊 Real-time Analysis: Get an instant token count and estimated run cost for your test suite as you type.

⏳ Run History: Automatically save a snapshot of every test run. View a timeline of your work and compare results to see how tweaks impact performance.

📤 Exportable Prompts: Download your finished prompts as .json or .yaml files to use in your own applications.

Tech Stack
Area

Choice

Framework

Next.js 14 (App Router)

Styling

Tailwind CSS + Shadcn/ui

State

Zustand

Database

Supabase (Postgres) + Drizzle ORM

LLM API

Groq (Llama 3 70B)

AI Services

Jina AI (Embeddings)

Linting

ESLint + Prettier

Getting Started
Follow these steps to get a local instance of Prompt Studio running.

1. Clone the Repository
git clone <your-repository-url>
cd prompt-studio

2. Install Dependencies
This project uses Bun as the package manager.

bun install

3. Set Up Environment Variables
Create a file named .env.local in the root of your project and add the following variables.

# Get this from your Supabase project's database settings
DATABASE_URL="your-supabase-connection-string"

# Get these from your Supabase project's API settings
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Your API keys for the LLM services
GROQ_API_KEY="your-groq-api-key"
JINA_API_KEY="your-jina-api-key"

4. Run Database Migrations
This command will sync your Drizzle schema with your Supabase database, creating the necessary prompts table.

bun run db:migrate

5. Run the Development Server
bun run dev

The application should now be running at http://localhost:3000.

Usage
Navigate to the Studio: Open the application and click "Launch Studio" to enter the main workspace.

Build Your Prompt:

Fill in the System Role to define the LLM's persona.

Write the core task in the Instruction section.

Add Constraints:

Click "Add Constraint" to open the dialog.

Choose a type (e.g., Word Limit, JSON Only) and provide a value.

The constraint will appear as a badge.

Add Examples:

Click "Add Example" to provide the LLM with few-shot examples of desired input/output pairs.

Define Test Cases:

In the top-right panel, click "Add Test Case".

Give the test a descriptive name (e.g., "Ignores Instructions").

Provide an adversarial input designed to break your prompt.

Optionally, add an "Expected Output" to enable semantic similarity scoring.

Run Tests:

Click the "Run All Tests" button in the bottom-right panel.

The application will send each test case to the Groq API and stream the results back in real-time.

Analyze Results:

Each result card will show the LLM's output.

Once complete, it will also display a Strictness Score (how well it followed your constraints) and a Similarity Score (if an expected output was provided).

Save Your Work:

Click the "Save" button in the header to save your entire session to the database. The URL will update with a unique ID for your saved prompt.