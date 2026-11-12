# Practice Exercises: DSA: Valid Anagram Check using Hash Map

This section focuses on implementing efficient frequency counting to determine if two strings contain the exact same characters with identical frequencies.

### Exercise 1: Basic Frequency Counting
**Task:** Given two strings `s` and `t`, write a function `isAnagram(s, t)` that uses a Hash Map (or frequency array) to return `True` if `t` is an anagram of `s`, and `False` otherwise.

**Starter Code:**
```python
def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t): return False
    # Your logic here
```
**Expected Output:** `isAnagram("anagram", "nagaram")` should return `True`.

### Exercise 2: Handling Case-Sensitivity and Spaces
**Task:** Modify your anagram checker to ignore spaces and treat uppercase letters as their lowercase equivalents (e.g., "Debit card" and "Bad credit" should be anagrams).

**Scenario:** 
Input: `s = "Debit card"`, `t = "Bad credit"`
**Solution Snippet:** 
Normalize the input strings first: `s = s.replace(" ", "").lower()` before passing them to the Hash Map logic.

### Exercise 3: Memory Optimization
**Task:** Instead of two separate maps, use a single Hash Map to track frequencies. Increment counts for characters in string `s` and decrement counts for characters in string `t`.

**Starter Code:**
```python
def isAnagram(s, t):
    count = {}
    # Iterate and adjust map counts
    # Return all(val == 0 for val in count.values())
```
**Expected Assertion:** `assert isAnagram("rat", "car") == False`

## Self-Check Checklist
*   Did I verify the length of both strings first as an edge-case optimization?
*   Does my solution correctly handle empty strings (should return `True`)?
*   Did I ensure the Hash Map accounts for all characters in the alphabet (or Unicode)?
*   Is my time complexity O(n) and space complexity O(1) (or O(k) where k is character set size)?
