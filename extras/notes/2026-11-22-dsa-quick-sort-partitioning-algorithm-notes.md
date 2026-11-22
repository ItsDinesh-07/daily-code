# Notes & Interview Tips: DSA: Quick Sort Partitioning Algorithm

## Common Pitfalls & Anti-Patterns

*   **Incorrect Pivot Placement:** Using the first or last element as a pivot on an already sorted array leads to $O(n^2)$ time complexity. **Avoid by:** Implementing "Median-of-Three" or picking a random element as the pivot to ensure $O(n \log n)$ average performance.
*   **Off-by-One Errors in Pointers:** Mismanaging the boundary of the `left` and `right` pointers during the swapping phase (Lomuto vs. Hoare schemes). **Avoid by:** Clearly defining your invariant (e.g., "all elements to the left of `i` are $\le$ pivot") and dry-running a small array (e.g., `[3, 1, 2]`) before coding.
*   **Handling Duplicate Keys:** Failing to account for duplicate values can lead to infinite loops or partitioning imbalances. **Avoid by:** Using Hoare’s partition scheme, which handles duplicates more efficiently by stopping pointers at elements equal to the pivot.

## Key Interview Questions

1.  **Explain the difference between the Lomuto and Hoare partition schemes.**
    *   *Model Answer:* Lomuto uses one pointer and is easier to implement but less efficient with many duplicates. Hoare uses two pointers moving inward and is generally more efficient, performing three times fewer swaps on average and handling duplicates well.
2.  **How do you achieve $O(n \log n)$ in the worst-case scenario?**
    *   *Model Answer:* Use a randomized pivot selection or the "Median-of-Three" approach. Additionally, for very small sub-arrays, switch to Insertion Sort to reduce recursion overhead.
3.  **Can Quick Sort be implemented to use $O(\log n)$ auxiliary space?**
    *   *Model Answer:* Yes. By always recursing into the smaller partition first and using a tail-call optimization or an explicit stack for the larger partition, you limit the stack depth to $O(\log n)$.

## Best Practices Summary

*   **Stability:** Remember that Quick Sort is **not** stable; relative order of equal elements is not guaranteed.
*   **In-Place:** Leverage the fact that Quick Sort is an in-place algorithm, requiring only $O(\log n)$ space for the call stack.
*   **Partition Logic:** Maintain a clear invariant: elements `< pivot` move to the left, elements `> pivot` move to the right.
*   **Base Case:** Always explicitly define the base case: if `low >= high`, the sub-array is sorted/empty, return immediately.
*   **Testing:** Always test with edge cases: empty arrays, single-element arrays, and arrays with all identical elements.
