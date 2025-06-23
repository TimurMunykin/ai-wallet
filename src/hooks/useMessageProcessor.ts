import { useCallback } from 'react';
import { useFinanceOperations } from './useFinanceOperations';

interface ProcessedAction {
  message: string;
  success: boolean;
}

export const useMessageProcessor = () => {
  const operations = useFinanceOperations();

  const processFinanceAction = useCallback(async (message: string): Promise<ProcessedAction | null> => {
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
        const category = categorizeExpense(description);

        try {
          operations.addTransaction({
            amount,
            category,
            description,
            type: 'expense' as const,
            date: new Date()
          });

          return {
            message: `Добавлен расход: ${amount}₽ на ${description}`,
            success: true
          };
        } catch (error) {
          return {
            message: 'Ошибка при добавлении расхода',
            success: false
          };
        }
      }
    }

    // Проверяем доходы
    for (const pattern of incomePatterns) {
      const match = message.match(pattern);
      if (match) {
        const amount = parseInt(match[1]);
        const description = match[2] || (match[0].includes('зарплата') ? 'зарплата' : 'доход');

        try {
          operations.addTransaction({
            amount,
            category: 'Доход',
            description,
            type: 'income' as const,
            date: new Date()
          });

          return {
            message: `Добавлен доход: ${amount}₽ от ${description}`,
            success: true
          };
        } catch (error) {
          return {
            message: 'Ошибка при добавлении дохода',
            success: false
          };
        }
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

        try {
          operations.addRecurringPayment({
            name,
            amount,
            frequency: 'monthly',
            category: 'Подписки',
            nextDue
          });

          return {
            message: `Добавлена подписка: ${name} за ${amount}₽/месяц`,
            success: true
          };
        } catch (error) {
          return {
            message: 'Ошибка при добавлении подписки',
            success: false
          };
        }
      }
    }

    return null;
  }, [operations]);

  return {
    processFinanceAction,
  };
};

// Вспомогательная функция для категоризации расходов
function categorizeExpense(description: string): string {
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
