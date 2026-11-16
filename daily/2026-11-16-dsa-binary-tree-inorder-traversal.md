# Binary Tree Inorder Traversal

Inorder traversal is a depth-first traversal method that visits nodes in the sequence: Left Subtree, Root, and Right Subtree. When applied to a Binary Search Tree (BST), this traversal retrieves node keys in ascending sorted order. It is commonly implemented using recursion or an explicit stack.

```python
class TreeNode:
    """Represents a single node in a binary tree."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root: TreeNode) -> list:
    """
    Performs recursive inorder traversal (Left -> Root -> Right).
    Returns a list of node values in the order visited.
    """
    result = []

    def traverse(node: TreeNode):
        if not node:
            return
        traverse(node.left)       # 1. Traverse left subtree
        result.append(node.val)   # 2. Visit current node
        traverse(node.right)      # 3. Traverse right subtree

    traverse(root)
    return result

# Example tree structure:
#        4
#       / \
#      2   5
#     / \
#    1   3
root = TreeNode(4)
root.left = TreeNode(2, TreeNode(1), TreeNode(3))
root.right = TreeNode(5)

# Execute traversal
traversed_values = inorder_traversal(root)
print("Inorder Traversal:", traversed_values)
# Output: [1, 2, 3, 4, 5]
```

## Key takeaways

- **Traversal Order**: Always follows the pattern **Left $\rightarrow$ Current Node $\rightarrow$ Right**.
- **BST Characteristic**: An inorder traversal of a Binary Search Tree produces values in strictly non-decreasing order.
- **Complexity**: Time complexity is $O(N)$ because every node is visited once; space complexity is $O(H)$ due to recursion stack frames, where $H$ is the tree height.
