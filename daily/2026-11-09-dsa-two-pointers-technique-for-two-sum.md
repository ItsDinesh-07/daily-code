# Two Pointers Technique for Two Sum

The Two Pointers technique efficiently finds two numbers in a sorted array that sum to a target value by placing one pointer at each end and moving them inward. This approach reduces the time complexity to O(n) compared to the O(n²) brute force method.

```python
def two_sum_sorted(arr, target):
    """
    Finds two numbers in a sorted list that add up to the target.
    Returns the pair if found, otherwise returns None.
    """
    left = 0
    right = len(arr) - 1

    while left < right:
        current_sum = arr[left] + arr[right]

        if current_sum == target:
            return (arr[left], arr[right])  # Target found
        elif current_sum < target:
            left += 1  # Need a larger sum, move left pointer right
        else:
            right -= 1  # Need a smaller sum, move right pointer left

    return None

# Example usage:
nums = [1, 2, 3, 4, 6]
result = two_sum_sorted(nums, 10)
print(f"Pair found: {result}") # Output: (4, 6)
```

## Key takeaways
* **Prerequisite:** The array must be sorted for this technique to work.
* **Efficiency:** Time complexity is O(n) and space complexity is O(1).
* **Logic:** If the sum is too low, increment the left pointer; if too high, decrement the right pointer.
