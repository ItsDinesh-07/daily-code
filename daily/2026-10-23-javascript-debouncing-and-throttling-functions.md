# Debouncing and Throttling in JavaScript

Debouncing ensures a function runs only after a set period of inactivity, while throttling ensures it runs at most once every specified interval. Both are essential for optimizing performance during frequent events like window resizing or scrolling.

```javascript
// Debounce: Execute after the user stops triggering the event for X ms
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer); // Reset timer on every call
    timer = setTimeout(() => func(...args), delay);
  };
}

// Throttle: Execute at most once every X ms
function throttle(func, interval) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      func(...args);
    }
  };
}

// Usage examples:
const log = (msg) => console.log(msg, new Date().toLocaleTimeString());

const debouncedLog = debounce(() => log("Debounced!"), 500);
const throttledLog = throttle(() => log("Throttled!"), 500);

// Simulate rapid event firing
setInterval(debouncedLog, 200); // Will only log once after firing stops
setInterval(throttledLog, 200); // Will log once every 500ms
```

## Key takeaways
* **Debounce** is best for input validation or search bars where you wait for the user to finish typing.
* **Throttle** is ideal for scroll listeners or resize events where you need periodic updates without overwhelming the UI thread.
* Both patterns utilize **closures** to maintain state (timer IDs or timestamps) across multiple function invocations.
