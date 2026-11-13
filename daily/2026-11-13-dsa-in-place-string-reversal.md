# In-Place String Reversal

In-place string reversal involves swapping characters from both ends of a sequence, moving toward the center, until the entire string is reversed. This method is space-efficient as it requires only O(1) additional memory.

```python
def reverse_in_place(chars):
    """Reverses a list of characters in-place."""
    left = 0
    right = len(chars) - 1
    
    # Continue swapping until pointers meet in the middle
    while left < right:
        # Swap characters using tuple unpacking
        chars[left], chars[right] = chars[right], chars[left]
        
        # Move pointers toward the center
        left += 1
        right -= 1

# Example usage:
data = list("hello")
reverse_in_place(data)
print("".join(data))  # Output: olleh
```

## Key takeaways
* **Space Complexity:** O(1) because we swap elements within the existing array rather than creating a new one.
* **Time Complexity:** O(n), where n is the length of the string, as we visit each element at most once.
* **Immutability Note:** In Python, strings are immutable, so this algorithm requires the input to be a list of characters rather than a standard string object.
