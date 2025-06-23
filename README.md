# AI Chat with UI Snippets

An innovative React TypeScript chat application that can generate and render interactive UI components in real-time using OpenAI's GPT models.

## ✨ Features

- **Interactive Chat Interface**: Clean, modern chat UI with real-time messaging
- **Dynamic UI Component Generation**: Ask the AI to create UI components and see them rendered instantly
- **Safe Code Execution**: Components are safely compiled and executed using Babel
- **TypeScript Support**: Full type safety throughout the application
- **Modern Styling**: Beautiful UI with Tailwind CSS
- **Component Preview**: Toggle between rendered components and source code

## 🚀 What Makes This Special

This isn't just another chatbot - it's a creative coding companion that can:

- Generate interactive buttons, forms, charts, and other UI elements
- Create complete mini-applications within chat messages
- Provide both visual components and their source code
- Demonstrate React patterns and best practices

## 🛠️ Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Configure OpenAI API**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📝 Example Prompts

Try asking the AI to create:

- "Create a colorful button with hover effects"
- "Make a todo list component"
- "Build a simple calculator"
- "Create a progress bar with animation"
- "Make a card component with gradient background"

## 🏗️ Architecture

- **`ChatInterface`**: Main chat container with message handling
- **`ChatMessage`**: Individual message rendering component
- **`UISnippetRenderer`**: Safe dynamic component compilation and rendering
- **`ChatService`**: OpenAI API integration and response parsing
- **`types/chat.ts`**: TypeScript type definitions

## 🔒 Security

- Dynamic code execution is sandboxed
- Components are compiled in an isolated context
- API keys are kept client-side for development (move to server-side for production)

## 🎨 Built With

- React 18 + TypeScript
- Vite (Fast build tool)
- OpenAI API
- Tailwind CSS
- Babel (Runtime compilation)
- Lucide React (Icons)
