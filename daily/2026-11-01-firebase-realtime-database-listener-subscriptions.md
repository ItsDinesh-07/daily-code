# Firebase Realtime Database Listener Subscriptions

Firebase Realtime Database provides synchronization via persistent listeners that trigger immediately on attachment and whenever data at the target path changes. Using the Firebase v9+ Modular SDK, functions like `onValue()` establish a live connection to a reference and return an unsubscribe function to cleanly detach the listener when no longer needed.

```javascript
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
};

// Initialize Firebase App and Database instance
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference to the database path we want to monitor
const statusRef = ref(db, "server/status");

// Subscribe to real-time data changes at statusRef
// onValue returns an unsubscribe function directly
const unsubscribe = onValue(
  statusRef,
  (snapshot) => {
    // Callback executes immediately on attach and whenever data updates
    if (snapshot.exists()) {
      console.log("Received update:", snapshot.val());
    } else {
      console.log("No data available at reference path.");
    }
  },
  (error) => {
    // Optional error callback (e.g., permission denied)
    console.error("Subscription listener error:", error);
  }
);

// Demonstration: update data and later unsubscribe
async function runDemo() {
  // Update data to trigger the active listener
  await set(statusRef, { online: true, timestamp: Date.now() });

  // Unsubscribe the listener to prevent memory leaks and stop updates
  console.log("Detaching listener...");
  unsubscribe();

  // This subsequent update will not trigger the listener callback
  await set(statusRef, { online: false, timestamp: Date.now() });
  console.log("Demo completed.");
}

runDemo().catch(console.error);
```

## Key takeaways

* **Immediate & Reactive Execution:** `onValue` automatically performs an initial read of the data at the reference path and continues to listen for any subsequent mutations.
* **Simple Cleanup:** Calling `onValue()` returns an `unsubscribe` function; invoking it detaches the callback and prevents memory leaks or unwanted background network traffic.
* **Granular Options:** For large lists, consider granular event listeners like `onChildAdded`, `onChildChanged`, and `onChildRemoved` instead of reading the entire node with `onValue`.
