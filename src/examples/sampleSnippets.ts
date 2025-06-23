// Example UI snippets that the AI could generate

export const sampleUISnippets = {
  colorfulButton: {
    code: `const ColorfulButton = () => {
  const [clicked, setClicked] = React.useState(false);

  return (
    <button
      onClick={() => setClicked(!clicked)}
      className={\`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 \${
        clicked
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
          : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md hover:shadow-lg'
      }\`}
    >
      {clicked ? '🎉 Clicked!' : '✨ Click Me'}
    </button>
  );
};

export default ColorfulButton;`,
    language: 'jsx' as const,
    description: 'A colorful button with gradient background and click animation'
  },

  simpleCalculator: {
    code: `const SimpleCalculator = () => {
  const [display, setDisplay] = React.useState('0');
  const [previousValue, setPreviousValue] = React.useState(null);
  const [operation, setOperation] = React.useState(null);
  const [waitingForOperand, setWaitingForOperand] = React.useState(false);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const calculate = () => {
    const prev = parseFloat(previousValue);
    const current = parseFloat(display);

    if (isNaN(prev) || isNaN(current)) return;

    let result;
    switch (operation) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/': result = prev / current; break;
      default: return;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      calculate();
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl max-w-xs mx-auto">
      <div className="bg-black text-white text-right text-2xl p-4 rounded mb-4 font-mono">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clear} className="col-span-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded font-bold">
          Clear
        </button>
        <button onClick={() => performOperation('/')} className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-bold">
          ÷
        </button>
        <button onClick={() => performOperation('*')} className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-bold">
          ×
        </button>

        {[7, 8, 9].map(num => (
          <button key={num} onClick={() => inputNumber(num)} className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded font-bold">
            {num}
          </button>
        ))}
        <button onClick={() => performOperation('-')} className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-bold">
          −
        </button>

        {[4, 5, 6].map(num => (
          <button key={num} onClick={() => inputNumber(num)} className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded font-bold">
            {num}
          </button>
        ))}
        <button onClick={() => performOperation('+')} className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-bold">
          +
        </button>

        {[1, 2, 3].map(num => (
          <button key={num} onClick={() => inputNumber(num)} className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded font-bold">
            {num}
          </button>
        ))}
        <button onClick={calculate} className="row-span-2 bg-green-500 hover:bg-green-600 text-white rounded font-bold">
          =
        </button>

        <button onClick={() => inputNumber(0)} className="col-span-2 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded font-bold">
          0
        </button>
        <button onClick={() => setDisplay(display + '.')} className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded font-bold">
          .
        </button>
      </div>
    </div>
  );
};

export default SimpleCalculator;`,
    language: 'jsx' as const,
    description: 'A fully functional calculator with basic arithmetic operations'
  },

  progressBar: {
    code: `const AnimatedProgressBar = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-gray-700">Loading Progress</h3>
        <p className="text-sm text-gray-500">{progress}% Complete</p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300 ease-out relative"
          style={{ width: \`\${progress}%\` }}
        >
          <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => setProgress(0)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default AnimatedProgressBar;`,
    language: 'jsx' as const,
    description: 'An animated progress bar with gradient colors and reset functionality'
  }
};
