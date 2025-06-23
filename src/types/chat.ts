export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  uiSnippet?: UISnippet;
  financeAction?: FinanceAction;
}

export interface UISnippet {
  code: string;
  language: 'jsx' | 'tsx' | 'html' | 'css' | 'javascript' | 'typescript';
  description?: string;
  props?: Record<string, any>;
}

export interface OpenAIResponse {
  message: string;
  hasUISnippet: boolean;
  uiSnippet?: UISnippet;
  financeAction?: FinanceAction;
}

export interface FinanceAction {
  type: 'add_expense' | 'add_income' | 'show_balance' | 'add_recurring' | 'show_budget' | 'show_analysis' | 'ask_clarification';
  data?: any;
  needsWidget?: boolean;
  widgetType?: string;
}

// Типы для финансовых данных
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
}

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDue: Date;
  category: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
}

export interface FinanceData {
  balance: number;
  transactions: Transaction[];
  recurringPayments: RecurringPayment[];
  budgets: Budget[];
}
