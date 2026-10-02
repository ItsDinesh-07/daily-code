# Java Collections: ArrayList vs LinkedList Performance

`ArrayList` provides fast constant-time positional access, while `LinkedList` is optimized for frequent insertions and deletions at the beginning or middle of the list. This example demonstrates the performance disparity when inserting elements at the start of each collection.

```java
import java.util.*;

public class CollectionPerformance {
    public static void main(String[] args) {
        int n = 50_000;
        List<Integer> arrayList = new ArrayList<>();
        List<Integer> linkedList = new LinkedList<>();

        // Testing insertion at index 0 (the "worst case" for ArrayList)
        long start = System.currentTimeMillis();
        for (int i = 0; i < n; i++) arrayList.add(0, i);
        System.out.println("ArrayList insertion time: " + (System.currentTimeMillis() - start) + "ms");

        start = System.currentTimeMillis();
        for (int i = 0; i < n; i++) linkedList.add(0, i);
        System.out.println("LinkedList insertion time: " + (System.currentTimeMillis() - start) + "ms");
    }
}
```

## Key takeaways
* **ArrayList** uses an underlying array; adding to the front requires shifting every existing element, resulting in $O(n)$ performance.
* **LinkedList** uses nodes with pointers; adding to the front only requires updating a reference, resulting in $O(1)$ performance.
* **ArrayList** is generally faster for most use cases due to better cache locality and lower memory overhead per element.
