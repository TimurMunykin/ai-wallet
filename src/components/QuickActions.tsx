import React from 'react';

interface QuickActionsProps {
  onAddAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAddAction }) => {
  const quickActions = [
    { label: '💰 Баланс', action: 'Покажи мой баланс' },
    { label: '📊 Статистика', action: 'Статистика трат за месяц' },
    { label: '📅 Платежи', action: 'Покажи регулярные платежи' },
    { label: '📈 Аналитика', action: 'Анализ трат по категориям' },
  ];

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="text-xs text-gray-500 mb-2">Быстрые действия:</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickActions.map((item, index) => (
            <button
              key={index}
              onClick={() => onAddAction(item.action)}
              className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
