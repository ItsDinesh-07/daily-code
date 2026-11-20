# House Robber Problem (Dynamic Programming)

The House Robber problem asks for the maximum sum of non-adjacent elements in an array. We use dynamic programming to decide at each house whether to rob it (adding its value to the result from two houses ago) or skip it (taking the result from the previous house).

```python
def rob(nums):
    """
    Returns the maximum amount that can be robbed without robbing adjacent houses.
    Time Complexity: O(n), Space Complexity: O(1).
    """
    prev2 = 0  # Max value two houses ago
    prev1 = 0  # Max value one house ago
    
    for num in nums:
        # At each house, we choose the max of:
        # 1. Current house + value from two houses back
        # 2. Previous house value (skipping current)
        current = max(num + prev2, prev1)
        
        # Shift pointers forward for the next iteration
        prev2 = prev1
        prev1 = current
        
    return prev1

# Example usage:
houses = [2, 7, 9, 3, 1]
print(f"Max loot: {rob(houses)}")  # Output: 12 (2 + 9 + 1)
```

## Key takeaways
*   **Optimal Substructure:** The problem can be broken down into smaller subproblems where the optimal choice at step $i$ depends on results from $i-1$ and $i-2$.
*   **Space Optimization:** Instead of maintaining a full DP array of size $N$, we only need the last two calculated states, reducing space complexity from $O(n)$ to $O(1)$.
*   **State Transition:** The recurrence relation is `dp[i] = max(nums[i] + dp[i-2], dp[i-1])`.
