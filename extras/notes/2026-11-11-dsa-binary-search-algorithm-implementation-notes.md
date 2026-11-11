# Notes & Interview Tips: DSA: Binary Search Algorithm Implementation

## Common Pitfalls & Anti-Patterns

1. **Integer Overflow in Midpoint Calculation:**
   * *Mistake:* Using `mid = (low + high) / 2`. In languages with fixed-width integers (e.g., C++, Java), when `low + high` exceeds the maximum integer limit (e.g., $2^{31}-1$), it causes an arithmetic overflow yielding a negative value.
   * *Correction:* Use `mid = low + (high - low) / 2` or bitwise right-shift `mid = ((unsigned int)low + (unsigned int)high) >> 1`.

2. **Loop Condition and Boundary Mismatch (Off-by-One / Infinite Loops):**
   * *Mistake:* Mixing `while (low <= high)` with `high = mid` or `while (low < high)` with `high = mid - 1`. This leads to either missing the target element or falling into an infinite loop when `high - low == 1`.
   * *Correction:* Explicitly choose an interval invariant:
     * *Closed interval `[low, high]`*: Use `while (low <= high)` with `low = mid + 1` and `high = mid - 1`.
     * *Half-open interval `[low, high)`*: Use `while (low < high)` with `low = mid + 1` and `high = mid`.

3. **Incorrect Convergence in Bisect/Bound Variants:**
   * *Mistake:* Discarding potential candidates too aggressively when searching for the first/last occurrence of a value or searching monotonic answer spaces. For example, setting `high = mid - 1` when finding the leftmost valid answer.
   * *Correction:* When `mid` can be the answer, retain it (`high = mid` or record `ans = mid`) and shift the opposing pointer past `mid` (`low = mid + 1`).

## Key Interview Questions

### 1. How do you implement standard binary search to find an exact target value?
**Model Answer:**  
Use a closed search interval `[low, high]`. Initialize `low = 0`, `high = arr.length - 1`. Loop while `low <= high`. Calculate `mid = low + (high - low) / 2`. If `arr[mid] == target`, return `mid`. If `arr[mid] < target`, shrink from the left: `low = mid + 1`. Else, shrink from the right: `high = mid - 1`. If the loop exits, return `-1`.  
*Complexity:* $O(\log n)$ time, $O(1)$ space.

### 2. How do you find the first (leftmost) occurrence of an element in an array with duplicates?
**Model Answer:**  
Use the lower-bound pattern. Set `low = 0` and `high = arr.length`. While `low < high`:
```python
mid = low + (high - low) // 2
if arr[mid] >= target:
    high = mid  # mid could be the first occurrence; do not discard it
else:
    low = mid + 1
```
After the loop, check if `low < arr.length` and `arr[low] == target`. If true, return `low`; otherwise, return `-1`.

### 3. What is "Binary Search on Answer" and how do you identify problems suited for it?
**Model Answer:**  
Binary search on answer applies when the problem asks for the minimum or maximum value of a parameter satisfying a condition, and the feasibility function is monotonic (i.e., if condition holds for $x$, it holds for all $y \ge x$, or vice versa).  
*Approach:* Identify the valid search range `[min_ans, max_ans]` and define a boolean helper `isValid(mid)`. Perform binary search over the values in this range rather than an array index.  
*Example:* "Capacity to Ship Packages Within D Days" or "Koko Eating Bananas".  
*Complexity:* $O(T \cdot \log(\text{range}))$, where $T$ is the runtime of `isValid()`.

## Best Practices Summary

* **Pick an Invariant and Stick to It:** Define whether the search interval is `[low, high]` or `[low, high)` before writing code; ensure pointer movements and loop conditions match the invariant.
* **Prevent Overflow:** Always calculate mid as `low + (high - low) / 2`.
* **Prefer Iterative Over Recursive:** Iterative implementations run in $O(1)$ auxiliary space and avoid recursion stack overhead or stack overflow issues.
* **Recognize Monotonicity:** Binary search is not limited to sorted arrays; any discrete search space with a monotonic predicate (`[F, F, ..., F, T, T, ...]`) can be searched in logarithmic steps.
* **Check Edge Cases:** Verify arrays of size 0, 1, and 2, target smaller than `arr[0]`, target greater than `arr[n-1]`, and arrays where all elements are identical.
