# Practice Exercises: DSA: Dynamic Programming - House Robber Problem

Master the House Robber pattern by learning to derive recurrence relations and optimize space complexity in non-adjacent selection problems.

### 1. The Basic Recurrence
**Task:** Implement the `rob` function using a bottom-up approach with an array `dp` where `dp[i]` stores the maximum loot possible up to house `i`.
**Starter Code:**
```python
def rob(nums):
    if not nums: return 0
    # Your code here
```
**Expected Output:** For `nums = [2, 7, 9, 3, 1]`, the output should be `12`.

### 2. Space Optimization
**Task:** Refactor your previous solution to use only two variables (`prev1`, `prev2`) instead of a full `dp` array to achieve $O(1)$ space complexity.
**Starter Code:**
```python
def rob_optimized(nums):
    prev2, prev1 = 0, 0
    # Your code here
```
**Assertion:** `assert rob_optimized([2, 1, 1, 2]) == 4`

### 3. Circular Variation
**Task:** Modify the logic to solve the "House Robber II" problem, where all houses are arranged in a circle (the first and last house are neighbors).
**Scenario:** If you rob the first house, you cannot rob the last one.
**Solution Snippet:** 
```python
def rob_circular(nums):
    if len(nums) == 1: return nums[0]
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
```
**Goal:** Ensure the logic correctly handles an array of length 3 by excluding the adjacency loop.

## Self-Check Checklist
* [ ] Did I correctly identify the base cases (e.g., empty array, one house)?
* [ ] Does my recurrence relation `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` correctly represent the "rob or skip" choice?
* [ ] Can I explain why the space complexity drops from $O(n)$ to $O(1)$?
* [ ] Have I accounted for edge cases like arrays with length 0 or 1?
