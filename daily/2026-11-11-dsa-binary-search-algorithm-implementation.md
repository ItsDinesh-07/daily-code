# Binary Search Algorithm Implementation

Binary search is an efficient divide-and-conquer algorithm that locates a target value within a sorted array in $O(\log n)$ time. It continuously halves the search space by comparing the target to the middle element until the element is found or the search space becomes empty.

```python
def binary_search(arr: list[int], target: int) -> int:
    """Perform iterative binary search on a sorted array.

    Returns the index of target if found, otherwise returns -1.
    """
    left = 0
    right = len(arr) - 1

    while left <= right:
        # Calculate mid index; avoids potential overflow in fixed-width integers
        mid = left + (right - left) // 2

        # Check if the target is present at mid
        if arr[mid] == target:
            return mid
        # If target is greater, ignore left half
        elif arr[mid] < target:
            left = mid + 1
        # If target is smaller, ignore right half
        else:
            right = mid - 1

    # Target was not present in the array
    return -1


if __name__ == "__main__":
    # Test dataset (must be sorted)
    sorted_numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]

    # Test cases: finding an existing element and a missing element
    target_found = 23
    target_missing = 40

    idx_found = binary_search(sorted_numbers, target_found)
    idx_missing = binary_search(sorted_numbers, target_missing)

    print(f"Index of {target_found}: {idx_found}")      # Expected: 5
    print(f"Index of {target_missing}: {idx_missing}")  # Expected: -1
```

## Key takeaways

- **Prerequisite**: The input collection must be sorted prior to searching.
- **Time Complexity**: $O(\log n)$ for average and worst cases, reducing search time exponentially compared to linear search ($O(n)$).
- **Space Complexity**: $O(1)$ auxiliary memory using the iterative pointer approach (`left` and `right`).
- **Midpoint Calculation**: Using `left + (right - left) // 2` instead of `(left + right) // 2` prevents integer overflow bugs in languages with fixed-width integer types (e.g., C/C++, Java).
