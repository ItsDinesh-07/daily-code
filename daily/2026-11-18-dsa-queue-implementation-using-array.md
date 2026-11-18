# Queue Implementation using Array

A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. This implementation uses a fixed-size array and two pointers to manage elements efficiently.

```python
class Queue:
    def __init__(self, capacity):
        self.queue = [None] * capacity  # Pre-allocate array size
        self.capacity = capacity
        self.front = 0                 # Index of the first element
        self.rear = -1                 # Index of the last element
        self.size = 0                  # Current number of items

    def enqueue(self, item):
        if self.size == self.capacity:
            return "Queue Overflow"
        self.rear = (self.rear + 1) % self.capacity  # Circular increment
        self.queue[self.rear] = item
        self.size += 1

    def dequeue(self):
        if self.size == 0:
            return "Queue Underflow"
        item = self.queue[self.front]
        self.front = (self.front + 1) % self.capacity  # Circular increment
        self.size -= 1
        return item

# Example usage:
q = Queue(3)
q.enqueue(10)
q.enqueue(20)
print(q.dequeue())  # Output: 10
```

## Key takeaways
* **FIFO Principle**: Elements are removed in the same order they were added.
* **Circular Buffer**: Using the modulo operator (`%`) allows the queue to wrap around the array, preventing unnecessary memory shifting.
* **Complexity**: Both `enqueue` and `dequeue` operations run in O(1) time.
