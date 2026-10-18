# JavaScript Promises and Async/Await Error Handling

JavaScript handles asynchronous errors differently depending on whether you use Promise chaining or `async`/`await`. Promise chains rely on `.catch()` methods to intercept rejections, while `async`/`await` allows you to wrap asynchronous calls in standard `try...catch...finally` blocks for cleaner, synchronous-looking control flow.

```javascript
// Simulates an asynchronous operation that can succeed or fail
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: "Alice" });
      } else {
        reject(new Error("Invalid ID: Must be greater than 0."));
      }
    }, 50);
  });
}

// 1. Error handling with traditional Promise chaining (.catch)
function runPromiseExample() {
  fetchUserData(-1)
    .then((data) => console.log("Promise Success:", data))
    .catch((error) => console.error("Promise .catch():", error.message));
}

// 2. Error handling with async/await and try...catch...finally
async function runAsyncAwaitExample(userId) {
  try {
    const data = await fetchUserData(userId);
    console.log("Async Success:", data);
  } catch (error) {
    // Catches both rejected Promises and standard runtime errors
    console.error("Async/Await catch:", error.message);
  } finally {
    // Executes regardless of whether the operation succeeded or failed
    console.log("Cleanup: Request attempt completed.");
  }
}

// Execute both approaches
async function main() {
  runPromiseExample();

  // Wait briefly so outputs don't interleave
  await new Promise((resolve) => setTimeout(resolve, 100));

  await runAsyncAwaitExample(42); // Successful run
  await runAsyncAwaitExample(-5); // Failure run
}

main();
```

## Key takeaways

* `await` unpacks rejected Promises as thrown exceptions, allowing standard `try...catch` syntax to handle asynchronous errors.
* The `finally` block runs in both success and error cases, making it ideal for cleanup tasks such as closing connections or resetting loading flags.
* Always handle rejections; unhandled Promise rejections can terminate Node.js processes or trigger global error events in browsers.
