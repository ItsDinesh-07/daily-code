# Notes & Interview Tips: React (Vite): Performance Optimization with useMemo and useCallback

## Common Pitfalls & Anti-Patterns

1. **Memoizing Without `React.memo` on Child Components**
   * *Mistake:* Wrapping an event handler in `useCallback` and passing it to a child component that is not wrapped in `React.memo`. By default, React re-renders all children when a parent re-renders, regardless of whether their props changed.
   * *Fix:* Only memoize callbacks passed down to components explicitly wrapped in `React.memo`, or when the callback is a dependency of another hook (e.g., `useEffect`).

2. **Premature and Over-Optimization**
   * *Mistake:* Wrapping trivial computations (e.g., string concatenation, basic array mapping of small lists) or simple inline handlers in `useMemo` or `useCallback`. Hook initialization, dependency comparison, and garbage collection overhead often exceed the cost of the re-computation.
   * *Fix:* Profile first using the React Profiler. Apply `useMemo` only for computationally expensive calculations (e.g., thousands of items, complex regex, heavy sorting) or reference stability.

3. **Stale Closures from Incomplete Dependency Arrays**
   * *Mistake:* Omitting state or props from the dependency array to prevent recalculation, causing the callback to capture and operate on outdated state.
   * *Fix:* Always adhere to `eslint-plugin-react-hooks`. If state updates depend on previous state, use functional updates (e.g., `setCount(prev => prev + 1)`) to eliminate the state variable from the dependencies.

---

## Key Interview Questions

### 1. What is the difference between `useMemo` and `useCallback`, and how are they related?
*Model Answer:*  
`useMemo` caches the **result** of invoking a function, while `useCallback` caches the **function instance itself**.  
Syntactically and mechanically, `useCallback(fn, deps)` is syntactic sugar for `useMemo(() => fn, deps)`. Use `useMemo` for expensive computations and `useCallback` for preserving referential equality of callbacks passed to memoized children or dependency arrays.

### 2. When does wrapping a function in `useCallback` actually yield a performance benefit?
*Model Answer:*  
`useCallback` provides performance benefits in two primary scenarios:
1. When passed as a prop to a child component wrapped in `React.memo` (or a PureComponent), preventing unnecessary child re-renders caused by new function references on every parent render.
2. When the callback is listed in the dependency array of another hook (e.g., `useEffect`, `useMemo`), preventing the dependent hook from re-running on every render.

### 3. Does using Vite alter the behavior or optimization strategy of `useMemo` and `useCallback`?
*Model Answer:*  
No. `useMemo` and `useCallback` belong entirely to the React runtime reconciler, so their execution mechanics are identical regardless of the bundler. However, Vite’s ES-module-based dev server and fast Hot Module Replacement (HMR) make state retention and hook updates faster during development, while Rollup generates highly optimized production chunks where reference identity checks run with minimal runtime overhead.

---

## Best Practices Summary

* **Profile Before Memoizing:** Use React Developer Tools Profiler to verify that a component re-render is actually a bottleneck before adding hooks.
* **Maintain Referential Equality for Children:** Pair `useCallback` and `useMemo` with `React.memo` on target child components to avoid redundant renders.
* **Keep Dependencies Minimal:** Leverage functional state updates (`setVal(prev => ...)`), `useRef` for mutable non-rendering values, and extract non-dependent logic outside the component.
* **Avoid Primitive Memoization:** Do not wrap primitive values (strings, booleans, numbers) in `useMemo`; React compares primitives by value, not reference.
* **Enforce Lint Rules:** Never disable `react-hooks/exhaustive-deps`. Treat dependency warnings as design indicators to refactor rather than suppress.
