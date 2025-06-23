import OpenAI from 'openai';
import type { OpenAIResponse } from '../types/chat';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be done server-side
});

export class ChatService {
  async sendMessage(message: string): Promise<OpenAIResponse> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Используем GPT-4o-mini (это современная nano версия)
        messages: [
          {
            role: "system",
            content: `Ты помощник, который создает интерактивные React компоненты на основе запросов пользователя.

ВАЖНО: Ты должен возвращать ТОЛЬКО исполняемый JSX код компонентов, без дополнительных объяснений вне кода.

КРИТИЧЕСКИ ВАЖНО для react-live:
- НЕ используй ES6 импорты (import { useState } from 'react')
- Используй React hooks напрямую: useState, useEffect, useMemo, useCallback, useRef, useReducer
- React доступен глобально, но импортировать его НЕ нужно
- Все hooks доступны как глобальные переменные

Правила для создания компонентов:
1. Используй только React hooks (useState, useEffect, etc.) БЕЗ импортов
2. Используй Tailwind CSS для стилизации
3. Создавай полностью функциональные компоненты
4. Код должен быть готов к выполнению без модификаций
5. Создавай компоненты как функции (function Component() {...})
6. Можешь использовать любые стандартные JavaScript API (Math, Date, JSON, etc.)
7. Создавай красивые и современные UI
8. НЕ добавляй никаких import statements!

Примеры ПРАВИЛЬНЫХ форматов ответа:

\`\`\`jsx
function Component() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
\`\`\`

\`\`\`jsx
function Component() {
  const [input, setInput] = useState('');
  const [items, setItems] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setItems([...items, input]);
      setInput('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter something..."
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Add
        </button>
      </form>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="p-2 border-b">{item}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

Если пользователь просит компонент, ВСЕГДА отвечай с JSX кодом в блоке кода БЕЗ импортов.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const responseText = response.choices[0]?.message?.content || '';

      // Проверяем, содержит ли ответ JSX код
      const jsxMatch = responseText.match(/```(?:jsx|tsx)\s*([\s\S]*?)```/);

      if (jsxMatch) {
        const jsxCode = jsxMatch[1].trim();

        return {
          message: "Я создал интерактивный компонент для вас!",
          hasUISnippet: true,
          uiSnippet: {
            code: jsxCode,
            language: 'jsx' as const,
            description: this.extractDescriptionFromResponse(responseText, jsxCode)
          }
        };
      } else {
        // Если JSX кода нет, возвращаем обычный текстовый ответ
        return {
          message: responseText,
          hasUISnippet: false
        };
      }

    } catch (error) {
      console.error('Error calling OpenAI API:', error);

      // Fallback для демонстрации функциональности
      return this.getFallbackResponse(message);
    }
  }

  private extractDescriptionFromResponse(fullResponse: string, jsxCode: string): string {
    // Пытаемся извлечь описание из ответа (текст до или после кода)
    const beforeCode = fullResponse.split('```')[0]?.trim();
    const afterCode = fullResponse.split('```')[2]?.trim();

    if (beforeCode && beforeCode.length > 10 && beforeCode.length < 200) {
      return beforeCode;
    }
    if (afterCode && afterCode.length > 10 && afterCode.length < 200) {
      return afterCode;
    }

    // Пытаемся найти комментарии в коде
    const commentMatch = jsxCode.match(/\/\*\*([\s\S]*?)\*\//);
    if (commentMatch) {
      return commentMatch[1].trim();
    }

    return 'Динамически сгенерированный React компонент';
  }

  private getFallbackResponse(message: string): OpenAIResponse {
    const lowerMessage = message.toLowerCase();

    // Создаем простые примеры компонентов на основе ключевых слов
    if (lowerMessage.includes('кнопка') || lowerMessage.includes('button')) {
      return {
        message: "Я создал интерактивную кнопку для вас!",
        hasUISnippet: true,
        uiSnippet: {
          code: `function Component() {
  const [clicks, setClicks] = useState(0);

  return (
    <button
      onClick={() => setClicks(clicks + 1)}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
    >
      Нажато: {clicks} раз ✨
    </button>
  );
}`,
          language: 'jsx' as const,
          description: 'Интерактивная кнопка с градиентом и анимацией'
        }
      };
    }

    if (lowerMessage.includes('счетчик') || lowerMessage.includes('counter')) {
      return {
        message: "Вот красивый счетчик!",
        hasUISnippet: true,
        uiSnippet: {
          code: `function Component() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg max-w-sm mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Счетчик</h3>
      <div className="text-6xl font-bold text-blue-600 mb-6">{count}</div>
      <div className="flex gap-4">
        <button
          onClick={() => setCount(count - 1)}
          className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold transition-colors"
        >
          −
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
        >
          Сброс
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}`,
          language: 'jsx' as const,
          description: 'Интерактивный счетчик с кнопками управления'
        }
      };
    }

    if (lowerMessage.includes('форма') || lowerMessage.includes('form')) {
      return {
        message: "Создал красивую форму!",
        hasUISnippet: true,
        uiSnippet: {
          code: `function Component() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Связаться с нами</h2>

      {submitted ? (
        <div className="text-center p-8">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-green-600 font-semibold">Сообщение отправлено!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Ваше имя"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <textarea
            placeholder="Ваше сообщение"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            Отправить сообщение
          </button>
        </form>
      )}
    </div>
  );
}`,
          language: 'jsx' as const,
          description: 'Интерактивная форма обратной связи с валидацией'
        }
      };
    }

    // По умолчанию создаем простой компонент
    return {
      message: "Создал простой компонент для демонстрации!",
      hasUISnippet: true,        uiSnippet: {
          code: `function Component() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
      <h2 className="text-2xl font-bold mb-4">Текущее время</h2>
      <div className="text-4xl font-mono">
        {time.toLocaleTimeString()}
      </div>
      <p className="mt-4 text-blue-100">
        Компонент обновляется каждую секунду!
      </p>
    </div>
  );
}`,
        language: 'jsx' as const,
        description: 'Часы реального времени'
      }
    };
  }
}
