# Practice Exercises: DSA: Binary Tree Inorder Traversal

Master binary tree inorder traversal (Left-Root-Right) by implementing both recursive and iterative approaches, as well as applying traversal properties to validate tree structures.

---

### Exercise 1: Recursive Inorder Traversal

**Task:** Write a recursive function `inorder_recursive(root)` that traverses a binary tree and returns a list of node values in inorder sequence.

**Starter Code:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_recursive(root: TreeNode) -> list[int]:
    # TODO: Implement recursive inorder traversal
    pass

# Test Tree:
#       1
#      / \
#     2   3
#    / \
#   4   5
root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
```

**Expected Output:**
```python
assert inorder_recursive(root) == [4, 2, 5, 1, 3]
assert inorder_recursive(None) == []
```

---

### Exercise 2: Iterative Inorder Traversal Using a Stack

**Task:** Implement `inorder_iterative(root)` without using recursion. Use an explicit stack to simulate the call stack and achieve $O(h)$ auxiliary space, where $h$ is the tree height.

**Starter Code:**
```python
def inorder_iterative(root: TreeNode) -> list[int]:
    result = []
    stack = []
    curr = root
    
    # TODO: Traverse the tree iteratively
    
    return result

# Test Tree:
#   1
#    \
#     2
#    /
#   3
root = TreeNode(1, None, TreeNode(2, TreeNode(3), None))
```

**Solution Snippet:**
```python
def inorder_iterative(root: TreeNode) -> list[int]:
    result, stack, curr = [], [], root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    return result

assert inorder_iterative(root) == [1, 3, 2]
```

---

### Exercise 3: Validate Binary Search Tree via Inorder Traversal

**Task:** A binary tree is a valid Binary Search Tree (BST) if and only if its inorder traversal produces a strictly increasing sequence of values. Write `is_valid_bst(root)` to return `True` if the tree is a valid BST, and `False` otherwise, stopping early if a violation is detected.

**Starter Code:**
```python
def is_valid_bst(root: TreeNode) -> bool:
    # TODO: Track previous node value during inorder traversal
    # Return False immediately if current value <= previous value
    pass

# Tree A (Valid):      Tree B (Invalid):
#      2                     5
#     / \                   / \
#    1   3                 1   4
#                             / \
#                            3   6
tree_a = TreeNode(2, TreeNode(1), TreeNode(3))
tree_b = TreeNode(5, TreeNode(1), TreeNode(4, TreeNode(3), TreeNode(6)))
```

**Expected Output:**
```python
assert is_valid_bst(tree_a) is True
assert is_valid_bst(tree_b) is False
```

---

## Self-Check Checklist

- [ ] Does your code correctly handle edge cases such as an empty tree (`root = None`) or single-node trees?
- [ ] Can you trace the state of the stack step-by-step in the iterative implementation for both balanced and skewed trees?
- [ ] Do your implementations run in $O(N)$ time complexity and $O(H)$ auxiliary space (where $H$ is tree height)?
- [ ] Can you explain why an inorder traversal of a Binary Search Tree always yields elements in ascending order?
