# Managing State with React useState

The `useState` hook allows functional components to track data that changes over time. When state is updated, React automatically re-renders the component to reflect the new value in the UI.

```jsx
import { useState } from 'react';

export default function Counter() {
  // Declare state variable 'count' initialized to 0
  // 'setCount' is the function used to update the state
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Current count: {count}</p>
      
      {/* Update state by passing a new value to the setter */}
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      
      {/* Reset state to 0 */}
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
```

## Key takeaways
* **Initialization**: `useState(initialValue)` returns an array containing the current state and a function to update it.
* **Immutability**: Always use the setter function to update state; never modify the state variable directly.
* **Re-rendering**: Calling the setter function triggers a component re-render, ensuring the browser view stays in sync with the data.
