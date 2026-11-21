# Merge Sort Algorithm

Merge Sort is a "divide and conquer" algorithm that recursively splits an array into halves, sorts them, and then merges the sorted halves back together. It provides a stable, predictable time complexity of O(n log n).

```python
def merge_sort(arr):
    # Base case: arrays with 0 or 1 element are already sorted
    if len(arr) <= 1:
        return arr

    # Split the array into two halves
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    # Merge the sorted halves
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    # Compare elements and append the smaller one to result
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    # Append any remaining elements from either list
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example usage
data = [38, 27, 43, 3, 9, 82, 10]
print(f"Sorted array: {merge_sort(data)}")
```

## Key takeaways
* **Time Complexity:** O(n log n) in all cases (best, average, and worst).
* **Space Complexity:** O(n) as it requires additional memory for temporary arrays during the merge step.
* **Stability:** It is a stable sort, meaning it preserves the relative order of equal elements.
* **Divide and Conquer:** The approach is highly efficient for large datasets and is often used for sorting linked lists.
