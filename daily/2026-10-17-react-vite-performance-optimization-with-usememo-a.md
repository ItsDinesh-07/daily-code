# React Performance Optimization: useMemo and useCallback

`useMemo` caches the result of an expensive calculation between renders, while `useCallback` caches a function definition across renders. When combined with `React.memo`, they prevent redundant computations and unnecessary re-renders of child components when unrelated parent state changes.

```jsx
import React, { useState, useMemo, useCallback } from 'react';

// Child wrapped in React.memo: only re-renders if props change
const ResetButton = React.memo(({ onReset }) => {
  console.log('Child Rendered: ResetButton');
  return <button onClick={onReset}>Reset Counter</button>;
});

export default function App() {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // useMemo: Recomputes only when 'count' changes, not on 'darkMode' changes
  const doubledCount = useMemo(() => {
    console.log('Running expensive computation...');
    return count * 2;
  }, [count]);

  // useCallback: Maintains same function reference across renders
  // Prevents ResetButton from re-rendering when darkMode toggles
  const handleReset = useCallback(() => {
    setCount(0);
  }, []); // Stable identity: created once

  const themeStyle = {
    padding: '20px',
    background: darkMode ? '#222' : '#f0f0f0',
    color: darkMode ? '#fff' : '#000',
  };

  return (
    <div style={themeStyle}>
      <h2>Count: {count} | Doubled: {doubledCount}</h2>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <button onClick={() => setDarkMode((prev) => !prev)}>Toggle Theme</button>
      <ResetButton onReset={handleReset} />
    </div>
  );
}
```

## Key takeaways

* **`useMemo` caches values:** It executes during rendering and recalculates a derived value only when its declared dependencies change.
* **`useCallback` caches functions:** It ensures a function reference stays identical across renders unless its dependencies change.
* **Effective pair with `React.memo`:** Passing an inline, un-memoized function to a `React.memo` child breaks memoization because a new function reference is generated on every render.
* **Avoid premature optimization:** Memoization introduces memory and code complexity overhead; use it primarily for expensive computations or to stabilize references passed to memoized children.
