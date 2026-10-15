# Custom Hook for Form Input Handling

This custom hook simplifies form state management by returning the input value and an object of change handlers. It encapsulates the repetitive `useState` logic required for controlled components.

```jsx
import { useState } from 'react';

// Custom hook to manage form input state
export function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  // Helper to handle input change events
  const onChange = (e) => setValue(e.target.value);

  // Return the value and the change handler as props
  return { value, onChange };
}

// Example usage in a component
export default function SimpleForm() {
  const name = useInput('');

  return (
    <form>
      <input type="text" {...name} placeholder="Enter name" />
      <p>Current value: {name.value}</p>
    </form>
  );
}
```

## Key takeaways
* **Composition:** Using the spread operator `...name` automatically binds `value` and `onChange` to the input element.
* **Reusability:** The hook can be used multiple times in a single component to manage distinct form fields independently.
* **Abstraction:** It reduces boilerplate code by centralizing state updates, making component logic cleaner and easier to maintain.
