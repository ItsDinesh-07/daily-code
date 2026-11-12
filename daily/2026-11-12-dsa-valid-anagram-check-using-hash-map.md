# Valid Anagram Check (Hash Map)

An anagram is a word formed by rearranging the letters of another. This solution uses a hash map to count character frequencies in the first string and decrements them using the second, ensuring both strings contain identical character counts.

```python
def is_anagram(s: str, t: str) -> bool:
    # Anagrams must have the same length
    if len(s) != len(t):
        return False
    
    count = {}
    
    # Count frequency of each character in string s
    for char in s:
        count[char] = count.get(char, 0) + 1
        
    # Subtract frequency based on string t
    for char in t:
        if char not in count or count[char] == 0:
            return False
        count[char] -= 1
        
    return True

# Example usage:
print(is_anagram("anagram", "nagaram"))  # Output: True
print(is_anagram("rat", "car"))          # Output: False
```

## Key takeaways
* **Time Complexity:** $O(n)$, where $n$ is the length of the strings, as we iterate through each string exactly once.
* **Space Complexity:** $O(k)$, where $k$ is the number of unique characters (at most 26 for English lowercase letters).
* **Efficiency:** Using a hash map (dictionary) is more memory-efficient than sorting, which would take $O(n \log n)$ time.
