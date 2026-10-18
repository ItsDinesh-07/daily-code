# Practice Exercises: JavaScript: Promises and Async/Await Error Handling

Master robust asynchronous error handling in JavaScript by working with promise rejections, `try/catch/finally` blocks, and concurrent operations.

### Exercise 1: Fallback Recovery with `.catch()`

**Task:**  
Update the `getUserProfile` promise chain to intercept any network or parsing error, log the error message using `console.error`, and return a default fallback user object `{ id: null, name: "Anonymous" }`.

**Starter Code:**
```javascript
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    if (userId <= 0) {
      reject(new Error("Invalid user ID"));
    } else {
      resolve({ id: userId, name: "Alice" });
    }
  });
}

function getUserProfile(userId) {
  return fetchUserData(userId)
    .then((user) => {
      return { id: user.id, name: user.name.toUpperCase() };
    });
    // TODO: Catch errors and return fallback object
}
```

**Solution Snippet:**
```javascript
function getUserProfile(userId) {
  return fetchUserData(userId)
    .then((user) => {
      return { id: user.id, name: user.name.toUpperCase() };
    })
    .catch((error) => {
      console.error(error.message);
      return { id: null, name: "Anonymous" };
    });
}

// Expected Output for getUserProfile(-1):
// Logs: "Invalid user ID"
// Resolves to: { id: null, name: "Anonymous" }
```

---

### Exercise 2: Safe Async Execution with `try...catch...finally`

**Task:**  
Implement an `async` function `processPayment` that takes an `amount`. It must set `isProcessing` to `true` before initiating payment, catch any failure, rethrow a customized `Error("Payment failed: " + originalError.message)`, and ensure `isProcessing` is reset to `false` in all scenarios.

**Starter Code:**
```javascript
let isProcessing = false;

const mockApiCharge = async (amount) => {
  if (amount <= 0) throw new Error("Amount must be greater than zero");
  return { status: "success", amount };
};

async function processPayment(amount) {
  // TODO: Implement try/catch/finally handling
}
```

**Solution Snippet:**
```javascript
async function processPayment(amount) {
  isProcessing = true;
  try {
    return await mockApiCharge(amount);
  } catch (error) {
    throw new Error(`Payment failed: ${error.message}`);
  } finally {
    isProcessing = false;
  }
}

// Expected behavior:
// processPayment(-5) throws Error: "Payment failed: Amount must be greater than zero"
// isProcessing evaluates to false after execution completes.
```

---

### Exercise 3: Resilient Aggregation with `Promise.allSettled`

**Task:**  
Write a function `fetchServiceStatus` that takes an array of promise-returning tasks. Use `Promise.allSettled` to inspect all outcomes and return an object separating the resolved values from the rejection error messages.

**Starter Code:**
```javascript
const serviceA = () => Promise.resolve("Auth Service: Healthy");
const serviceB = () => Promise.reject(new Error("Billing Service: Timeout"));
const serviceC = () => Promise.resolve("Analytics Service: Healthy");

async function fetchServiceStatus(services) {
  // TODO: Execute all services concurrently without letting one failure reject the whole call.
  // Return an object: { operational: [...], errors: [...] }
}
```

**Solution Snippet:**
```javascript
async function fetchServiceStatus(services) {
  const results = await Promise.allSettled(services.map(fn => fn()));
  
  return results.reduce(
    (acc, result) => {
      if (result.status === "fulfilled") {
        acc.operational.push(result.value);
      } else {
        acc.errors.push(result.reason.message);
      }
      return acc;
    },
    { operational: [], errors: [] }
  );
}

// Expected Output for [serviceA, serviceB, serviceC]:
// {
//   operational: ["Auth Service: Healthy", "Analytics Service: Healthy"],
//   errors: ["Billing Service: Timeout"]
// }
```

## Self-Check Checklist

* [ ] `.catch()` handlers return a fallback value when recovery is desired instead of leaving the promise in a rejected state.
* [ ] The `finally` block is utilized for guaranteed resource cleanup regardless of whether an operation succeeds or fails.
* [ ] Asynchronous errors inside `try` blocks are awaited (`await Promise`) to ensure rejections are caught locally rather than bypassing the catch block.
* [ ] `Promise.allSettled` is chosen over `Promise.all` when independent tasks must complete without short-circuiting on the first failure.
