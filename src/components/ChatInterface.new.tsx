import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { ChatMessageComponent } from './ChatMessage';
import { ChatService } from '../services/chatService';
import { testComponents } from '../examples/testComponents';
import type { ChatMessage } from '../types/chat';
import toast, { Toaster } from 'react-hot-toast';

const chatService = new ChatService();

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Привет! Я умею создавать интерактивные UI компоненты. Попросите меня создать кнопку, форму, игру или любой другой компонент! 🚀\n\nТакже можете протестировать готовые примеры ниже.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const apiKeySet = !!import.meta.env.VITE_OPENAI_API_KEY;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addTestComponent = (name: string, code: string, description: string) => {
    const testMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `Тестовый компонент: ${description}`,
      isUser: false,
      timestamp: new Date(),
      uiSnippet: {
        code,
        language: 'jsx',
        description
      }
    };
    setMessages(prev => [...prev, testMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (!apiKeySet) {
      toast.error('Please set your OpenAI API key in the environment variables');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(inputValue);

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date(),
        uiSnippet: response.hasUISnippet ? response.uiSnippet : undefined
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKeySet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-800">API Key Required</h2>
          </div>
          <p className="text-gray-600 mb-4">
            To use this application, you need to set your OpenAI API key in the environment variables.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              1. Create a <code className="bg-gray-200 px-1 rounded">.env</code> file in the root directory
            </p>
            <p className="text-sm text-gray-700 mb-2">
              2. Add your API key:
            </p>
            <code className="text-xs bg-gray-200 p-2 rounded block">
              VITE_OPENAI_API_KEY=your-api-key-here
            </code>
          </div>
          <p className="text-xs text-gray-500">
            Get your API key from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenAI Platform
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">AI UI Component Generator</h1>
          <p className="text-gray-600 mt-2">
            Ask me to create any UI component and I'll generate it for you! ✨
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500">AI is thinking...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Test Components */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto p-4">
          <button
            onClick={() => setShowTests(prev => !prev)}
            className="w-full text-left flex items-center justify-between px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="font-semibold">🎭 Тестовые компоненты</span>
            <span className="text-sm">{showTests ? 'Скрыть' : 'Показать'}</span>
          </button>
          {showTests && (
            <div className="mt-4 space-y-2">
              {testComponents.map((component) => (
                <div key={component.name} className="p-4 bg-gray-100 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{component.title}</h3>
                      <p className="mt-2 text-gray-600 text-sm">{component.description}</p>
                    </div>
                    <button
                      onClick={() => addTestComponent(component.name, component.code, component.description)}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Использовать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me to create a UI component... (e.g., 'Create a colorful button with hover effects')"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Отправить
            </button>
          </form>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};
