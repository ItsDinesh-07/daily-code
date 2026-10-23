# Practice Exercises: JavaScript: Debouncing and Throttling Functions

Master rate-limiting patterns in JavaScript by implementing standard debounce and throttle utilities to optimize performance during high-frequency events.

---

### Exercise 1: Implement a Basic Trailing Debounce

**Task:**  
Write a `debounce(fn, delay)` function that postpones executing `fn` until after `delay` milliseconds have elapsed since the last time the debounced function was invoked. Ensure it preserves the caller's execution context (`this`) and forwards all arguments.

**Starter Code:**
```javascript
function debounce(fn, delay) {
  // Your code here
}

// Verification:
let count = 0;
const increment = debounce(() => { count++; }, 100);

increment();
increment();
increment();
```

**Solution / Expected Output:**
```javascript
function debounce(fn, delay) {
  let timerId = null;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Assertion:
// Immediately: count === 0
// After ~150ms: count === 1
setTimeout(() => {
  console.log(count); // Expected output: 1
}, 150);
```

---

### Exercise 2: Implement a Basic Throttle Function

**Task:**  
Write a `throttle(fn, limit)` function that guarantees `fn` is executed at most once every `limit` milliseconds, regardless of how many times the returned wrapper is invoked.

**Starter Code:**
```javascript
function throttle(fn, limit) {
  // Your code here
}

// Verification:
let calls = 0;
const logScroll = throttle(() => { calls++; }, 200);
```

**Solution / Expected Output:**
```javascript
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Assertion:
logScroll(); // calls === 1 (runs immediately)
logScroll(); // ignored
logScroll(); // ignored

setTimeout(() => {
  logScroll(); // calls === 2 (runs after interval passed)
  console.log(calls); // Expected output: 2
}, 250);
```

---

### Exercise 3: Debounce with Leading (Immediate) Edge Support

**Task:**  
Enhance your debounce implementation to accept an optional third argument, `immediate`. When `immediate` is `true`, `fn` should execute immediately on the first call, but suppress subsequent executions until the delay has elapsed without any calls.

**Starter Code:**
```javascript
function debounce(fn, delay, immediate = false) {
  // Your code here
}
```

**Solution / Expected Output:**
```javascript
function debounce(fn, delay, immediate = false) {
  let timerId = null;
  return function (...args) {
    const callNow = immediate && !timerId;

    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, delay);

    if (callNow) {
      fn.apply(this, args);
    }
  };
}

// Verification:
let tracker = [];
const pushLeading = debounce((val) => tracker.push(val), 100, true);

pushLeading('A'); // Executes immediately
pushLeading('B'); // Suppressed
pushLeading('C'); // Suppressed

console.log(tracker); // Expected output: ['A']

setTimeout(() => {
  pushLeading('D'); // Executes immediately (delay reset completed)
  console.log(tracker); // Expected output: ['A', 'D']
}, 150);
```

---

## Self-Check Checklist

- [ ] Does your `debounce` implementation reset the internal timer via `clearTimeout` on every invocation?
- [ ] Does your `throttle` implementation enforce the specified time boundary without memory leaks?
- [ ] Do both functions preserve `this` context and correctly pass arguments using `.apply()`, `.call()`, or rest/spread syntax?
- [ ] Can you identify whether an event requires debouncing (e.g., search autocomplete input) or throttling (e.g., window scrolling or resizing)?
