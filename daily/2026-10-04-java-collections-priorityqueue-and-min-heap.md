# Java PriorityQueue as a Min-Heap

A `PriorityQueue` in Java implements a min-heap by default, where the head of the queue is the smallest element according to natural ordering or a provided `Comparator`. It is ideal for scenarios requiring efficient retrieval of the minimum value.

```java
import java.util.PriorityQueue;

public class MinHeapExample {
    public static void main(String[] args) {
        // Create a PriorityQueue (defaults to min-heap behavior)
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        // Add elements (order doesn't matter for insertion)
        minHeap.add(15);
        minHeap.add(5);
        minHeap.add(20);
        minHeap.add(1);

        // Retrieve and remove the smallest element
        while (!minHeap.isEmpty()) {
            // poll() returns and removes the head (the smallest element)
            System.out.println("Extracted: " + minHeap.poll());
        }
    }
}
```

## Key takeaways
* **Default Behavior**: `PriorityQueue` acts as a min-heap, placing the smallest element at the head.
* **Complexity**: Insertion (`add`/`offer`) and removal (`poll`) operations take $O(\log n)$ time.
* **Access**: Peeking at the minimum element (`peek`) takes $O(1)$ time.
* **Ordering**: To create a max-heap, pass `Collections.reverseOrder()` to the constructor.
