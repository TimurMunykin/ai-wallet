import { useState, useEffect } from 'react';
import { financeService } from '../services/financeService';
import type { Transaction } from '../types/chat';

export const useFinanceData = () => {
  const [financeData, setFinanceData] = useState<{
    balance: number;
    summary: {
      balance: number;
      thisMonthSpending: number;
      thisWeekSpending: number;
      upcomingPayments: number;
      totalUpcomingAmount: number;
      recentTransactions: Transaction[];
    };
  }>({
    balance: 0,
    summary: {
      balance: 0,
      thisMonthSpending: 0,
      thisWeekSpending: 0,
      upcomingPayments: 0,
      totalUpcomingAmount: 0,
      recentTransactions: []
    }
  });

  const refreshFinanceData = () => {
    const summary = financeService.getFinancialSummary();
    setFinanceData({
      balance: financeService.getBalance(),
      summary
    });
  };

  useEffect(() => {
    refreshFinanceData();

    // Обновляем данные каждые 30 секунд
    const interval = setInterval(refreshFinanceData, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    financeData,
    refreshFinanceData,
  };
};
