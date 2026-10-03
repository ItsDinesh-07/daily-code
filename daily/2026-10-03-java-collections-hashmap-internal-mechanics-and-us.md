# Java HashMap: Internal Mechanics and Usage

A `HashMap` stores key-value pairs using a hash table. It computes an array index from a key's `hashCode()` to store data, handling collisions via linked lists or red-black trees when multiple keys map to the same bucket.

```java
import java.util.HashMap;
import java.util.Map;

public class HashMapDemo {
    public static void main(String[] args) {
        // Create a map with String keys and Integer values
        Map<String, Integer> inventory = new HashMap<>();

        // 1. Insertion: hashCode() determines bucket index. 
        // If keys hash to the same bucket, it creates a chain/tree.
        inventory.put("Apple", 10);
        inventory.put("Banana", 20);

        // 2. Retrieval: O(1) average time complexity.
        // The map finds the bucket via hash and compares equality via equals().
        System.out.println("Apples count: " + inventory.get("Apple"));

        // 3. Iteration: Entry set provides access to keys and values.
        for (Map.Entry<String, Integer> entry : inventory.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
```

## Key takeaways
* **Hashing**: Performance relies on a good `hashCode()` implementation to distribute keys evenly across buckets.
* **Collisions**: When multiple keys yield the same index, `HashMap` uses a linked list (or balanced tree) to store them.
* **Equality**: `HashMap` uses `.equals()` to distinguish between different keys that happen to produce the same hash code.
* **Complexity**: Provides $O(1)$ time complexity for `get()` and `put()` operations on average.
