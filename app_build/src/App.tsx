import React, { useState, useEffect } from 'react';
import { Clock, Copy, AlertCircle, CheckCircle2, Moon, Sun, History, Zap, Code } from 'lucide-react';
import cronstrue from 'cronstrue';
import parser from 'cron-parser';

// --- Predefined Recipes ---
const RECIPES = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Every hour at minute 30', value: '30 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every weekday at 9 AM', value: '0 9 * * 1-5' },
  { label: 'First day of month at midnight', value: '0 0 1 * *' },
];


export default function App() {
  const [cronString, setCronString] = useState('* * * * *');
  const [copySuccess, setCopySuccess] = useState(false);
  const [snippetCopySuccess, setSnippetCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'minute' | 'hour' | 'day' | 'month' | 'weekday'>('minute');
  const [activeSnippetTab, setActiveSnippetTab] = useState<'github' | 'node' | 'linux'>('github');

  // --- New Feature States ---
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('cron_theme') === 'dark';
  });

  const [history, setHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem('cron_history');
    if (savedHistory) {
      try { return JSON.parse(savedHistory); } catch { /* ignore */ }
    }
    return [];
  });

  // Update Body Class & Local Storage for Dark Mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cron_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cron_theme', 'light');
    }
  }, [isDark]);

  // Update History
  useEffect(() => {
    const timeout = setTimeout(() => {
      setHistory(prev => {
        // Only save valid crons that aren't already the most recent
        try {
          parser.parseExpression(cronString);
          if (prev[0] === cronString) return prev;
          const next = [cronString, ...prev.filter(c => c !== cronString)].slice(0, 5);
          localStorage.setItem('cron_history', JSON.stringify(next));
          return next;
        } catch {
          return prev;
        }
      });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [cronString]);

  const { humanReadable, isValid, nextExecutions } = React.useMemo(() => {
    try {
      const translation = cronstrue.toString(cronString, { throwExceptionOnParseError: true });
      const interval = parser.parseExpression(cronString);
      
      const dates = [];
      for (let i = 0; i < 5; i++) {
        dates.push(interval.next().toDate());
      }
      return { humanReadable: translation, isValid: true, nextExecutions: dates };
    } catch {
      return { humanReadable: 'Invalid Cron Expression', isValid: false, nextExecutions: [] };
    }
  }, [cronString]);

  const handleCopy = (text: string, isSnippet = false) => {
    navigator.clipboard.writeText(text).then(() => {
      if (isSnippet) {
        setSnippetCopySuccess(true);
        setTimeout(() => setSnippetCopySuccess(false), 2000);
      } else {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    });
  };

  const parts = cronString.split(' ');
  const pMinute = parts[0] || '*';
  const pHour = parts[1] || '*';
  const pDay = parts[2] || '*';
  const pMonth = parts[3] || '*';
  const pWeekday = parts[4] || '*';

  const updatePart = (index: number, value: string) => {
    const newParts = [...parts];
    while (newParts.length < 5) newParts.push('*');
    newParts[index] = value;
    setCronString(newParts.slice(0, 5).join(' '));
  };


  const snippets = {
    github: `schedule:\n  - cron: "${cronString}"`,
    node: `const cron = require('node-cron');\n\ncron.schedule('${cronString}', () => {\n  console.log('Running task!');\n});`,
    linux: `${cronString} /usr/bin/find`
  };

  const formatExecutionDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 md:p-8 flex flex-col items-center transition-colors duration-200">
      <header className="mb-8 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="text-blue-600 dark:text-blue-400" size={32} />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            Cron Canvas
          </h1>
        </div>
        
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Dark Mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Input, Hover Breakdown, Visual Builder, Snippets */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Input Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
              Cron Expression
            </label>
            
            <div className="relative mb-3">
              <input
                type="text"
                className={`w-full text-3xl font-mono p-4 rounded-xl border-2 bg-transparent focus:outline-none transition-colors ${
                  isValid 
                    ? 'border-slate-200 dark:border-slate-600 focus:border-blue-500 text-slate-800 dark:text-slate-100' 
                    : 'border-red-300 focus:border-red-500 text-red-600 dark:text-red-400'
                }`}
                value={cronString}
                onChange={(e) => setCronString(e.target.value)}
                placeholder="* * * * *"
              />
              <button
                onClick={() => handleCopy(cronString)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Copy to clipboard"
              >
                {copySuccess ? <CheckCircle2 className="text-green-500" /> : <Copy />}
              </button>
            </div>


            {/* Human Readable Translation */}
            <div className={`flex items-start gap-3 p-4 rounded-xl ${isValid ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              {!isValid && <AlertCircle className="shrink-0 text-red-500 mt-0.5" size={20} />}
              {isValid && <Zap className="shrink-0 text-amber-500 mt-0.5" size={20} />}
              <p className={`text-lg font-medium leading-relaxed ${isValid ? 'text-blue-800 dark:text-blue-300' : 'text-red-600 dark:text-red-400'}`}>
                {humanReadable}
              </p>
            </div>
          </div>

          {/* Visual Builder Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
            <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 custom-scrollbar">
              {(['minute', 'hour', 'day', 'month', 'weekday'] as const).map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-4 sm:px-6 text-sm font-semibold capitalize transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab 
                      ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {tab}
                  <div className="text-xs font-mono font-normal mt-1 opacity-70">
                    {parts[idx] || '*'}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-4 sm:p-6">
              {activeTab === 'minute' && (
                <CronTabSelector
                  options={['*', '*/5', '*/10', '*/15', '*/30', '0', '15', '30', '45']}
                  labels={['Every minute', 'Every 5 mins', 'Every 10 mins', 'Every 15 mins', 'Every 30 mins', 'At minute 0', 'At minute 15', 'At minute 30', 'At minute 45']}
                  value={pMinute}
                  onChange={(val) => updatePart(0, val)}
                />
              )}
              {activeTab === 'hour' && (
                <CronTabSelector
                  options={['*', '*/2', '*/3', '*/4', '*/6', '*/12', '0', '12']}
                  labels={['Every hour', 'Every 2 hours', 'Every 3 hours', 'Every 4 hours', 'Every 6 hours', 'Every 12 hours', 'Midnight (0)', 'Noon (12)']}
                  value={pHour}
                  onChange={(val) => updatePart(1, val)}
                />
              )}
              {activeTab === 'day' && (
                <CronTabSelector
                  options={['*', '1', '15', 'L', 'LW']}
                  labels={['Every day', '1st of month', '15th of month', 'Last day of month', 'Last weekday']}
                  value={pDay}
                  onChange={(val) => updatePart(2, val)}
                />
              )}
              {activeTab === 'month' && (
                <CronTabSelector
                  options={['*', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '*/3', '*/6']}
                  labels={['Every month', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Every 3 months', 'Every 6 months']}
                  value={pMonth}
                  onChange={(val) => updatePart(3, val)}
                />
              )}
              {activeTab === 'weekday' && (
                <CronTabSelector
                  options={['*', '1-5', '0,6', '1', '2', '3', '4', '5']}
                  labels={['Every day', 'Mon to Fri', 'Weekend', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']}
                  value={pWeekday}
                  onChange={(val) => updatePart(4, val)}
                />
              )}
              
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Custom Value
                </label>
                <input 
                  type="text"
                  className="w-full text-lg font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
                  value={parts[['minute', 'hour', 'day', 'month', 'weekday'].indexOf(activeTab)] || '*'}
                  onChange={(e) => updatePart(['minute', 'hour', 'day', 'month', 'weekday'].indexOf(activeTab), e.target.value)}
                  placeholder="e.g. */15 or 1,15,30"
                />
              </div>
            </div>
          </div>

          {/* Code Snippets Export */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-950 px-4 py-3 border-b border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex gap-4">
                {(['github', 'node', 'linux'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveSnippetTab(tab)}
                    className={`text-sm font-medium capitalize flex items-center gap-2 transition-colors ${
                      activeSnippetTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab === 'github' && <Code size={16} />}
                    {tab}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleCopy(snippets[activeSnippetTab], true)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                title="Copy snippet"
              >
                {snippetCopySuccess ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="p-4 overflow-x-auto custom-scrollbar">
              <pre className="text-blue-800 dark:text-blue-100 font-mono text-sm leading-relaxed">
                <code>{snippets[activeSnippetTab]}</code>
              </pre>
            </div>
          </div>

        </div>

        {/* Right Column: Timezone, Executions, Recipes, History */}
        <div className="space-y-6">
          
          {/* Execution Calculator */}
          <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock size={20} className="text-blue-500 dark:text-blue-400" />
                Next Executions
              </h3>
            </div>


            {isValid ? (
              <ul className="space-y-4 relative z-10">
                {nextExecutions.map((date, idx) => (
                  <li key={idx} className="flex flex-col border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0">
                    <span className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm transition-colors">
                      {formatExecutionDate(date)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
               <div className="text-red-400 text-sm bg-red-950/30 p-4 rounded-xl border border-red-900/50 relative z-10">
                Fix the invalid cron expression to view future executions.
              </div>
            )}
          </div>

          {/* Recipes Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4 uppercase tracking-wide flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              Quick Recipes
            </h3>
            <div className="space-y-2">
              {RECIPES.map((recipe, idx) => (
                <button
                  key={idx}
                  onClick={() => setCronString(recipe.value)}
                  className="w-full text-left p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group flex justify-between items-center"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {recipe.label}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {recipe.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* History Panel */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4 uppercase tracking-wide flex items-center gap-2">
                <History size={16} className="text-slate-400" />
                Recent History
              </h3>
              <div className="space-y-2">
                {history.map((h, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCronString(h)}
                    className="w-full text-left p-3 rounded-lg border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {h}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
                      {cronstrue.toString(h).split(',')[0]}...
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function CronTabSelector({ 
  options, 
  labels, 
  value, 
  onChange 
}: { 
  options: string[], 
  labels: string[], 
  value: string, 
  onChange: (val: string) => void 
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt, idx) => {
        const isActive = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`p-3 text-left rounded-xl border transition-all ${
              isActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <div className={`text-sm font-medium ${isActive ? 'text-blue-800 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
              {labels[idx]}
            </div>
            <div className={`text-xs font-mono mt-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
              {opt}
            </div>
          </button>
        );
      })}
    </div>
  );
}
