import { useState } from "react";

const STATUSES = ["todo", "doing", "done"];
const STATUS_LABEL = { todo: "To do", doing: "In progress", done: "Done" };
const PRIORITIES = ["low", "medium", "high"];

const initialTodos = [
  { id: 1, title: "Read chapter on reconciliation", priority: "high", status: "doing", resetKey: 0 },
  { id: 2, title: "Finish React homework", priority: "high", status: "todo", resetKey: 0 },
  { id: 3, title: "Push project to GitHub", priority: "medium", status: "todo", resetKey: 0 },
  { id: 4, title: "Buy printer paper", priority: "low", status: "done", resetKey: 0 },
];

/* Child with its own form state */
function AddTodoForm({ onAdd }) {
  console.log("render: AddTodoForm");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), priority);
    setTitle("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        aria-label="Task title"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p} priority</option>
        ))}
      </select>
      <button type="submit" className="primary">Add task</button>
    </form>
  );
}

/* Child with LOCAL state: expanded, note, focus sessions.
   Parent state (status, priority, title) comes in as props. */
function TodoItem({ todo, visible, onStatusChange, onRemove, onResetLocal }) {
  console.log(`render: TodoItem #${todo.id} "${todo.title}" (status=${todo.status}, visible=${visible})`);
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [sessions, setSessions] = useState(0);

  // Hooks above always run, so state survives while hidden by a filter.
  if (!visible) return null;

  return (
    <li className="item">
      <div className="item-main">
        <div className="item-title">
          <span className={`dot status-${todo.status}`} title={STATUS_LABEL[todo.status]} />
          <span className={todo.status === "done" ? "struck" : ""}>{todo.title}</span>
          <span className={`tag priority-${todo.priority}`}>{todo.priority}</span>
        </div>
        <div className="item-actions">
          <select
            value={todo.status}
            onChange={(e) => onStatusChange(todo.id, e.target.value)}
            aria-label={`Status of ${todo.title}`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          <button onClick={() => setSessions(sessions + 1)}>
            Focus +1 <b>{sessions}</b>
          </button>
          <button onClick={() => setExpanded(!expanded)}>{expanded ? "Hide note" : "Note"}</button>
          <button onClick={() => onResetLocal(todo.id)}>Reset local</button>
          <button className="danger" onClick={() => onRemove(todo.id)}>Remove</button>
        </div>
      </div>
      {expanded && (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a note for this task…"
          rows={2}
        />
      )}
    </li>
  );
}

export default function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  console.log(`render: App (filter=${filter}, theme=${theme}, todos=${todos.length})`);

  function addTodo(title, priority) {
    setTodos([{ id: Date.now(), title, priority, status: "todo", resetKey: 0 }, ...todos]);
  }
  function removeTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }
  function changeStatus(id, status) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, status } : t)));
  }
  // Changing resetKey changes the React key -> item remounts -> local state resets
  function resetLocal(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, resetKey: t.resetKey + 1 } : t)));
  }
  function reverseList() {
    setTodos([...todos].reverse());
  }

  const counts = {
    all: todos.length,
    todo: todos.filter((t) => t.status === "todo").length,
    doing: todos.filter((t) => t.status === "doing").length,
    done: todos.filter((t) => t.status === "done").length,
  };
  const anyVisible = filter === "all" ? todos.length > 0 : counts[filter] > 0;

  return (
    <div className="shell" data-theme={theme}>
    <main className="app">
      <header>
        <div>
          <h1>Study Desk</h1>
          <p>{counts.done} of {counts.all} tasks done</p>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </header>

      <AddTodoForm onAdd={addTodo} />

      <div className="toolbar">
        <div className="filters" role="group" aria-label="Filter by status">
          {["all", ...STATUSES].map((f) => (
            <button
              key={f}
              className={filter === f ? "chip active" : "chip"}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : STATUS_LABEL[f]} ({counts[f]})
            </button>
          ))}
        </div>
        <button onClick={reverseList}>Reverse order</button>
      </div>

      <ul className="list">
        {todos.map((todo) => (
          <TodoItem
            key={`${todo.id}-${todo.resetKey}`}
            todo={todo}
            visible={filter === "all" || todo.status === filter}
            onStatusChange={changeStatus}
            onRemove={removeTodo}
            onResetLocal={resetLocal}
          />
        ))}
      </ul>
      {!anyVisible && <p className="empty">No tasks here. Add one above or change the filter.</p>}
    </main>
    </div>
  );
}