import { useState, useRef, useEffect } from 'react';
import { financeChatService } from '../services/financeChatService';
import type { ChatMessage } from '../types/chat';
import toast from 'react-hot-toast';

export const useChat = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await financeChatService.sendMessage(message);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date(),
        uiSnippet: response.uiSnippet,
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (response.hasUISnippet) {
        toast.success('Виджет создан! 🎉');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Произошла ошибка при отправке сообщения');

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Извините, произошла ошибка при обработке вашего сообщения.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([messages[0]]); // Сохраняем только приветственное сообщение
    financeChatService.clearHistory();
    toast.success('История чата очищена');
  };

  const addQuickAction = (action: string) => {
    setInputValue(action);
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    messagesEndRef,
    sendMessage,
    clearHistory,
    addQuickAction,
  };
};
