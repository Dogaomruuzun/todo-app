import { useState, useEffect } from 'react';
import './index.css';

const languages = {
  tr: {
    title: 'To-Do List',
    placeholder: 'Yeni görev ekle...',
    notePlaceholder: 'Not (isteğe bağlı)',
    add: 'Ekle',
    all: 'Tümü',
    active: 'Aktif',
    completed: 'Tamamlanan',
    theme: 'Aydınlık Mod',
    stats: (total, done) => `${total} görev — ${done} tamamlandı`
  },
  en: {
    title: 'To-Do List',
    placeholder: 'Add a new task...',
    notePlaceholder: 'Note (optional)',
    add: 'Add',
    all: 'All',
    active: 'Active',
    completed: 'Completed',
    theme: 'Light Mode',
    stats: (total, done) => `${total} tasks — ${done} completed`
  }
};

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState('tr');

  const t = languages[lang];

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setTodos([
      ...todos,
      {
        text: input,
        note,
        date,
        completed: false,
        created: new Date().toLocaleString()
      }
    ]);
    setInput('');
    setNote('');
    setDate('');
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed);
    return matchesSearch && matchesFilter;
  });

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLang = () => setLang(lang === 'tr' ? 'en' : 'tr');

  const total = todos.length;
  const done = todos.filter(t => t.completed).length;

  return (
    <div className={`container ${darkMode ? 'dark' : 'light'}`}>
      <h1>📝 {t.title}</h1>
      <div className="top-controls">
        <button onClick={toggleTheme}>🌓 {t.theme}</button>
        <button onClick={toggleLang}>🌐 {lang === 'tr' ? 'EN' : 'TR'}</button>
      </div>
      <form onSubmit={addTodo} className="form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.notePlaceholder}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">{t.add}</button>
      </form>

      <input
        className="search"
        type="text"
        placeholder="🔍 Ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
        <button onClick={() => setFilter('all')}>{t.all}</button>
        <button onClick={() => setFilter('active')}>{t.active}</button>
        <button onClick={() => setFilter('completed')}>{t.completed}</button>
      </div>

      <div className="stats">{t.stats(total, done)}</div>

      <ul className="todo-list">
        {filteredTodos.map((todo, index) => (
          <li key={index} className="todo-item">
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(index)}
              />
              <span className={todo.completed ? 'completed' : ''}>
                {todo.text}
              </span>
              {todo.note && <div className="note">🗒️ {todo.note}</div>}
              {todo.date && <div className="date">📅 {todo.date}</div>}
              <div className="created">⏱️ {todo.created}</div>
            </label>
            <button onClick={() => deleteTodo(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
