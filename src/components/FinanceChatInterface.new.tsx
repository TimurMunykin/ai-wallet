import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import { useChat } from '../hooks/useChat';
import { useFinanceData } from '../hooks/useFinanceData';
import { ChatHeader } from './ChatHeader';
import { FinanceStats } from './FinanceStats';
import { MessagesList } from './MessagesList';
import { QuickActions } from './QuickActions';
import { ChatInput } from './ChatInput';

export const FinanceChatInterface: React.FC = () => {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    messagesEndRef,
    sendMessage,
    clearHistory,
    addQuickAction,
  } = useChat();

  const { financeData } = useFinanceData();
  const apiKeySet = !!import.meta.env.VITE_OPENAI_API_KEY;

  const handleSubmit = async (message: string) => {
    await sendMessage(message);
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
              2. Добавьте: <code className="bg-gray-200 px-1 rounded">VITE_OPENAI_API_KEY=your-key</code>
            </p>
            <p className="text-sm text-gray-700">
              3. Перезапустите сервер разработки
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Получить API ключ можно на{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              platform.openai.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />

      <ChatHeader balance={financeData.balance} />

      <FinanceStats
        summary={financeData.summary}
        onClearHistory={clearHistory}
      />

      <MessagesList
        messages={messages}
        messagesEndRef={messagesEndRef}
      />

      <QuickActions onAddAction={addQuickAction} />

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
