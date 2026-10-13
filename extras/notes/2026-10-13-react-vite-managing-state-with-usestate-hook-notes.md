# Notes & Interview Tips: React (Vite): Managing State with useState Hook

## Common Pitfalls & Anti-Patterns

*   **Mutating State Directly:** Never modify the state variable directly (e.g., `state.count = 1`). React will not trigger a re-render. **Fix:** Always use the setter function (e.g., `setCount(1)`).
*   **Stale State Closures:** Relying on the current state variable inside an asynchronous function or multiple consecutive updates. **Fix:** Use the functional update pattern: `setCount(prev => prev + 1)`.
*   **Over-using useState for Derived Data:** Storing values that can be calculated from existing props or state (e.g., storing `fullName` when you have `firstName` and `lastName`). **Fix:** Calculate derived values during render or use `useMemo`.

## Key Interview Questions

*   **Q: How does `useState` trigger a UI update?**
    *   **A:** When the setter function is called, React compares the new value to the old value (using `Object.is`). If they differ, React schedules a re-render of the component to update the Virtual DOM and synchronize it with the actual DOM.
*   **Q: Why must you avoid calling `useState` inside loops, conditions, or nested functions?**
    *   **A:** React relies on the call order of hooks to associate state with the correct component instance. Conditional or nested calls break this order, leading to unstable state tracking and runtime errors.
*   **Q: What happens if you call the setter function with the exact same value as the current state?**
    *   **A:** React performs a shallow comparison. If the new state is identical to the current state, React will bail out of the update and skip the re-render for that component and its children.

## Best Practices Summary

*   **Keep State Minimal:** Only store what is absolutely necessary; derive the rest.
*   **Use Functional Updates:** Always use the callback form (`setCount(prev => ... )`) when the new state depends on the previous state.
*   **Lift State Up:** Move state to the lowest common ancestor if multiple components need access to the same data.
*   **Type Safety:** If using TypeScript, explicitly define the state type: `useState<string | null>(null)`.
*   **Initialization:** For expensive state initialization, pass a function to `useState` (lazy initialization) to avoid repeated calculation on re-renders: `useState(() => expensiveCalculation())`.
