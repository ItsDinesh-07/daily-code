# Practice Exercises: DSA: Binary Search Algorithm Implementation

These exercises are designed to test your ability to implement binary search from scratch, handle edge cases, and adapt the algorithm to solve common boundary-search variations.

---

### Exercise 1: Standard Iterative Binary Search

**Task:**  
Implement an iterative binary search function that returns the index of `target` in a sorted array of distinct integers. Return `-1` if `target` is not present.

**Starter Code:**
```python
def binary_search(nums: list[int], target: int) -> int:
    # Your code here
    pass
```

**Expected Output & Assertions:**
```python
assert binary_search([-5, -1, 0, 3, 5, 9, 12], 9) == 5
assert binary_search([-5, -1, 0, 3, 5, 9, 12], 2) == -1
assert binary_search([], 1) == -1
assert binary_search([7], 7) == 0
```

---

### Exercise 2: Find First Occurrence in Duplicates

**Task:**  
Given a sorted array of integers that may contain duplicates, implement a binary search function to find the **first** (leftmost) index of `target`. Return `-1` if `target` does not exist.

**Starter Code:**
```python
def find_first_occurrence(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    result = -1
    # Complete the implementation
    return result
```

**Solution Snippet:**
```python
def find_first_occurrence(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    result = -1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            result = mid
            right = mid - 1  # Continue searching to the left
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result

assert find_first_occurrence([1, 2, 2, 2, 3, 4], 2) == 1
assert find_first_occurrence([1, 2, 2, 2, 3, 4], 5) == -1
```

---

### Exercise 3: Search Insert Position

**Task:**  
Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be inserted in order, maintaining $O(\log n)$ runtime.

**Starter Code:**
```python
def search_insert(nums: list[int], target: int) -> int:
    # Your code here
    pass
```

**Expected Output & Assertions:**
```python
assert search_insert([1, 3, 5, 6], 5) == 2
assert search_insert([1, 3, 5, 6], 2) == 1
assert search_insert([1, 3, 5, 6], 7) == 4
assert search_insert([1, 3, 5, 6], 0) == 0
```

---

## Self-Check Checklist

- [ ] Did you avoid integer overflow by calculating `mid` using `left + (right - left) // 2`?
- [ ] Are your loop invariants consistent (e.g., using `left <= right` with `mid ± 1` pointer adjustments)?
- [ ] Did you verify boundary conditions: empty array, single-element array, and target outside the range?
- [ ] Does your implementation run in strictly $O(\log n)$ time and $O(1)$ auxiliary space?
