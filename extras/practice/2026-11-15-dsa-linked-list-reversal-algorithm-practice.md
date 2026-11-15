# Practice Exercises: DSA: Linked List Reversal Algorithm

The following exercises aim to reinforce your understanding of pointer manipulation and iterative/recursive traversal techniques used to reverse a singly linked list.

### 1. The Iterative Reversal
**Task:** Implement an iterative function `reverseList(head)` that reverses a singly linked list in-place by adjusting the `next` pointers of each node.
**Starter Code:**
```python
class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    # TODO: Implement iterative logic
    pass
```
**Expected Output:** If the input is `1 -> 2 -> 3 -> None`, the function should return a node representing `3 -> 2 -> 1 -> None`.

### 2. The Recursive Reversal
**Task:** Write a recursive function that reverses the list. The base case should handle the empty list or single-node list, while the recursive step should reverse the rest of the list and reattach the original `head`.
**Starter Code:**
```python
def reverseRecursive(head):
    if not head or not head.next:
        return head
    # TODO: Recursive call and pointer adjustment
```
**Expected Output:** Given a list `[10, 20, 30]`, the final structure should result in a head node with value `30` pointing to `20`, which points to `10`.

### 3. Reversing a Sub-segment
**Task:** Given a linked list and two integers `m` and `n`, reverse the nodes of the list from position `m` to `n` (1-indexed). Return the modified list.
**Scenario:** Input list: `1 -> 2 -> 3 -> 4 -> 5`, `m=2, n=4`.
**Solution Snippet:** You must identify the `prev` node before position `m`, reverse the sub-chain between `m` and `n` iteratively, and reconnect the `prev` node to the new head of the sub-segment.
**Expected Output:** `1 -> 4 -> 3 -> 2 -> 5`

## Self-Check Checklist
* [ ] Did you account for the edge case where the input list is `None` or contains only a single node?
* [ ] In the iterative approach, did you ensure the `prev`, `curr`, and `next_node` pointers are updated in the correct sequence to prevent memory leaks?
* [ ] Does your recursive implementation handle potential stack overflow risks for extremely long linked lists?
* [ ] Have you verified that the new tail of the reversed list correctly points to `None`?
