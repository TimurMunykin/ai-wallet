# AI Финансовый Помощник

Умный финансовый помощник с интерактивными виджетами, созданный на React TypeScript с использованием OpenAI GPT. Ведите учет финансов в естественном чате с автоматической генерацией красивых UI-компонентов.

## ✨ Возможности

- **Умный Чат**: Естественное общение с ИИ-помощником о ваших финансах
- **Динамические Виджеты**: Автоматическая генерация интерактивных компонентов для визуализации данных
- **Учет Доходов/Расходов**: Просто скажите "потратил 500₽ на продукты" и система всё поймет
- **Регулярные Платежи**: Отслеживание подписок и периодических трат
- **Аналитика**: Красивые графики и диаграммы трат по категориям
- **Баланс в Реальном Времени**: Актуальная информация о состоянии финансов

## 🚀 Что делает это особенным

Это не просто трекер расходов - это персональный финансовый консультант, который:

- Понимает естественный язык ("купил кофе за 200 рублей")
- Генерирует красивые виджеты для каждого запроса
- Задает уточняющие вопросы когда нужно
- Создает интерактивные графики и аналитику
- Напоминает о предстоящих платежах

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
