# Linked List Reversal Algorithm

The iterative linked list reversal algorithm inverts a singly linked list in-place by redirecting each node's forward pointer to reference its predecessor instead. It maintains three pointers—previous, current, and next—to traverse and mutate the sequence without losing references or requiring additional memory allocation.

```python
class ListNode:
    """Represents a node in a singly linked list."""
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head: ListNode) -> ListNode:
    """Reverses a singly linked list in-place using three pointers."""
    prev = None
    curr = head

    while curr:
        next_node = curr.next  # 1. Save reference to remaining list
        curr.next = prev       # 2. Reverse the link of current node
        prev = curr            # 3. Advance 'prev' pointer forward
        curr = next_node       # 4. Advance 'curr' pointer forward

    return prev  # 'prev' ends at the new head of the reversed list

def print_list(node: ListNode) -> None:
    """Helper to display the linked list visually."""
    values = []
    while node:
        values.append(str(node.val))
        node = node.next
    print(" -> ".join(values) or "Empty")

# Demonstration
if __name__ == "__main__":
    # Create list: 1 -> 2 -> 3 -> 4 -> 5
    head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
    
    print("Original list:")
    print_list(head)

    reversed_head = reverse_linked_list(head)

    print("Reversed list:")
    print_list(reversed_head)
```

## Key takeaways

- **Time Complexity:** $O(n)$, where $n$ is the number of nodes, as each node is visited exactly once.
- **Space Complexity:** $O(1)$ auxiliary space, since pointers are updated in-place without additional data structures.
- **Reference Preservation:** Storing `curr.next` in a temporary variable is essential before mutating `curr.next`, otherwise the reference to the rest of the list is lost.
- **Edge Cases:** The algorithm naturally handles empty lists (`head = None`) and single-node lists without additional conditional checks.
