# Practice Exercises: DSA: Recursion Basics and Call Stack Visualization

This section focuses on tracing recursive execution flow and identifying base cases to master the relationship between recursive function calls and the system stack.

### 1. Visualizing the Call Stack
**Task:** Trace the execution of `countdown(3)`. Draw the stack frames (including parameters and return points) as they are pushed and popped.
**Starter Code:**
```python
def countdown(n):
    if n <= 0:
        print("Blastoff!")
        return
    print(n)
    countdown(n - 1)
```
**Expected Output:** 
3, 2, 1, "Blastoff!" (Ensure you can identify how many frames exist when `countdown(1)` is executing).

### 2. Identifying the Infinite Loop
**Task:** Identify why the following function causes a `RecursionError` and fix it by adding a proper base case that terminates when `n` reaches 1.
**Starter Code:**
```python
def factorial(n):
    # Missing base case!
    return n * factorial(n - 1)
```
**Expected Solution:** Add `if n == 1: return 1` before the recursive call.

### 3. Tracing Return Values
**Task:** Determine the output of `mystery(4)` and describe how the values "bubble up" through the return statements in the call stack.
**Starter Code:**
```python
def mystery(n):
    if n == 0: return 0
    return n + mystery(n - 1)
```
**Expected Output:** `10` (The stack resolves as 4 + (3 + (2 + (1 + 0)))).

## Self-Check Checklist
* [ ] Can I identify the base case and the recursive step in any given function?
* [ ] Do I understand why every recursive call consumes memory in the call stack?
* [ ] Can I manually trace the stack frames for a function with at least 3 recursive levels?
* [ ] Have I identified the condition that prevents infinite recursion (Stack Overflow)?
