# Notes & Interview Tips: DSA: Linked List Reversal Algorithm

## Common Pitfalls & Anti-Patterns

1. **Premature Pointer Overwrite (Losing the List)**
   * *Mistake:* Assigning `curr.next = prev` before caching `curr.next`, immediately stranding the rest of the unvisited list and leaking memory or causing an infinite loop.
   * *Fix:* Always cache the reference first: `next_node = curr.next` before modifying `curr.next`.

2. **Cycle Creation from Improper Tail Termination**
   * *Mistake:* Reversing nodes without ensuring the original head points to `null`, creating a circular reference between the first two nodes.
   * *Fix:* Initialize `prev = null` so that the original head node naturally points to `null` once it becomes the new tail.

3. **Call Stack Overflow in Recursive Implementations**
   * *Mistake:* Using recursive reversal on large lists ($N > 10^4$), leading to stack overflow due to $O(N)$ auxiliary call stack space.
   * *Fix:* Use the standard 3-pointer iterative approach ($O(1)$ space) unless specifically prompted for a recursive solution.

---

## Key Interview Questions

### 1. How do you reverse a singly linked list in-place iteratively?
* **Answer:** Maintain three pointers: `prev` (initialized to `null`), `curr` (initialized to `head`), and `next_temp`. Iterate while `curr != null`:
  1. `next_temp = curr.next`
  2. `curr.next = prev`
  3. `prev = curr`
  4. `curr = next_temp`
  
  Return `prev` as the new head. Time complexity is $O(N)$, and space complexity is $O(1)$.

### 2. How do you reverse a sublist of a linked list from position $m$ to $n$ in a single pass?
* **Answer:** Use a dummy node pointing to `head` to handle cases where $m = 1$. 
  1. Traverse to node $m-1$ (`pre`). Set `curr = pre.next`.
  2. Perform $n - m$ pointer swaps:
     * `temp = curr.next`
     * `curr.next = temp.next`
     * `temp.next = pre.next`
     * `pre.next = temp`
  
  This continuously moves the next node to the start of the sublist. Time complexity is $O(N)$, space is $O(1)$.

### 3. How do you reverse nodes in $k$-group?
* **Answer:** 
  1. Check if there are at least $k$ nodes ahead. If fewer than $k$ nodes remain, leave them as-is.
  2. Reverse the $k$ nodes iteratively.
  3. Connect the tail of the newly reversed group (the original head of the group) to the result of recursively (or iteratively) calling the function on the $(k+1)$-th node.
  4. Return the new head of the reversed $k$-group. Time complexity is $O(N)$, space is $O(N/k)$ recursively or $O(1)$ iteratively.

---

## Best Practices Summary

* **Use a Dummy Node:** Always initialize a `dummy` node (`dummy.next = head`) for partial reversals, $k$-group reversals, or problems where the head might change.
* **Invariant Verification:** Confirm edge cases: empty list (`head == null`), single-node list (`head.next == null`), and two-node list.
* **Return Value Awareness:** At loop termination in standard reversal, `curr` is `null`; the new head is always `prev`.
* **State Diagrams:** Draw pointer transitions (`prev`, `curr`, `next`) explicitly on a whiteboard before writing code.
