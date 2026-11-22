# Quick Sort Partitioning (Lomuto Scheme)

The partition algorithm rearranges an array around a "pivot" element, ensuring all elements smaller than the pivot are on the left and larger ones are on the right. It returns the final index of the pivot.

```python
def partition(arr, low, high):
    # Choosing the last element as the pivot
    pivot = arr[high]
    # Pointer for the position of the smaller element
    i = low - 1
    
    for j in range(low, high):
        # If current element is smaller than or equal to pivot
        if arr[j] <= pivot:
            i += 1
            # Swap elements
            arr[i], arr[j] = arr[j], arr[i]
            
    # Swap the pivot element into its correct sorted position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Example usage:
data = [10, 7, 8, 9, 1, 5]
pivot_idx = partition(data, 0, len(data) - 1)
print(f"Partitioned array: {data}, Pivot index: {pivot_idx}")
```

## Key takeaways
* **In-place:** The partitioning process requires $O(1)$ extra space as it modifies the array directly.
* **Linear Time:** A single pass through the range $[low, high]$ performs the partitioning in $O(n)$ time.
* **Pivot Placement:** The algorithm guarantees that after partitioning, the pivot element is at its exact final position in the sorted array.
