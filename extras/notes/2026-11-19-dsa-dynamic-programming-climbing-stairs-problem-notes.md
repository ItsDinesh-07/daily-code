# Notes & Interview Tips: DSA: Dynamic Programming - Climbing Stairs Problem

## Common Pitfalls & Anti-Patterns

1. **Unmemoized Naive Recursion ($O(2^n)$ Time Complexity):**
   * *Mistake:* Implementing `climbStairs(n) = climbStairs(n - 1) + climbStairs(n - 2)` without caching intermediate results, leading to an exponential runtime and call-stack overflow.
   * *Fix:* Recognize the overlapping subproblems and apply top-down memoization (using a hash map or array) or transition directly to an iterative bottom-up approach.

2. **Unnecessary $O(n)$ Auxiliary Space Allocation:**
   * *Mistake:* Allocating a dynamic array of size $n + 1$ to store all intermediate solutions when only the immediately preceding steps are required.
   * *Fix:* Since state $i$ only depends on states $i - 1$ and $i - 2$, optimize auxiliary space to $O(1)$ by maintaining two scalar variables to track the previous two values (Fibonacci sequence optimization).

3. **Base Case and Index Misalignment:**
   * *Mistake:* Inconsistently defining base cases (e.g., whether $n = 0$ is 0 or 1, or confusing 0-indexed vs. 1-indexed stair numbers), causing off-by-one errors or out-of-bounds array access for small inputs ($n \le 2$).
   * *Fix:* Explicitly define the problem bounds: $n = 1 \implies 1$, $n = 2 \implies 2$. If using a table, handle $n < 3$ as early return edge cases before allocating memory or executing loops.

---

## Key Interview Questions

### 1. How do you solve the standard Climbing Stairs problem in $O(n)$ time and $O(1)$ space?
**Model Answer:**
The problem maps directly to the Fibonacci sequence: to reach step $n$, one must take either a 1-step from $n-1$ or a 2-step from $n-2$. The recurrence relation is $dp[i] = dp[i-1] + dp[i-2]$. Instead of a DP array, initialize two variables: `prev2 = 1` (ways to reach step 1) and `prev1 = 2` (ways to reach step 2). Iterate from $i = 3$ to $n$, computing `current = prev1 + prev2`, then update `prev2 = prev1` and `prev1 = current`. Return `prev1`.

### 2. How does the solution change if you are allowed to take up to $k$ steps at a time?
**Model Answer:**
The recurrence generalizes to:
$$dp[i] = \sum_{j=1}^{k} dp[i - j] \quad \text{for } i \ge j$$
* **Naive DP:** Use an inner loop running $k$ times: $O(n \cdot k)$ time and $O(n)$ space.
* **Optimized DP:** Maintain a running sum (sliding window) of the previous $k$ states. When moving from $i$ to $i + 1$, add $dp[i]$ and subtract $dp[i - k]$. This reduces time complexity to $O(n)$ and auxiliary space to $O(k)$ using a circular buffer.

### 3. How can you compute the number of ways to climb $n$ stairs in $O(\log n)$ time for extremely large $n$?
**Model Answer:**
Represent the state transitions using linear algebra and matrix exponentiation:
$$\begin{pmatrix} dp[i] \\ dp[i-1] \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix} \begin{pmatrix} dp[i-1] \\ dp[i-2] \end{pmatrix}$$
For step $n$:
$$\begin{pmatrix} dp[n] \\ dp[n-1] \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^{n-1} \begin{pmatrix} dp[1] \\ dp[0] \end{pmatrix}$$
Using binary exponentiation (repeated squaring), compute the transformation matrix raised to the power $(n - 1)$ in $O(\log n)$ matrix multiplications ($O(1)$ operation for a $2 \times 2$ matrix), achieving $O(\log n)$ time and $O(1)$ auxiliary space.

---

## Best Practices Summary

* **State the Recurrence Early:** Explicitly articulate the base cases and the transition relation ($dp[i] = dp[i-1] + dp[i-2]$) before writing code.
* **Prioritize Space Optimization:** Start by mentioning the $O(n)$ DP array to verify logic, then immediately optimize to two variables for $O(1)$ space.
* **Handle Edge Cases First:** Add boundary guards for $n \le 0$, $n = 1$, and $n = 2$ at the start of the function.
* **Clarify Constraints:** Ask whether $n$ fits in a 32-bit/64-bit integer, if modulo arithmetic (e.g., $10^9 + 7$) is required to avoid integer overflow, and whether step costs/penalties apply (Min Cost Climbing Stairs variant).
