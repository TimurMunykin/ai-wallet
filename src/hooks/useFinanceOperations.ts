import { useCallback } from 'react';
import { financeService } from '../services/financeService';
import type { Transaction, RecurringPayment } from '../types/chat';

export const useFinanceOperations = () => {
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    return financeService.addTransaction(transaction);
  }, []);

  const addRecurringPayment = useCallback((payment: Omit<RecurringPayment, 'id'>) => {
    return financeService.addRecurringPayment(payment);
  }, []);

  const getBalance = useCallback(() => {
    return financeService.getBalance();
  }, []);

  const getTransactions = useCallback((limit?: number) => {
    return financeService.getTransactions(limit);
  }, []);

  const getRecurringPayments = useCallback(() => {
    return financeService.getRecurringPayments();
  }, []);

  const getSpendingByCategory = useCallback((period: 'week' | 'month' = 'month') => {
    return financeService.getSpendingByCategory(period);
  }, []);

  const getFinancialSummary = useCallback(() => {
    return financeService.getFinancialSummary();
  }, []);

  return {
    addTransaction,
    addRecurringPayment,
    getBalance,
    getTransactions,
    getRecurringPayments,
    getSpendingByCategory,
    getFinancialSummary,
  };
};
