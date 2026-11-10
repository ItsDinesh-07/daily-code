# Notes & Interview Tips: DSA: Sliding Window Approach for Maximum Subarray

## Common Pitfalls & Anti-Patterns
* **Recalculating from Scratch ($O(n^2)$ time):** Recomputing the sum of every subarray using nested loops instead of reusing the previous window's computation. *Fix:* Maintain a running sum by adding the new incoming element and subtracting the outgoing element ($O(1)$ updates).
* **Incorrect Window Sizing ($O(n \log n)$ or Buggy Pointers):** Confusing fixed-size windows with variable-size windows, or failing to maintain the exact window length $k$. *Fix:* Explicitly track window boundaries (`left` and `right`) and ensure the condition `right - left + 1 == k` is met before recording results.
* **Ignored Edge Cases:** Failing to handle inputs where the array length $n$ is less than the target window size $k$, or dealing entirely with negative numbers. *Fix:* Add an initial guard clause (`if (arr.length < k) return -1;`) and initialize max sums appropriately (e.g., `NegativeInfinity` rather than `0`).

## Key Interview Questions
* **Q1: Given an array of integers and an integer $k$, find the maximum sum of any contiguous subarray of size $k$.**
  * *Model Answer:* Use a fixed-size sliding window. Compute the sum of the first $k$ elements to initialize the window. Then, slide the window one element to the right at a time: add the new element entering on the right and subtract the element exiting on the left. Track the maximum sum seen across all windows. This reduces time complexity from $O(n \cdot k)$ to $O(n)$ with $O(1)$ auxiliary space.
* **Q2: How do you adapt the sliding window approach if the window size is not fixed, but you need to find the maximum sum (or length) given a specific constraint (e.g., sum $\le S$)?**
  * *Model Answer:* Use a dynamic (variable-size) sliding window. Expand the `right` pointer to include elements in the window until the constraint is violated. Once violated, increment the `left` pointer to shrink the window from the left until the constraint is satisfied again. Continuously update the maximum length or sum during the valid states.
* **Q3: What are the primary indicators that a problem can be solved using the sliding window technique?**
  * *Model Answer:* Look for problems dealing with **contiguous** sequences (arrays, strings, or linked lists), requests for optimization (maximum, minimum, longest, shortest), and constraints involving a subset of sequential elements where data from a previous sub-problem overlaps heavily with the current one.

## Best Practices Summary
* Always verify that the problem specifies **contiguous** elements before applying the sliding window technique.
* Clearly define pointer mechanics (`left` and `right`) and ensure window invariants are maintained at every iteration.
* Optimize space complexity down to $O(1)$ by mutating pointers and running sums rather than storing subarray states in auxiliary data structures.
* Clearly state both time ($O(n)$) and space ($O(1)$) complexities to the interviewer after presenting the optimal approach.
