# Notes & Interview Tips: DSA: Dynamic Programming - House Robber Problem

## Common Pitfalls & Anti-Patterns
1. **Failing to Identify the Optimal Substructure**: Mistaking this for a greedy problem (e.g., always picking the maximum local house) rather than recognizing that choices affect future constraints ($i$ and $i+1$). *Avoid this*: Always write out the recurrence relation before coding; realize that robbing house $i$ forces you to skip $i+1$.
2. **Space Inoptimization**: Storing the entire DP array ($O(n)$ space) when the recurrence relation only depends on the previous two states ($i-1$ and $i-2$). *Avoid this*: Optimize space complexity to $O(1)$ by keeping track of just the last two calculated max amounts using rolling variables.
3. **Improper Boundary and Edge Case Handling**: Crashing or returning incorrect results for arrays of length 0, 1, or 2 because of out-of-bounds index access or missing base cases. *Avoid this*: Explicitly check for edge cases at the very beginning of your function (`if not nums: return 0`).

## Key Interview Questions
1. **Q: What is the base recurrence relation for the House Robber problem, and why?**
   * **Model Answer:** `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`. At any house $i$, the robber has two choices: either skip house $i$ (keeping the max loot up to $i-1$) or rob house $i$ (adding its value to the max loot up to house $i-2$).
2. **Q: How would you modify the solution if the houses are arranged in a circle (House Robber II)?**
   * **Model Answer:** Since the first and last houses are adjacent, you cannot rob both. Break the circular constraint by running the standard House Robber algorithm twice: once on the array excluding the last house (`nums[:-1]`) and once excluding the first house (`nums[1:]`), then return the maximum of the two results.
3. **Q: What is the time and space complexity of the optimized solution, and can it be improved further?**
   * **Model Answer:** Time complexity is $O(n)$ because we iterate through the list of houses once. Space complexity is $O(1)$ because we only maintain two variables (`rob1`, `rob2`) representing the previous two states instead of an entire DP table. This cannot be improved further since we must at least read each element once.

## Best Practices Summary
* Always define your state clearly: let `dp[i]` represent the maximum money you can rob from the first $i$ houses.
* Handle edge cases early (e.g., empty arrays, single-element arrays) to prevent runtime errors.
* Start by explaining the brute-force recursive approach with memoization, then transition to bottom-up DP, and finally optimize to $O(1)$ space.
* Clearly articulate the transition from standard House Robber to variations like "House Robber II" (circular) or "House Robber III" (binary tree structure).
