# Notes & Interview Tips: React (Vite): Custom Hook for Form Input Handling

## Common Pitfalls & Anti-Patterns

*   **State Bloat:** Creating a separate `useState` for every single input field instead of managing the form state as an object. **Avoid this** by using a single state object `[values, setValues]` or a dedicated hook to handle updates dynamically via `event.target.name`.
*   **Excessive Re-renders:** Triggering a full component re-render on every keystroke for complex forms. **Avoid this** by using uncontrolled components with `useRef` for high-frequency updates, or ensuring the custom hook logic is memoized to prevent unnecessary downstream prop drilling.
*   **Missing Validation Logic:** Treating custom hooks only as state wrappers and ignoring input validation. **Avoid this** by returning an `errors` object or a `touched` state from the hook to keep UI logic coupled with state management.

## Key Interview Questions

1. **How do you handle multiple input fields in a single custom hook?**
   * *Answer:* Use an object state where keys correspond to input names. In the handler function, use `setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))`. This makes the hook reusable for any form regardless of the number of fields.
2. **When should you choose a custom hook over a library like React Hook Form?**
   * *Answer:* Custom hooks are ideal for lightweight forms, simple login pages, or when avoiding third-party dependencies is a requirement. Use a library like React Hook Form for complex, large-scale forms involving deep nesting, extensive validation schemas, or performance optimization requirements.
3. **How does Vite improve the development experience for form-heavy applications?**
   * *Answer:* Vite uses ES modules and optimized build tools (esbuild/Rollup), providing near-instant Hot Module Replacement (HMR). This allows developers to tweak form state logic and see UI changes immediately without the long rebuild times associated with older Webpack-based configurations.

## Best Practices Summary

*   **Dynamic Keys:** Always use `[e.target.name]` syntax to make the hook agnostic to the specific input field.
*   **Clear API:** Return a consistent interface: `values`, `handleChange`, `resetForm`, and optionally `errors`.
*   **Type Safety:** Use TypeScript generics (e.g., `<T>`) to ensure the form state is type-safe based on the initial values provided.
*   **Controlled Components:** Maintain the "Single Source of Truth" by ensuring form inputs reflect the state managed within the hook.
*   **Separation of Concerns:** Keep validation logic (if present) outside the state-setting function to maintain code readability.
