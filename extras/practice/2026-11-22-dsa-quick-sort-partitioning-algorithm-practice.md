# Practice Exercises: DSA: Quick Sort Partitioning Algorithm

This section focuses on implementing and tracing the Lomuto and Hoare partitioning schemes to reinforce your understanding of pivot placement and array reordering.

### Exercise 1: Lomuto Partitioning Implementation
**Task:** Implement the `partition` function using the Lomuto scheme (pivot as the last element). The function should return the index of the pivot after rearranging the elements.

**Starter Code:**
```python
def partition(arr, low, high):
    pivot = arr[high]
    # TODO: Implement partitioning logic
    return i + 1
```
**Expected Output:** For `arr = [10, 7, 8, 9, 1, 5]` and `low=0, high=5`, the array should be reordered (e.g., `[1, 5, 7, 8, 9, 10]`) and the function should return `1` (the index of pivot `5`).

### Exercise 2: Trace the Pivot Placement
**Task:** Given the array `[3, 5, 8, 1, 2, 9, 4, 7, 6]` and using the last element (`6`) as the pivot, perform one manual pass of the Lomuto partition. Write down the sequence of swaps performed.

**Scenario:**
- Start with `i = low - 1`.
- Iterate `j` from `low` to `high - 1`.
- If `arr[j] <= 6`, increment `i` and swap `arr[i]` with `arr[j]`.

**Solution Snippet:** The final array state should have all elements smaller than `6` on the left and all elements larger than `6` on the right: `[3, 5, 1, 2, 4, 6, 8, 9, 7]`.

### Exercise 3: Partitioning with Duplicate Keys
**Task:** Modify a standard partitioning function to handle an array with many duplicate values (e.g., `[2, 2, 2, 2, 2]`). Explain how the partition index affects efficiency in this scenario.

**Starter Code:**
```python
# Observe how your current partition logic handles this input:
arr = [2, 2, 2, 2, 2]
# Assert that the function returns a valid index between 0 and 4.
```
**Expected Output:** Regardless of the specific implementation, the algorithm should avoid infinite loops and correctly place the pivot, maintaining an $O(n)$ complexity per partition pass.

## Self-Check Checklist
* [ ] Can I explain the difference between the Lomuto and Hoare partitioning schemes?
* [ ] Does my implementation correctly handle edge cases, such as an empty array or an array with one element?
* [ ] Can I manually trace the `i` and `j` pointers through a partition pass without external tools?
* [ ] Have I considered how the choice of pivot (first, last, or random) impacts the overall time complexity?
