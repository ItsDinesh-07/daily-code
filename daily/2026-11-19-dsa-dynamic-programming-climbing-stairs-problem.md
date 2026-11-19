# Climbing Stairs (Dynamic Programming)

The Climbing Stairs problem asks for the number of distinct ways to reach the top of a staircase with $n$ steps, where you can climb either 1 or 2 steps at a time. This is a classic DP problem that follows the Fibonacci sequence pattern.

```python
def climb_stairs(n: int) -> int:
    """Calculates distinct ways to reach step n."""
    if n <= 2:
        return n
    
    # We only need the previous two values to calculate the current one
    # prev2 represents (n-2), prev1 represents (n-1)
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        # Current steps = sum of ways to reach the two previous steps
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
        
    return prev1

# Example usage:
# For 4 steps: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2 (Total: 5)
print(f"Ways to climb 4 stairs: {climb_stairs(4)}")
```

## Key takeaways
* **Optimal Substructure**: The problem can be broken down into subproblems where `dp[i] = dp[i-1] + dp[i-2]`.
* **Space Optimization**: Instead of an array of size $n$, we use two variables to store only the necessary previous states, reducing space complexity from $O(n)$ to $O(1)$.
* **Time Complexity**: The algorithm runs in $O(n)$ time because it iterates through the steps exactly once.
