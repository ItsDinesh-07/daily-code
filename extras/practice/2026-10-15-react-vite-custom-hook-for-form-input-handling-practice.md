# Practice Exercises: React (Vite): Custom Hook for Form Input Handling

This section helps you master state management in forms by building and implementing a reusable `useFormInput` hook to minimize boilerplate code in React components.

### Exercise 1: Build the `useFormInput` Hook
**Task:** Create a custom hook that accepts an initial value and returns an object containing the current value and a change handler function.
**Starter Code:**
```javascript
export function useFormInput(initialValue) {
  // Implement state and handler here
}
```
**Solution:**
```javascript
import { useState } from 'react';
export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  const onChange = (e) => setValue(e.target.value);
  return { value, onChange };
}
```

### Exercise 2: Implementing the Hook in a Component
**Task:** Use your `useFormInput` hook to manage the state of two separate inputs (username and email) inside a simple login form component.
**Starter Code:**
```jsx
function LoginForm() {
  const username = useFormInput('');
  const email = useFormInput('');
  return (
    <form>
      <input {...username} placeholder="Username" />
      <input {...email} placeholder="Email" />
    </form>
  );
}
```
**Expected Output:** Both inputs should remain controlled and update their respective state variables independently when the user types.

### Exercise 3: Adding a Reset Feature
**Task:** Update the `useFormInput` hook to return a third property: a `reset` function that sets the input value back to the initial provided value.
**Starter Code:**
```javascript
// Extend your hook to return: { value, onChange, reset }
const { value, onChange, reset } = useFormInput('');
// Usage in component:
<button onClick={reset}>Clear Field</button>
```
**Expected Output:** Clicking the button should clear the specific input field associated with that instance of the hook.

## Self-Check Checklist
* [ ] Does the hook correctly use the spread operator (`{...inputProps}`) to attach `value` and `onChange` to the input element?
* [ ] Can you verify that multiple instances of the hook in one component do not share state?
* [ ] Have you ensured the hook follows the `use` naming convention for React ESLint rules?
* [ ] Is the state update logic inside the hook properly handling event objects from `e.target.value`?
