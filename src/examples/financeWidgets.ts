// Примеры финансовых виджетов для тестирования

export const financeWidgetExamples = {
  balanceWidget: `function BalanceWidget({ financeData }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">💰 Текущий баланс</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-200 hover:text-white transition-colors"
        >
          {showDetails ? '▼' : '▶'}
        </button>
      </div>

      <div className="text-3xl font-bold mb-2">
        {financeData.balance.toLocaleString('ru-RU')} ₽
      </div>

      {showDetails && (
        <div className="mt-4 space-y-2 bg-white/10 rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span>Трат за месяц:</span>
            <span>-{financeData.summary.thisMonthSpending.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Трат за неделю:</span>
            <span>-{financeData.summary.thisWeekSpending.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Предстоящих платежей:</span>
            <span>{financeData.summary.upcomingPayments}</span>
          </div>
        </div>
      )}
    </div>
  );
}`,

  expenseChart: `function ExpenseChart({ financeData }) {
  const categories = Object.entries(financeData.categorySpending);
  const maxAmount = Math.max(...categories.map(([_, amount]) => amount));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Траты по категориям</h3>

      <div className="space-y-3">
        {categories.map(([category, amount]) => {
          const percentage = (amount / maxAmount) * 100;
          return (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="text-gray-600">{amount.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: percentage + '%' }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">📈</div>
          <p>Пока нет данных о тратах</p>
        </div>
      )}
    </div>
  );
}`,

  transactionList: `function TransactionList({ financeData }) {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = financeData.transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">💳 Последние транзакции</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">Все</option>
          <option value="expense">Расходы</option>
          <option value="income">Доходы</option>
        </select>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {filteredTransactions.slice(0, 10).map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={
                'w-8 h-8 rounded-full flex items-center justify-center text-sm ' +
                (transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')
              }>
                {transaction.type === 'income' ? '↗' : '↙'}
              </div>
              <div>
                <div className="font-medium text-gray-800">{transaction.description}</div>
                <div className="text-xs text-gray-500">{transaction.category}</div>
              </div>
            </div>
            <div className={
              'font-semibold ' +
              (transaction.type === 'income' ? 'text-green-600' : 'text-red-600')
            }>
              {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">📋</div>
          <p>Нет транзакций</p>
        </div>
      )}
    </div>
  );
}`,

  recurringPayments: `function RecurringPayments({ financeData }) {
  const upcoming = financeData.recurringPayments.filter(payment => {
    const nextDue = new Date(payment.nextDue);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextDue <= nextWeek;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Предстоящие платежи</h3>

      <div className="space-y-3">
        {upcoming.map((payment) => {
          const daysLeft = Math.ceil((new Date(payment.nextDue) - new Date()) / (1000 * 60 * 60 * 24));
          return (
            <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm">
                  📅
                </div>
                <div>
                  <div className="font-medium text-gray-800">{payment.name}</div>
                  <div className="text-xs text-gray-500">
                    {payment.frequency === 'monthly' ? 'Ежемесячно' :
                     payment.frequency === 'weekly' ? 'Еженедельно' :
                     payment.frequency === 'yearly' ? 'Ежегодно' : 'Ежедневно'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-red-600">
                  {payment.amount.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-xs text-gray-500">
                  {daysLeft === 0 ? 'Сегодня' :
                   daysLeft === 1 ? 'Завтра' :
                   \`через \${daysLeft} дн.\`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {upcoming.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">✅</div>
          <p>Нет предстоящих платежей на этой неделе</p>
        </div>
      )}
    </div>
  );
}`
};
