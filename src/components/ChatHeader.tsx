import React from 'react';
import { Wallet } from 'lucide-react';

interface ChatHeaderProps {
  balance: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ balance }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-full">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Финансовый Помощник</h1>
              <p className="text-blue-100">Управляйте финансами с умом</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Текущий баланс</div>
            <div className="text-2xl font-bold">
              {balance.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
