import React from 'react';
import { TrendingUp, PieChart, Calendar } from 'lucide-react';

interface FinanceStatsProps {
  summary: {
    balance: number;
    thisMonthSpending: number;
    thisWeekSpending: number;
    upcomingPayments: number;
    totalUpcomingAmount: number;
  };
  onClearHistory: () => void;
}

export const FinanceStats: React.FC<FinanceStatsProps> = ({
  summary,
  onClearHistory,
}) => {
  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">За неделю</div>
              <div className="font-semibold text-green-600">
                -{summary.thisWeekSpending.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <PieChart className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">За месяц</div>
              <div className="font-semibold text-blue-600">
                -{summary.thisMonthSpending.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div>
              <div className="text-sm text-gray-600">Предстоящих</div>
              <div className="font-semibold text-orange-600">
                {summary.upcomingPayments} платежей
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearHistory}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Очистить чат
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
