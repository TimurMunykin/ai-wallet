import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle, Wallet, TrendingUp, Calendar, PieChart } from 'lucide-react';
import { ChatMessageComponent } from './ChatMessage';
import { financeChatService } from '../services/financeChatService';
import { financeService } from '../services/financeService';
import type { ChatMessage } from '../types/chat';
import toast, { Toaster } from 'react-hot-toast';

export const FinanceChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `👋 Привет! Я ваш персональный финансовый помощник.

Помогу вам:
💰 Вести учет доходов и расходов
📊 Показывать баланс и статистику
📅 Отслеживать регулярные платежи
📈 Анализировать траты по категориям
💡 Создавать бюджеты и давать советы

Просто напишите что-то вроде:
• "Потратил 500 рублей на продукты"
• "Заработал 3000 рублей фрилансом"
• "Покажи мой баланс"
• "Сколько трачу на еду в месяц?"
• "Добавь подписку Spotify 299₽ в месяц"

Начнем? 🚀`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiKeySet = !!import.meta.env.VITE_OPENAI_API_KEY;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addQuickAction = (action: string) => {
    setInputValue(action);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    if (!apiKeySet) {
      toast.error('Пожалуйста, установите ваш OpenAI API ключ в переменных окружения');
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
      const response = await financeChatService.sendMessage(inputValue);

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date(),
        uiSnippet: response.hasUISnippet ? response.uiSnippet : undefined,
        financeAction: response.financeAction
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Не удалось отправить сообщение');
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([messages[0]]); // Оставляем приветственное сообщение
    financeChatService.clearHistory();
    toast.success('История чата очищена');
  };

  if (!apiKeySet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-800">Требуется API ключ</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Для использования финансового помощника необходим OpenAI API ключ.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              1. Создайте файл <code className="bg-gray-200 px-1 rounded">.env</code> в корневой папке
            </p>
            <p className="text-sm text-gray-700 mb-2">
              2. Добавьте ваш API ключ:
            </p>
            <code className="text-xs bg-gray-200 p-2 rounded block">
              VITE_OPENAI_API_KEY=your-api-key-here
            </code>
          </div>
          <p className="text-xs text-gray-500">
            Получите API ключ на{' '}
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

  const summary = financeService.getFinancialSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Wallet className="w-8 h-8 text-blue-600" />
                AI Финансовый Помощник
              </h1>
              <p className="text-gray-600 mt-2">
                Управляйте финансами с помощью умного чата и интерактивных виджетов
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {summary.balance.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-sm text-gray-500">Текущий баланс</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">За неделю</div>
                <div className="font-semibold text-green-600">-{summary.thisWeekSpending.toLocaleString('ru-RU')} ₽</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <PieChart className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">За месяц</div>
                <div className="font-semibold text-blue-600">-{summary.thisMonthSpending.toLocaleString('ru-RU')} ₽</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-sm text-gray-600">Предстоящих</div>
                <div className="font-semibold text-orange-600">{summary.upcomingPayments} платежей</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearHistory}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Очистить чат
              </button>
            </div>
          </div>
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
                <div className="text-sm text-gray-500">Анализирую ваши финансы...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Быстрые действия:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => addQuickAction('Покажи мой баланс')}
                className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                💰 Баланс
              </button>
              <button
                onClick={() => addQuickAction('Статистика трат за месяц')}
                className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                📊 Статистика
              </button>
              <button
                onClick={() => addQuickAction('Покажи регулярные платежи')}
                className="px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                📅 Платежи
              </button>
              <button
                onClick={() => addQuickAction('Потратил 500₽ на продукты')}
                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                ➖ Расход
              </button>
            </div>
          </div>
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
              placeholder="Напишите о ваших тратах, доходах или задайте вопрос о финансах..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
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
