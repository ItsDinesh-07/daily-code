# Practice Exercises: DSA: In-Place String Reversal

The objective of these exercises is to master pointer-based manipulation techniques to reverse strings without allocating extra space, maintaining an $O(1)$ auxiliary space complexity.

### Exercise 1: Standard In-Place Reversal
**Task:** Write a function `reverseString(s)` that takes a list of characters and reverses it in-place using the two-pointer approach.
**Starter Code:**
```python
def reverseString(s):
    # Implement two-pointer logic here
    pass

s = ["h","e","l","l","o"]
reverseString(s)
print(s)
```
**Expected Output:** `["o","l","l","e","h"]`

### Exercise 2: Reverse Words in a Sentence
**Task:** Given a string of words separated by spaces, reverse the order of the words while keeping the letters within each word in their original order.
**Starter Code:**
```python
def reverseWords(s):
    # Hint: Reverse the entire string, then reverse each individual word
    pass

s = "the sky is blue"
# Expected: "blue is sky the"
```
**Expected Output:** `"blue is sky the"`

### Exercise 3: Palindrome Verification
**Task:** Use your understanding of in-place reversal to determine if a string is a palindrome. You must not create a reversed copy of the string.
**Starter Code:**
```python
def isPalindrome(s):
    # Use two pointers to compare characters from ends moving inward
    pass

print(isPalindrome("racecar")) # Expected: True
print(isPalindrome("hello"))   # Expected: False
```
**Expected Output:** `True`, `False`

## Self-Check Checklist
* [ ] Did you avoid creating a new list or string (auxiliary space $O(1)$)?
* [ ] Does your pointer logic correctly handle strings with both odd and even lengths?
* [ ] Have you tested your code against empty strings or strings with a single character?
* [ ] Did you perform the swaps using a temporary variable or XOR bitwise operators?
