# Practice Exercises: React (Vite): Performance Optimization with useMemo and useCallback

Apply `useMemo` and `useCallback` to eliminate costly recalculations and unnecessary child re-renders caused by broken referential equality.

---

### Exercise 1: Caching Expensive Data Filtering with `useMemo`

**Task:**  
In a Vite React application, toggling the UI theme re-renders the component and triggers an expensive array filter on 10,000 items. Optimize the component so the filter operation runs only when the `query` changes, not when `theme` changes.

**Starter Code:**
```jsx
import { useState } from 'react';

const largeList = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

export function SearchList() {
  const [query, setQuery] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);

  // Expensive operation runs on EVERY render (including theme toggle)
  console.log('Filtering items...');
  const filteredItems = largeList.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ background: darkTheme ? '#333' : '#fff', color: darkTheme ? '#fff' : '#000' }}>
      <button onClick={() => setDarkTheme((prev) => !prev)}>Toggle Theme</button>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
      <p>Results found: {filteredItems.length}</p>
    </div>
  );
}
```

**Expected Solution Snippet:**
```jsx
import { useState, useMemo } from 'react';

// ...
const filteredItems = useMemo(() => {
  console.log('Filtering items...');
  return largeList.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );
}, [query]);
```
*Assertion:* Toggling the theme button logs no "Filtering items..." message in the console.

---

### Exercise 2: Stabilizing Callback References with `useCallback`

**Task:**  
The `<TodoItem />` child component is wrapped in `React.memo`, but it still re-renders every time the user types in the input field. Stabilize the `handleDelete` function using `useCallback` so existing `<TodoItem />` instances do not re-render on input changes.

**Starter Code:**
```jsx
import React, { useState } from 'react';

const TodoItem = React.memo(({ id, text, onDelete }) => {
  console.log(`Rendered item: ${id}`);
  return (
    <li>
      {text} <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
});

export function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Set up Vite' },
    { id: 2, text: 'Learn React Hooks' },
  ]);
  const [input, setInput] = useState('');

  // Unstable reference: re-created on every keystroke
  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} id={todo.id} text={todo.text} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}
```

**Expected Solution Snippet:**
```jsx
import React, { useState, useCallback } from 'react';

// ...
const handleDelete = useCallback((id) => {
  setTodos((prev) => prev.filter((todo) => todo.id !== id));
}, []); // Empty dependency array because functional state update (prev => ...) is used
```
*Assertion:* Typing in the input field does not produce `Rendered item: ...` logs in the console.

---

### Exercise 3: Preventing Infinite Re-renders in `useEffect` Dependencies

**Task:**  
A component fetches data using an options configuration object and an analytics logger function passed into `useEffect`. Currently, this causes an infinite re-render loop. Use `useMemo` and `useCallback` to preserve referential identity across renders.

**Starter Code:**
```jsx
import { useState, useEffect } from 'react';

export function DataFetcher({ endpoint }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  // Both recreate on every render, causing useEffect to run indefinitely
  const requestOptions = { method: 'GET', headers: { Accept: 'application/json' } };
  
  const logFetch = (resultCount) => {
    console.log(`Fetched ${resultCount} items for page ${page}`);
  };

  useEffect(() => {
    fetch(`${endpoint}?page=${page}`, requestOptions)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        logFetch(json.length);
      });
  }, [endpoint, page, requestOptions, logFetch]);

  return <button onClick={() => setPage((p) => p + 1)}>Next Page</button>;
}
```

**Expected Solution Snippet:**
```jsx
import { useState, useEffect, useMemo, useCallback } from 'react';

export function DataFetcher({ endpoint }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  const requestOptions = useMemo(() => ({
    method: 'GET',
    headers: { Accept: 'application/json' }
  }), []);

  const logFetch = useCallback((resultCount) => {
    console.log(`Fetched ${resultCount} items for page ${page}`);
  }, [page]);

  useEffect(() => {
    fetch(`${endpoint}?page=${page}`, requestOptions)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        logFetch(json.length);
      });
  }, [endpoint, page, requestOptions, logFetch]);

  return <button onClick={() => setPage((p) => p + 1)}>Next Page</button>;
}
```
*Assertion:* The network call triggers exactly once on mount, and subsequently only when `page` changes.

---

## Self-Check Checklist

- [ ] Does your `useMemo` implementation return a cached value rather than a function definition?
- [ ] Are child components wrapped in `React.memo` when passing them callbacks optimized with `useCallback`?
- [ ] Have you leveraged functional state updates (e.g., `setCount((c) => c + 1)`) to minimize dependencies in `useCallback`?
- [ ] Have you verified with the React Developer Tools Profiler that re-renders are actually being skipped?
