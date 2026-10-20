# Practice Exercises: JavaScript: Closures and Lexical Scope

Apply closure patterns and lexical scoping rules to solve common state encapsulation, function customization, and scope preservation challenges.

---

### Exercise 1: Private State Counter Factory

**Task:**  
Write a function `createCounter(initialValue = 0)` that encapsulates a private `count` variable. It must return an object with three methods: `increment()`, `decrement()`, and `getValue()`. Direct modification of the internal count from outside the function must not be possible.

**Starter Code:**
```javascript
function createCounter(initialValue = 0) {
  // Your code here
}

const counter = createCounter(5);
counter.increment();
counter.increment();
console.log(counter.getValue()); // Expected: 7
counter.decrement();
console.log(counter.getValue()); // Expected: 6
console.log(counter.count);      // Expected: undefined
```

**Solution Snippet:**
```javascript
function createCounter(initialValue = 0) {
  let count = initialValue;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}
```

---

### Exercise 2: Execution Limiter (`once`)

**Task:**  
Create a higher-order function `once(fn)` that accepts a function `fn` and returns a new function. The returned function can only execute `fn` once. Subsequent calls should return the cached result of the initial invocation without re-executing `fn`.

**Starter Code:**
```javascript
function once(fn) {
  // Your code here
}

const initializeDatabase = once((connectionString) => {
  return `Connected to: ${connectionString}`;
});

console.log(initializeDatabase("postgres://localhost:5432"));
// Expected: "Connected to: postgres://localhost:5432"

console.log(initializeDatabase("postgres://remote-host:5432"));
// Expected: "Connected to: postgres://localhost:5432" (cached)
```

**Solution Snippet:**
```javascript
function once(fn) {
  let hasRun = false;
  let result;
  return function (...args) {
    if (!hasRun) {
      result = fn.apply(this, args);
      hasRun = true;
    }
    return result;
  };
}
```

---

### Exercise 3: Fixing Asynchronous Scope Inside Loops

**Task:**  
The starter function creates an array of callback functions intended to print numbers `0` through `2`. Due to lexical scoping with `var`, every callback logs `3`. Fix the function so each callback prints its respective index, **without** replacing `var` with `let`. Use an Immediately Invoked Function Expression (IIFE) or a separate helper function to create a new lexical scope per iteration.

**Starter Code:**
```javascript
function generateCallbacks() {
  var callbacks = [];

  for (var i = 0; i < 3; i++) {
    callbacks.push(function () {
      return i;
    });
  }

  return callbacks;
}

const callbacks = generateCallbacks();
console.log(callbacks[0]()); // Currently outputs 3; Target: 0
console.log(callbacks[1]()); // Currently outputs 3; Target: 1
console.log(callbacks[2]()); // Currently outputs 3; Target: 2
```

**Solution Snippet:**
```javascript
function generateCallbacks() {
  var callbacks = [];

  for (var i = 0; i < 3; i++) {
    (function (capturedIndex) {
      callbacks.push(function () {
        return capturedIndex;
      });
    })(i);
  }

  return callbacks;
}
```

---

## Self-Check Checklist

- [ ] Inner functions maintain references to variables declared in their outer lexical environment even after the outer function has finished executing.
- [ ] Variables intended to be private are inaccessible via object property lookup (e.g., `counter.count` returns `undefined`).
- [ ] You can identify whether an identifier resolves via block scope, function scope, or global scope by inspecting its declaration position.
- [ ] Loop variables bound with `var` share a single function-scoped variable, whereas an IIFE or `let` creates a distinct lexical binding per iteration.
