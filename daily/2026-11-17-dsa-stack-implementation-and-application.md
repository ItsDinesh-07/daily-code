# Stack Implementation and Balanced Brackets Application

A stack is a Last-In, First-Out (LIFO) data structure where elements are added and removed from the same end. It is widely used in syntax parsing, call-stack management, and depth-first search. Below, a basic stack is implemented and applied to validate balanced parentheses in an expression.

```python
class Stack:
    """A LIFO Stack implementation backed by a dynamic array (Python list)."""
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("Cannot pop from an empty stack.")
        return self._items.pop()

    def peek(self):
        return self._items[-1] if not self.is_empty() else None

    def is_empty(self):
        return len(self._items) == 0

    def size(self):
        return len(self._items)


def is_balanced(expression: str) -> bool:
    """Uses a Stack to verify that all opening brackets are properly closed."""
    stack = Stack()
    pairs = {')': '(', '}': '{', ']': '['}

    for char in expression:
        if char in pairs.values():
            stack.push(char)  # Push opening brackets
        elif char in pairs:
            # Check for empty stack or unmatched bracket pair
            if stack.is_empty() or stack.pop() != pairs[char]:
                return False

    return stack.is_empty()  # Stack must be empty if all pairs matched


if __name__ == "__main__":
    test_cases = [
        ("{[()]}", True),
        ("{[(])}", False),
        ("((a + b) * [c - d])", True),
        ("(()", False),
    ]

    for expr, expected in test_cases:
        result = is_balanced(expr)
        print(f"'{expr}': {result} (Expected: {expected})")
```

## Key takeaways

* **LIFO Discipline**: Elements are retrieved in the reverse order of their insertion (`pop` removes the most recent `push`).
* **Time Complexity**: Standard stack operations (`push`, `pop`, `peek`, `is_empty`) operate in $O(1)$ amortized time.
* **Practical Application**: The balanced brackets algorithm runs in $O(n)$ time and $O(n)$ auxiliary space, illustrating how stacks naturally track open contexts and resolve the most recently encountered constraints first.
