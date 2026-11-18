# Notes & Interview Tips: DSA: Queue Implementation using Array

## Common Pitfalls & Anti-Patterns
*   **The "Shifting Elements" Trap:** Avoid shifting elements to the left after a dequeue operation (e.g., `arr[i] = arr[i+1]`). This results in $O(n)$ time complexity. **Solution:** Use two pointers (`front` and `rear`) to keep track of the queue boundaries in $O(1)$.
*   **Ignoring Circularity:** Treating the array as linear leads to "false overflow," where space is wasted at the beginning of the array despite empty slots. **Solution:** Implement a circular queue using the modulo operator: `rear = (rear + 1) % capacity`.
*   **Off-by-One Indexing:** Confusing the `rear` index as pointing to the last element vs. the next available slot. **Solution:** Clearly define if `rear` is the index of the last element or the next insertion point, and initialize accordingly (e.g., `rear = -1` vs `rear = 0`).

## Key Interview Questions
1. **Q: How do you handle the difference between an empty queue and a full queue in a circular array?**
   *   **A:** Maintain a `size` variable that increments on enqueue and decrements on dequeue. Alternatively, keep one slot empty (`(rear + 1) % capacity == front`) to distinguish between full and empty states.
2. **Q: What is the time complexity of enqueue and dequeue operations in an array-based queue?**
   *   **A:** Both operations are $O(1)$. By using circular pointers, we avoid the $O(n)$ cost of shifting elements, ensuring constant time performance.
3. **Q: How would you implement a queue if the array size is not fixed?**
   *   **A:** Use a dynamic array (like `ArrayList` in Java or `std::vector` in C++). If the capacity is reached, reallocate the array to a larger size (typically double) and copy elements, though this makes enqueue $O(n)$ in the worst case (amortized $O(1)$).

## Best Practices Summary
*   **Modular Arithmetic:** Always use `% capacity` for index updates to facilitate circular wrapping.
*   **State Management:** Explicitly define `front` and `rear` indices and use a `size` tracker to simplify empty/full logic.
*   **Defensive Coding:** Always perform bounds checking (`isEmpty()` or `isFull()`) before accessing or inserting elements to prevent `ArrayIndexOutOfBoundsException`.
*   **Space Optimization:** Prefer circular queues over shifting elements to maximize memory utilization without sacrificing performance.
