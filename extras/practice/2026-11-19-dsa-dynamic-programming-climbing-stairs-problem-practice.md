# Practice Exercises: DSA: Dynamic Programming - Climbing Stairs Problem

Practice identifying optimal substructure, setting up recurrence relations, and optimizing space complexity for the classic Climbing Stairs problem and its variants.

---

### Exercise 1: Standard Climbing Stairs with $O(1)$ Space

**Task:**  
You are climbing a staircase with `n` steps. Each time, you can climb either `1` or `2` steps. Implement `climb_stairs(n)` using dynamic programming with $O(n)$ time complexity and $O(1)$ auxiliary space.

**Starter Code:**
```python
def climb_stairs(n: int) -> int:
    # TODO: Handle base cases and compute the total distinct ways
    # using two variables to maintain O(1) space.
    pass
```

**Expected Output & Assertions:**
```python
assert climb_stairs(1) == 1
assert climb_stairs(2) == 2
assert climb_stairs(3) == 3
assert climb_stairs(5) == 8
assert climb_stairs(10) == 89
```

---

### Exercise 2: Min Cost Climbing Stairs

**Task:**  
You are given an integer array `cost` where `cost[i]` is the cost of the $i$-th step on a staircase. Once you pay the cost, you can climb either `1` or `2` steps. You can start from index `0` or index `1`. Return the minimum cost to reach the top of the floor (index `len(cost)`).

**Starter Code:**
```python
def min_cost_climbing_stairs(cost: list[int]) -> int:
    # TODO: Implement recurrence: dp[i] = cost[i] + min(dp[i-1], dp[i-2])
    # Compute the minimum cost to reach beyond the final index.
    pass
```

**Expected Output & Assertions:**
```python
# Explanation: Start at index 1, pay 15, climb two steps to reach the top.
assert min_cost_climbing_stairs([10, 15, 20]) == 15

# Explanation: Pay costs at indices [0, 2, 4, 6, 7, 9] -> total 6
assert min_cost_climbing_stairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) == 6
```

---

### Exercise 3: Generalized $k$-Step Climbing Stairs

**Task:**  
Extend the climbing stairs problem so that from any step, you can take up to $k$ steps at a time (i.e., you can take $1, 2, \dots, k$ steps). Implement `climb_stairs_k(n, k)` which returns the number of distinct ways to reach step `n`.

**Starter Code:**
```python
def climb_stairs_k(n: int, k: int) -> int:
    # TODO: Define base cases where dp[0] = 1.
    # Transition: dp[i] = sum(dp[i - j]) for 1 <= j <= min(i, k)
    pass
```

**Solution Snippet:**
```python
def climb_stairs_k(n: int, k: int) -> int:
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        for j in range(1, min(i, k) + 1):
            dp[i] += dp[i - j]
    return dp[n]

assert climb_stairs_k(4, 2) == 5  # Same as classic stairs
assert climb_stairs_k(4, 3) == 7  # Steps allowed: 1, 2, or 3
```

---

## Self-Check Checklist

- [ ] Can you identify the base cases ($n = 0, 1, 2$) without causing off-by-one errors?
- [ ] Did you optimize the standard stairs recurrence from an $O(n)$ array to two running variables?
- [ ] In the min-cost variant, did you account for reaching step $n$ (the floor beyond the last stair) rather than stopping at step $n-1$?
- [ ] For the $k$-step variant, is the inner transition bounded correctly by $\min(i, k)$ to prevent out-of-bounds indexing?
