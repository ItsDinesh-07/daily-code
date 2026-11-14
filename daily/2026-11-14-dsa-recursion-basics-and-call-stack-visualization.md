# Recursion Basics and Call Stack Visualization

Recursion occurs when a function solves a problem by calling a smaller instance of itself until it reaches a terminating base case. Each recursive invocation creates a new stack frame in memory, which pauses execution until the deeper function calls resolve and unwind in a Last-In, First-Out (LIFO) order.

```python
def factorial(n: int, depth: int = 0) -> int:
    """Calculates n! while visualizing the active call stack via indentation."""
    indent = "  " * depth
    print(f"{indent}[PUSH] Entering factorial({n}) | Depth: {depth}")

    # 1. Base Case: stops recursion to prevent a stack overflow
    if n <= 1:
        print(f"{indent}--> Base case hit (n={n})")
        print(f"{indent}[POP]  Exiting factorial({n}) -> Returning 1")
        return 1

    # 2. Recursive Step: pushes a new frame onto the call stack
    sub_problem_result = factorial(n - 1, depth + 1)
    result = n * sub_problem_result

    # 3. Stack Unwinding: executes as function calls return up the chain
    print(f"{indent}[POP]  Exiting factorial({n}) -> Returning {result}")
    return result


if __name__ == "__main__":
    print("--- Tracing Call Stack for factorial(4) ---")
    final_result = factorial(4)
    print(f"\nFinal Computation: 4! = {final_result}")
```

## Key takeaways

* **Base Case is Mandatory:** Without a valid termination condition, recursive calls continue indefinitely until the system raises a `RecursionError` (Stack Overflow).
* **LIFO Stack Memory:** Each nested call pauses the caller and adds a new frame to the call stack; frames are popped in reverse order during unwinding.
* **Space Complexity Overhead:** Even if no auxiliary collections are created, recursion consumes $O(N)$ memory proportional to the maximum call stack depth.
