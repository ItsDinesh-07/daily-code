# Practice Exercises: React (Vite): Managing State with useState Hook

This section focuses on applying the `useState` hook to handle dynamic data, user interactions, and conditional UI updates within a Vite-powered React project.

### 1. Counter with Constraints
**Task:** Create a counter that increments by 1 but cannot go below 0.
**Starter Code:**
```jsx
const [count, setCount] = useState(0);
// Implement increment and decrement buttons
```
**Solution Snippet:**
```jsx
<button onClick={() => setCount(count + 1)}>+</button>
<button onClick={() => setCount(Math.max(0, count - 1))}>-</button>
```

### 2. Toggle Visibility
**Task:** Build a "Show/Hide" component that toggles a paragraph of text when a button is clicked.
**Starter Code:**
```jsx
const [isVisible, setIsVisible] = useState(true);
return (
  <>
    <button onClick={() => setIsVisible(!isVisible)}>Toggle</button>
    {/* Add conditional rendering here */}
  </>
);
```
**Expected Output:** Clicking the button should add or remove the paragraph element from the DOM based on the boolean state.

### 3. Input Field Sync
**Task:** Create an input field that updates a "Greeting" message in real-time as the user types their name.
**Starter Code:**
```jsx
const [name, setName] = useState("");
// Bind input value to name and display "Hello, {name}!"
```
**Solution Snippet:**
```jsx
<input value={name} onChange={(e) => setName(e.target.value)} />
<p>Hello, {name}!</p>
```

## Self-Check Checklist
* [ ] Did I import `useState` from the 'react' package at the top of the file?
* [ ] Does every state setter function correctly trigger a re-render in the UI?
* [ ] Did I avoid mutating state variables directly (e.g., `count++`) and instead use the setter function?
* [ ] Are the initial values passed to `useState` appropriate for the data type (string, number, or boolean)?
