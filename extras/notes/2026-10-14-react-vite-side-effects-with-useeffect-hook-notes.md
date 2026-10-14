# Notes & Interview Tips: React (Vite): Side Effects with useEffect Hook

## Common Pitfalls & Anti-Patterns

*   **Missing Dependency Array or Stale Closures:** Omitting the dependency array causes the effect to run on *every* render, leading to performance issues or infinite loops. Including variables without declaring them as dependencies leads to stale state/props. 
    *   *Solution:* Always include every reactive value (state, props, refs) used inside the effect in the dependency array. Use the ESLint `exhaustive-deps` rule.
*   **Overusing `useEffect` for Data Derivation:** Developers often use `useEffect` to update state based on other state changes.
    *   *Solution:* If a value can be computed during render (e.g., `const fullName = firstName + lastName`), do it directly in the component body without `useEffect` or state.
*   **Forgetting Cleanup Functions:** Not cleaning up subscriptions, timers, or event listeners causes memory leaks and inconsistent behavior when the component unmounts.
    *   *Solution:* Always return a cleanup function to remove side effects (e.g., `clearTimeout`, `removeEventListener`).

## Key Interview Questions

*   **Q: What is the purpose of the dependency array, and what happens if it is omitted?**
    *   *Answer:* The array tells React when to re-run the effect. If omitted, the effect runs after every single render. If empty (`[]`), it runs only once after the initial mount.
*   **Q: Can you call `useEffect` inside a loop or a condition?**
    *   *Answer:* No. Hooks must be called at the top level of a component to ensure they are executed in the same order every time the component renders, which is essential for React to track their state.
*   **Q: How do you handle race conditions in an asynchronous `useEffect`?**
    *   *Answer:* Use a boolean flag (e.g., `let active = true`) inside the effect. Set it to `false` in the cleanup function and check the flag before updating state to ensure only the result from the latest request is processed.

## Best Practices Summary

*   **Separate Concerns:** Use multiple `useEffect` hooks to separate unrelated logic rather than grouping them into one large block.
*   **Prefer Event Handlers:** If an effect is caused by a user action (e.g., button click), move that logic to the event handler instead of syncing it via state and `useEffect`.
*   **Use Functional Updates:** When updating state inside `useEffect` based on previous state, use the functional update form (e.g., `setCount(c => c + 1)`) to avoid adding the state variable itself to the dependency array.
*   **Minimize Dependencies:** Keep effects lean by extracting complex logic or helper functions outside the component or wrapping them in `useCallback` if they must be inside.
