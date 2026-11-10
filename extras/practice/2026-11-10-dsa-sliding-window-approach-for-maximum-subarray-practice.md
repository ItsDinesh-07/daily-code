# Practice Exercises: DSA: Sliding Window Approach for Maximum Subarray

Practice applying fixed and dynamic sliding window techniques to compute maximum subarray sums and lengths in $O(n)$ time complexity.

---

### Exercise 1: Maximum Sum Subarray of Fixed Size $K$

**Task:**  
Write a function `max_sub_array_of_size_k` that calculates the maximum sum of any contiguous subarray of size `k` in an array of integers.

**Starter Code:**
```python
def max_sub_array_of_size_k(k: int, nums: list[int]) -> int:
    # TODO: Initialize window sum and max sum using the first k elements
    # TODO: Slide the window across nums, updating the running sum in O(1) time
    pass
```

**Expected Output & Assertions:**
```python
assert max_sub_array_of_size_k(3, [2, 1, 5, 1, 3, 2]) == 9  # Subarray: [5, 1, 3]
assert max_sub_array_of_size_k(2, [2, 3, 4, 1, 5]) == 7     # Subarray: [3, 4]
assert max_sub_array_of_size_k(1, [-1, -2, -3]) == -1       # Subarray: [-1]
```

---

### Exercise 2: Maximum Length Subarray with Sum Constraint

**Task:**  
Given an array of positive integers `nums` and a positive integer `target`, determine the maximum length of a contiguous subarray whose sum is less than or equal to `target`.

**Starter Code:**
```python
def max_len_subarray_at_most_target(nums: list[int], target: int) -> int:
    left = 0
    current_sum = 0
    max_len = 0
    
    # TODO: Expand window with right pointer
    # TODO: Shrink from left while current_sum exceeds target
    # TODO: Track max_len
    return max_len
```

**Solution Snippet:**
```python
def max_len_subarray_at_most_target(nums: list[int], target: int) -> int:
    left = 0
    current_sum = 0
    max_len = 0
    for right in range(len(nums)):
        current_sum += nums[right]
        while current_sum > target:
            current_sum -= nums[left]
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len

assert max_len_subarray_at_most_target([1, 2, 1, 0, 1, 1, 0], 4) == 5
assert max_len_subarray_at_most_target([3, 1, 2, 7, 4], 5) == 2
```

---

### Exercise 3: Maximum Sum Subarray of Size $K$ with Distinct Elements

**Task:**  
Given an integer array `nums` and an integer `k`, find the maximum subarray sum of all contiguous subarrays of length `k` where all elements in the subarray are pairwise distinct. Return `0` if no valid subarray exists.

**Starter Code:**
```python
def max_distinct_subarray_sum(nums: list[int], k: int) -> int:
    # TODO: Maintain both the running sum and a frequency map/set of elements
    # TODO: Slide the window of size k and only update max_sum when all elements are unique
    pass
```

**Expected Output & Assertions:**
```python
# [1, 5, 4] -> sum 10; [5, 4, 2] -> sum 11; other size-3 windows contain duplicates
assert max_distinct_subarray_sum([1, 5, 4, 2, 9, 9, 9], 3) == 15 # Subarray: [4, 2, 9]
assert max_distinct_subarray_sum([4, 4, 4], 3) == 0               # Duplicate elements
```

---

## Self-Check Checklist

- [ ] Does your fixed-size window slide in $O(1)$ per step by adding the incoming element and subtracting the outgoing element?
- [ ] Are dynamic window boundaries (`left` and `right`) correctly adjusted without resetting the pointers unnecessarily?
- [ ] For problems requiring distinct elements, does your solution synchronize the frequency map/set state with the sliding window in $O(1)$ average time?
- [ ] Have edge cases (e.g., $k > \text{len}(nums)$, all negative numbers, single-element arrays) been handled properly?
