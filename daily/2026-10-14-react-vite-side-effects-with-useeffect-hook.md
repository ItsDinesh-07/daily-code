# React useEffect Side Effect Example

This example demonstrates how to use the `useEffect` hook to synchronize a component with an external system, specifically updating the document title whenever a counter changes.

```jsx
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // useEffect runs after the component renders.
  // The dependency array [count] ensures it only triggers when 'count' changes.
  useEffect(() => {
    document.title = `Count: ${count}`;
    
    // Optional: Return a cleanup function to run before the next effect
    return () => {
      document.title = 'React App';
    };
  }, [count]); 

  return (
    <div>
      <p>Count is {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default Counter;
```

## Key takeaways
* **Dependency Array**: Controls when the effect runs; an empty array `[]` runs only on mount, while omitting it runs on every render.
* **Cleanup Function**: Returning a function from `useEffect` allows you to perform teardown logic, such as removing event listeners or canceling subscriptions.
* **Synchronization**: `useEffect` is designed to keep your UI in sync with external state (like browser APIs, data fetching, or timers).
