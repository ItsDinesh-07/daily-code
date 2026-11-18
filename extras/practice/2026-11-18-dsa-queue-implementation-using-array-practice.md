# Practice Exercises: DSA: Queue Implementation using Array

This section focuses on building fundamental queue operations—enqueue, dequeue, and status checks—using fixed-size arrays to master pointer management.

### Exercise 1: Basic Enqueue and Dequeue
**Task:** Implement the `enqueue` and `dequeue` methods for a fixed-size queue. Ensure you handle the overflow condition when the queue is full and return -1 if the queue is empty.
**Starter Code:**
```python
class Queue:
    def __init__(self, capacity):
        self.q = [0] * capacity
        self.front = -1
        self.rear = -1
        self.capacity = capacity
```
**Expected Behavior:** If `q.enqueue(10)` is called, `rear` should increment to 0 and `q[0]` should equal 10. `q.dequeue()` should return 10 and move `front` to 0.

### Exercise 2: The Circular Queue Wrap-Around
**Task:** Modify the `enqueue` logic to implement a circular queue. Use the modulo operator (`rear = (rear + 1) % capacity`) to allow the queue to reuse empty slots at the beginning of the array after deletions.
**Starter Code:**
```python
# Assuming front = 0, rear = capacity - 1, capacity = 3
# Calling enqueue(40) should place 40 at index 0
```
**Expected Output:** After 3 enqueues and 1 dequeue, the next enqueue should successfully place an element at the index vacated by the dequeue operation.

### Exercise 3: Queue Status Monitoring
**Task:** Write two helper methods, `isFull()` and `isEmpty()`, to be used within your queue implementation.
**Starter Code:**
```python
def isEmpty(self):
    return self.front == -1

def isFull(self):
    # Implement logic to check if rear has reached capacity - 1
```
**Expected Assertion:** `q = Queue(2)`; `q.enqueue(1)`; `q.enqueue(2)`; `assert q.isFull() == True`.

## Self-Check Checklist
* [ ] Did I correctly update the `rear` index during every enqueue operation?
* [ ] Have I handled the "empty queue" edge case to prevent index-out-of-bounds errors?
* [ ] Does my implementation reset or correctly manage the pointers when the last element is dequeued?
* [ ] For the circular queue, does the modulo operator prevent the `rear` pointer from exceeding the array bounds?
