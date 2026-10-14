# Practice Exercises: React (Vite): Side Effects with useEffect Hook

This section focuses on mastering lifecycle synchronization, dependency array management, and clean-up functions in React.

### 1. Data Fetching on Mount
**Task:** Create a component that fetches a random joke from the [Official Joke API](https://official-joke-api.appspot.com/random_joke) when the component mounts and displays it.
**Starter Code:**
```jsx
function JokeComponent() {
  const [joke, setJoke] = useState(null);
  // Implement useEffect here
  return <div>{joke ? `${joke.setup} - ${joke.punchline}` : 'Loading...'}</div>;
}
```
**Expected Output:** The component should show "Loading..." briefly, then update the UI with the fetched joke object once.

### 2. The Dependency Array
**Task:** Create a counter component with a "Title" input. Update the document title to show the current count, but ensure the effect *only* runs when the count changes, ignoring changes to the input field.
**Starter Code:**
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  // Implement useEffect here to update document.title
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </>
  );
}
```
**Expected Output:** `document.title` updates only when the button is clicked. Typing in the input field must not trigger the effect.

### 3. Implementing Clean-up
**Task:** Create a timer component that starts an interval incrementing a second count every second. Use the clean-up function to clear the interval when the component unmounts to prevent memory leaks.
**Starter Code:**
```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    // Add interval logic and return clean-up function
  }, []);
  return <p>Seconds: {seconds}</p>;
}
```
**Expected Output:** The count increments every second. If the component is removed from the DOM, the interval must be cleared (can be verified via `console.log` in the clean-up function).

## Self-Check Checklist
* [ ] Did I provide an empty dependency array `[]` for code that should only run on mount?
* [ ] Have I included a return function in `useEffect` whenever I start a subscription or interval?
* [ ] Did I include every reactive dependency (state/props) inside the dependency array to avoid stale closures?
* [ ] Did I verify that my effect doesn't create an infinite loop by modifying state that is also a dependency?
