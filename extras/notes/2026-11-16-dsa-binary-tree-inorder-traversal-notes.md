# Notes & Interview Tips: DSA: Binary Tree Inorder Traversal

## Common Pitfalls & Anti-Patterns

1. **Incorrect Loop Termination in Iterative Traversal**
   * *Mistake:* Using `while (!stack.isEmpty())` as the outer loop condition instead of `while (curr != null || !stack.isEmpty())`.
   * *Fix:* The stack often becomes empty while traversing back up to the root, but unvisited right subtrees still exist. Ensure the loop continues as long as `curr != null`, even if the stack is temporarily empty.

2. **Dangling Threaded Pointers in Morris Traversal**
   * *Mistake:* Forgetting to reset the in-order predecessor's `right` pointer back to `null` on the second visit.
   * *Fix:* In Morris traversal, when `predecessor.right == curr`, sever the temporary link (`predecessor.right = null`), process `curr`, and move to `curr.right` to restore the tree's original topology and prevent infinite cycles.

3. **Ignoring Call Stack Space on Degenerate Trees**
   * *Mistake:* Claiming the recursive approach uses $O(\log N)$ space universally.
   * *Fix:* Clarify that space complexity is $O(H)$, where $H$ is tree height. In the worst case (skewed tree), $H = N$, leading to $O(N)$ stack space and potential stack overflow.

---

## Key Interview Questions

### 1. How do you implement Inorder Traversal iteratively using an explicit stack?
**Model Answer:**
Maintain an explicit stack and a pointer `curr = root`. While `curr != null` or the stack is non-empty:
1. Traverse left: push `curr` to the stack and update `curr = curr.left` until `curr` is `null`.
2. Pop the top node from the stack, visit/record it.
3. Move to the right subtree: `curr = poppedNode.right`.

*Complexity:* $O(N)$ Time, $O(H)$ Space.

### 2. How can you traverse a binary tree in-order with $O(1)$ auxiliary space?
**Model Answer:**
Use **Morris Inorder Traversal**:
1. If `curr.left == null`, visit `curr` and move to `curr.right`.
2. If `curr.left != null`, locate `curr`'s in-order predecessor (the rightmost node of `curr.left`).
   - If `predecessor.right == null`, create a bridge: `predecessor.right = curr`, then move `curr = curr.left`.
   - If `predecessor.right == curr`, remove the bridge: `predecessor.right = null`, visit `curr`, then move `curr = curr.right`.

*Complexity:* $O(N)$ Time (each edge traversed at most 3 times), $O(1)$ auxiliary space.

### 3. How is Inorder Traversal used to validate a Binary Search Tree (BST)?
**Model Answer:**
An in-order traversal of a valid BST visits keys in strictly ascending order. Validate by keeping track of the previously visited node's value (`prev`):
* During traversal, if `curr.val <= prev.val`, the tree violates the BST property and is invalid.
* Return `false` immediately on violation to allow early exit.

*Complexity:* $O(N)$ Time, $O(H)$ Space.

---

## Best Practices Summary

* **Traversal Order:** Left Subtree $\rightarrow$ Node $\rightarrow$ Right Subtree.
* **Standard Complexities:** $O(N)$ Time across all methods; $O(H)$ Space for recursive and stack-based approaches ($O(\log N)$ balanced, $O(N)$ skewed).
* **Stack State Invariant:** In the iterative method, `curr != null` handles downward leftward traversal; the stack handles backtracking to parents and rightward traversal.
* **BST Association:** Default to in-order traversal for any BST problem involving sorted elements, $k$-th smallest/largest elements, or validation.
* **Morris Trade-offs:** Morris Traversal achieves $O(1)$ space but temporarily mutates the tree, making it not thread-safe.
