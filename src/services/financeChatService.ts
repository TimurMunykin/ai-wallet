import OpenAI from 'openai';
import type { OpenAIResponse } from '../types/chat';
import { financeService } from './financeService';
import { ConversationManager } from './ConversationManager';
import { ResponseParser } from './ResponseParser';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export class FinanceChatService {
  private conversationManager = new ConversationManager();
  private responseParser = new ResponseParser();

  async sendMessage(message: string): Promise<OpenAIResponse> {
    try {
      // Сначала попробуем автоматически обработать финансовые действия
      const processedAction = await this.processFinanceAction(message);

      // Получаем обновленные финансовые данные после возможных изменений
      const financeData = this.getFinanceData();

      // Добавляем сообщение пользователя в историю с контекстом
      this.conversationManager.addUserMessage(message, {
        processedAction,
        ...financeData
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: this.conversationManager.getHistory(),
        temperature: 0.7,
      });

      const assistantMessage = response.choices[0]?.message?.content || '';

      // Добавляем ответ ассистента в историю
      this.conversationManager.addAssistantMessage(assistantMessage);

      // Парсим ответ на текст и виджеты
      const { text, snippets } = this.responseParser.parseResponse(assistantMessage);

      // Передаем финансовые данные в виджеты
      const snippetsWithData = snippets.map(snippet => ({
        language: snippet.language as 'jsx',
        code: snippet.code,
        props: financeData
      }));

      return {
        message: text,
        hasUISnippet: snippetsWithData.length > 0,
        uiSnippet: snippetsWithData.length > 0 ? snippetsWithData[0] : undefined
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        message: 'Извините, произошла ошибка при обработке вашего сообщения.',
        hasUISnippet: false,
        uiSnippet: undefined
      };
    }
  }

  private getFinanceData() {
    return {
      balance: financeService.getBalance(),
      transactions: financeService.getTransactions(10),
      recurringPayments: financeService.getRecurringPayments(),
      budgets: financeService.getBudgets(),
      summary: financeService.getFinancialSummary(),
      categorySpending: financeService.getSpendingByCategory('month')
    };
  }

  private async processFinanceAction(message: string): Promise<string | null> {
    // Регулярные выражения для распознавания финансовых действий
    const expensePatterns = [
      /потратил\s+(\d+)\s*(?:рубл|₽)?\s*на\s+(.+)/i,
      /купил\s+(.+?)\s+за\s+(\d+)\s*(?:рубл|₽)?/i,
      /трата\s+(\d+)\s*(?:рубл|₽)?\s*(?:на\s+)?(.+)/i,
      /расход\s+(\d+)\s*(?:рубл|₽)?\s*(?:на\s+)?(.+)/i,
    ];

    const incomePatterns = [
      /заработал\s+(\d+)\s*(?:рубл|₽)?\s*(?:от\s+|за\s+)?(.+)/i,
      /получил\s+(\d+)\s*(?:рубл|₽)?\s*(?:от\s+|за\s+)?(.+)/i,
      /доход\s+(\d+)\s*(?:рубл|₽)?\s*(?:от\s+)?(.+)/i,
      /зарплата\s+(\d+)\s*(?:рубл|₽)?/i,
    ];

    const subscriptionPatterns = [
      /подписк[ау]\s+(.+?)\s+(\d+)\s*(?:рубл|₽)?\s*(?:в\s+месяц|месяц)/i,
      /добавь?\s+подписк[ау]\s+(.+?)\s+(\d+)\s*(?:рубл|₽)?/i,
    ];

    // Проверяем расходы
    for (const pattern of expensePatterns) {
      const match = message.match(pattern);
      if (match) {
        const amount = parseInt(match[1]);
        const description = match[2] || 'Разное';
        const category = this.categorizeExpense(description);

        financeService.addTransaction({
          amount,
          category,
          description,
          type: 'expense' as const,
          date: new Date()
        });

        return `Добавлен расход: ${amount}₽ на ${description}`;
      }
    }

    // Проверяем доходы
    for (const pattern of incomePatterns) {
      const match = message.match(pattern);
      if (match) {
        const amount = parseInt(match[1]);
        const description = match[2] || (match[0].includes('зарплата') ? 'зарплата' : 'доход');

        financeService.addTransaction({
          amount,
          category: 'Доход',
          description,
          type: 'income' as const,
          date: new Date()
        });

        return `Добавлен доход: ${amount}₽ от ${description}`;
      }
    }

    // Проверяем подписки
    for (const pattern of subscriptionPatterns) {
      const match = message.match(pattern);
      if (match) {
        const name = match[1];
        const amount = parseInt(match[2]);

        const nextDue = new Date();
        nextDue.setMonth(nextDue.getMonth() + 1);

        financeService.addRecurringPayment({
          name,
          amount,
          frequency: 'monthly',
          category: 'Подписки',
          nextDue
        });

        return `Добавлена подписка: ${name} за ${amount}₽/месяц`;
      }
    }

    return null;
  }

  private categorizeExpense(description: string): string {
    const categories = {
      'Продукты': ['продукт', 'еда', 'магазин', 'супермаркет', 'овощ', 'мясо', 'хлеб', 'молоко'],
      'Транспорт': ['метро', 'автобус', 'такси', 'бензин', 'парковка', 'проезд'],
      'Развлечения': ['кино', 'театр', 'концерт', 'игр', 'развлечение'],
      'Здоровье': ['аптека', 'врач', 'лекарство', 'медицина', 'здоровье'],
      'Одежда': ['одежда', 'обувь', 'магазин одежды'],
      'Кафе': ['кафе', 'ресторан', 'кофе', 'обед', 'ужин', 'завтрак'],
    };

    const desc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        return category;
      }
    }

    return 'Прочее';
  }

  clearHistory() {
    this.conversationManager.clearHistory();
  }
}

export const financeChatService = new FinanceChatService();
