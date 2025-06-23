import OpenAI from 'openai';
import type { OpenAIResponse } from '../types/chat';
import { financeService } from './financeService';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export class FinanceChatService {
  private conversationHistory: { role: 'user' | 'assistant' | 'system', content: string }[] = [];

  constructor() {
    // Инициализируем контекст финансового помощника
    this.conversationHistory.push({
      role: 'system',
      content: `Ты персональный финансовый ассистент, который помогает пользователю управлять его финансами.

ТВОЯ РОЛЬ:
- Помогать вести учет доходов и расходов
- Отслеживать регулярные платежи
- Показывать баланс и статистику
- Создавать бюджеты и анализировать траты
- Генерировать интерактивные виджеты для визуализации данных

КОГДА СОЗДАВАТЬ ВИДЖЕТЫ:
1. В виджетах должна быть возможность редактировать суммы, вобщем он должен быть максимально интерактивным
2. Когда пользователь добавляет транзакцию - создай виджет подтверждения
3. Когда спрашивает баланс - создай красивый виджет с балансом и краткой статистикой
4. Когда просит показать траты - создай виджет с графиком или диаграммой
5. Когда добавляет регулярный платеж - создай виджет с календарем предстоящих платежей
6. Когда нужна аналитика - создай дашборд с различными метриками

ПРАВИЛА СОЗДАНИЯ ВИДЖЕТОВ:
- Используй React hooks БЕЗ импортов (useState, useEffect доступны глобально)
- Стилизуй с Tailwind CSS
- Создавай функциональные компоненты: function ComponentName() {...}
- НЕ используй import statements!
- НЕ используй props в компонентах - все данные доступны как глобальные переменные
- Используй переменные напрямую: balance, transactions, recurringPayments, budgets, summary, categorySpending
- Используй современные компоненты (графики, анимации, иконки Unicode)
- СОЗДАВАЙ собственные вспомогательные функции прямо в компоненте по необходимости

ДОСТУПНЫЕ ПЕРЕМЕННЫЕ (используй их напрямую в коде):
- balance: текущий баланс (число)
- transactions: массив транзакций
  Каждая транзакция: {id: string, amount: number, category: string, description: string, date: Date, type: 'income'|'expense'}
  ВАЖНО: date это объект Date! НЕ используй строковые методы типа startsWith на date!
- recurringPayments: регулярные платежи
  Каждый платеж: {id: string, name: string, amount: number, frequency: string, nextDue: Date, category: string}
- budgets: бюджеты по категориям
- summary: объект с полной статистикой {balance, thisMonthSpending, thisWeekSpending, upcomingPayments, totalUpcomingAmount, recentTransactions}
- categorySpending: траты по категориям за месяц (объект {категория: сумма})

СОЗДАНИЕ ВСПОМОГАТЕЛЬНЫХ ФУНКЦИЙ:
Создавай в начале компонента нужные функции для работы с данными:

ФОРМАТ ОТВЕТА:
Сначала ответь пользователю текстом, затем если нужен виджет, добавь его в формате:
\`\`\`jsx

  // код виджета
}
\`\`\`

ВАЖНО:
- Всегда анализируй контекст разговора и данные пользователя перед созданием виджетов
- всегда должна быть возможность редактировать сумму и прочие данные
- !!Вводи только виджет, не надо писать "Вот виджет...", "Теперь у вас...", "Вот виджет..." и прочий подобный текст
- Пояснения к кнопкам и прочему можешь выводить внутри виджета, а не внутри сообщения
- виджет должен быьт стилизован под минимализм с маленьикми кмопонентами
`
    });
  }

  async sendMessage(message: string): Promise<OpenAIResponse> {
    try {
      // Сначала попробуем автоматически обработать финансовые действия
      const processedAction = await this.processFinanceAction(message);

      // Получаем обновленные финансовые данные после возможных изменений
      const financeData = {
        balance: financeService.getBalance(),
        transactions: financeService.getTransactions(10),
        recurringPayments: financeService.getRecurringPayments(),
        budgets: financeService.getBudgets(),
        summary: financeService.getFinancialSummary(),
        categorySpending: financeService.getSpendingByCategory('month')
      };

      // Добавляем сообщение пользователя в историю с контекстом
      let contextMessage = message;
      if (processedAction) {
        contextMessage += `\n\nВыполнено действие: ${processedAction}`;
      }

      this.conversationHistory.push({
        role: 'user',
        content: `${contextMessage}

Текущие финансовые данные:
- Баланс: ${financeData.balance}₽
- Последние транзакции: ${JSON.stringify(financeData.transactions.slice(0, 3), null, 2)}
- Траты за месяц по категориям: ${JSON.stringify(financeData.categorySpending, null, 2)}
- Регулярные платежи: ${financeData.recurringPayments.length}`
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: this.conversationHistory,
        temperature: 0.7,
      });

      const assistantMessage = response.choices[0]?.message?.content || '';

      // Добавляем ответ ассистента в историю
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Парсим ответ на текст и виджеты
      const { text, snippets } = this.parseResponse(assistantMessage);

      // Передаем финансовые данные в виджеты
      const snippetsWithData = snippets.map(snippet => ({
        ...snippet,
        props: {
          balance: financeData.balance,
          transactions: financeData.transactions,
          recurringPayments: financeData.recurringPayments,
          budgets: financeData.budgets,
          summary: financeData.summary,
          categorySpending: financeData.categorySpending
        }
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

  private parseResponse(response: string): { text: string; snippets: any[] } {
    const snippets: any[] = [];
    let text = response;

    // Ищем блоки кода jsx/tsx
    const codeBlockPattern = /```(?:jsx|tsx)\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockPattern.exec(response)) !== null) {
      const code = match[1];
      snippets.push({
        language: 'jsx',
        code: code.trim()
      });
    }

    // Удаляем блоки кода из текста
    text = text.replace(codeBlockPattern, '').trim();

    return { text, snippets };
  }

  clearHistory() {
    // Сохраняем только системный промпт
    const systemPrompt = this.conversationHistory[0];
    this.conversationHistory = [systemPrompt];
  }
}

export const financeChatService = new FinanceChatService();
