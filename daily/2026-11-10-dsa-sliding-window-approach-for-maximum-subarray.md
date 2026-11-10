# Sliding Window: Maximum Sum Subarray

The sliding window technique finds the maximum sum of a contiguous subarray of size 'k' by maintaining a running sum, adding the next element and removing the first element as the window shifts. This reduces time complexity from O(n*k) to O(n).

```python
def max_sum_subarray(arr, k):
    n = len(arr)
    if n < k: return None

    # Calculate sum of the first window
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Slide the window from index 1 to n-k
    for i in range(n - k):
        # Subtract the element leaving the window, add the one entering
        window_sum = window_sum - arr[i] + arr[i + k]
        max_sum = max(max_sum, window_sum)

    return max_sum

# Example usage:
nums = [2, 1, 5, 1, 3, 2]
k = 3
print(f"Maximum sum of subarray of size {k}: {max_sum_subarray(nums, k)}")
```

## Key takeaways
* **Efficiency**: Operates in O(n) time complexity as each element is visited at most twice.
* **Mechanism**: Instead of recalculating the entire sum, it updates the previous sum by subtracting the outgoing element and adding the incoming one.
* **Constraint**: Ideal for problems involving fixed-size contiguous segments in an array or string.
