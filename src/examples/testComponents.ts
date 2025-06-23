// Тестовые JSX компоненты для проверки динамического рендеринга

export const testComponents = [
  {
    name: 'simpleButton',
    title: 'Интерактивная кнопка',
    description: 'Простая кнопка с изменением состояния',
    code: `function Component() {
  const [clicked, setClicked] = useState(false);

  return (
    <button
      onClick={() => setClicked(!clicked)}
      className={\`px-4 py-2 rounded-lg font-semibold transition-all \${clicked ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}\`}
    >
      {clicked ? '✅ Clicked!' : '👆 Click me'}
    </button>
  );
}`
  },
  {
    name: 'todoList',
    title: 'Todo List',
    description: 'Список задач с возможностью добавления и отметки',
    code: `function Component() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, done: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Todo List</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="w-4 h-4"
            />
            <span className={\`flex-1 \${todo.done ? 'line-through text-gray-500' : ''}\`}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}`
  },
  {
    name: 'colorfulCard',
    title: 'Цветная карточка',
    description: 'Карточка с возможностью смены цвета',
    code: `function Component() {
  const [color, setColor] = useState('blue');
  const colors = ['blue', 'red', 'green', 'purple', 'pink', 'yellow'];

  return (
    <div className={\`max-w-sm mx-auto p-6 rounded-xl shadow-lg bg-gradient-to-r from-\${color}-400 to-\${color}-600 text-white\`}>
      <h3 className="text-2xl font-bold mb-4">Colorful Card</h3>
      <p className="mb-4">Click buttons to change color!</p>
      <div className="grid grid-cols-3 gap-2">
        {colors.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={\`p-2 rounded-lg bg-\${c}-500 hover:bg-\${c}-600 transition-colors capitalize\`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}`
  },
  {
    name: 'animatedLoader',
    title: 'Анимированный лоадер',
    description: 'Прогресс бар с анимацией',
    code: `function Component() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = () => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Animated Loader</h3>

      {!loading ? (
        <button
          onClick={startLoading}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Loading
        </button>
      ) : (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300"
              style={{ width: \`\${Math.min(progress, 100)}%\` }}
            />
          </div>
          <p className="text-center text-gray-600">
            {Math.round(progress)}% Complete...
          </p>
        </div>
      )}
    </div>
  );
}`
  }
];
