import type { Transaction, RecurringPayment, Budget, FinanceData } from '../types/chat';

class FinanceService {
  private data: FinanceData;
  private storageKey = 'ai-wallet-finance-data';

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): FinanceData {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Преобразуем строки дат обратно в Date объекты
      parsed.transactions = parsed.transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
      parsed.recurringPayments = parsed.recurringPayments.map((r: any) => ({
        ...r,
        nextDue: new Date(r.nextDue)
      }));
      return parsed;
    }

    return {
      balance: 0,
      transactions: [],
      recurringPayments: [],
      budgets: []
    };
  }

  private saveData(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };

    this.data.transactions.push(newTransaction);

    // Обновляем баланс
    if (transaction.type === 'income') {
      this.data.balance += transaction.amount;
    } else {
      this.data.balance -= transaction.amount;
    }

    this.saveData();
    return newTransaction;
  }

  addRecurringPayment(payment: Omit<RecurringPayment, 'id'>): RecurringPayment {
    const newPayment: RecurringPayment = {
      ...payment,
      id: Date.now().toString()
    };

    this.data.recurringPayments.push(newPayment);
    this.saveData();
    return newPayment;
  }

  getBalance(): number {
    return this.data.balance;
  }

  getTransactions(limit?: number): Transaction[] {
    const sorted = [...this.data.transactions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  getRecurringPayments(): RecurringPayment[] {
    return this.data.recurringPayments;
  }

  getBudgets(): Budget[] {
    return this.data.budgets;
  }

  getSpendingByCategory(period: 'week' | 'month' = 'month'): Record<string, number> {
    const now = new Date();
    const cutoffDate = new Date();

    if (period === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else {
      cutoffDate.setMonth(now.getMonth() - 1);
    }

    const expenses = this.data.transactions.filter(t =>
      t.type === 'expense' && new Date(t.date) >= cutoffDate
    );

    const categorySpending: Record<string, number> = {};
    expenses.forEach(expense => {
      categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
    });

    return categorySpending;
  }

  getUpcomingRecurring(): RecurringPayment[] {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    return this.data.recurringPayments.filter(payment =>
      new Date(payment.nextDue) <= nextWeek
    );
  }

  setBudget(category: string, limit: number, period: 'monthly' | 'weekly' = 'monthly'): Budget {
    const existingIndex = this.data.budgets.findIndex(b => b.category === category);
    const spent = this.getSpendingByCategory(period === 'monthly' ? 'month' : 'week')[category] || 0;

    const budget: Budget = {
      category,
      limit,
      spent,
      period
    };

    if (existingIndex >= 0) {
      this.data.budgets[existingIndex] = budget;
    } else {
      this.data.budgets.push(budget);
    }

    this.saveData();
    return budget;
  }

  getFinancialSummary() {
    const thisMonthSpending = Object.values(this.getSpendingByCategory('month')).reduce((a, b) => a + b, 0);
    const thisWeekSpending = Object.values(this.getSpendingByCategory('week')).reduce((a, b) => a + b, 0);
    const upcomingPayments = this.getUpcomingRecurring();

    return {
      balance: this.data.balance,
      thisMonthSpending,
      thisWeekSpending,
      upcomingPayments: upcomingPayments.length,
      totalUpcomingAmount: upcomingPayments.reduce((sum, p) => sum + p.amount, 0),
      recentTransactions: this.getTransactions(5)
    };
  }
}

export const financeService = new FinanceService();
