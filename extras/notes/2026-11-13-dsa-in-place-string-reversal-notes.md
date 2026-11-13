# Notes & Interview Tips: DSA: In-Place String Reversal

## Common Pitfalls & Anti-Patterns
*   **Immutability Constraint:** In languages like Java, Python, or JavaScript, strings are immutable. Attempting to swap characters directly (e.g., `s[i] = s[j]`) will fail. 
    *   *Avoidance:* Always convert the string to a mutable character array/list first, perform the swap, then join it back into a string.
*   **Off-by-One Errors:** Using incorrect loop bounds (e.g., `i <= length` instead of `i < length / 2`) can lead to unintended behavior or infinite loops.
    *   *Avoidance:* Use the two-pointer technique with `left = 0` and `right = n - 1`, incrementing/decrementing until `left >= right`.
*   **Memory Inefficiency:** Allocating a new string or a full-sized auxiliary array for the result when an in-place solution is expected.
    *   *Avoidance:* Explicitly mention that in-place reversal consumes $O(1)$ auxiliary space.

## Key Interview Questions
1.  **Q: How do you reverse a string in-place?**
    *   *A:* Convert the string to a char array, initialize two pointers at both ends, swap the characters at these pointers, and move them toward the center until they meet. Time: $O(N)$, Space: $O(1)$ (or $O(N)$ if considering character array storage).
2.  **Q: Why can't you perform "in-place" reversal on strings in Python?**
    *   *A:* Strings in Python are immutable objects. Memory locations for strings are protected; modification requires creating a new string object. The "in-place" requirement implies modifying a mutable buffer, such as a list of characters.
3.  **Q: How would you reverse a string containing Unicode characters (e.g., emojis)?**
    *   *A:* Standard indexing fails on multi-byte characters. You must use a library or language feature that handles "grapheme clusters" (e.g., Python's `grapheme` module or Swift’s `Character` type) to ensure you aren't splitting a single character into invalid parts.

## Best Practices Summary
*   **Use Two Pointers:** Always prefer the two-pointer approach for $O(N)$ time complexity.
*   **Input Validation:** Check for `null` or empty strings early to prevent runtime exceptions.
*   **Clarify Constraints:** Ask if the interviewer defines "in-place" as strictly modifying the original reference (if mutable) or if converting to a char array is acceptable.
*   **Space Complexity:** Always emphasize that the algorithm achieves $O(1)$ auxiliary space (excluding the output structure).
*   **Edge Cases:** Always test with odd-length strings, even-length strings, and single-character strings.
