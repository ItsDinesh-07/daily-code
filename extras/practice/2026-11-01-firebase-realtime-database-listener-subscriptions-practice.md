# Practice Exercises: Firebase: Realtime Database Listener Subscriptions

Practice attaching, managing, and safely detaching Firebase Realtime Database listeners to synchronize live application state without introducing memory leaks.

---

### Exercise 1: One-Off Cleanup for Value Listeners
**Task:** Attach an `onValue` listener to `/users/{userId}/status`. Return and execute a cleanup function that detaches the listener when monitoring ends.

**Starter Code:**
```javascript
import { getDatabase, ref, onValue } from "firebase/database";

function monitorUserStatus(userId, callback) {
  const db = getDatabase();
  const statusRef = ref(db, `users/${userId}/status`);

  // TODO: Attach onValue listener and return a cleanup function
}
```

**Expected Solution:**
```javascript
function monitorUserStatus(userId, callback) {
  const db = getDatabase();
  const statusRef = ref(db, `users/${userId}/status`);

  const unsubscribe = onValue(statusRef, (snapshot) => {
    callback(snapshot.val());
  });

  return () => {
    unsubscribe();
  };
}
```

---

### Exercise 2: Granular List Synchronization with `onChildAdded`
**Task:** Listen for newly appended messages at `/rooms/{roomId}/messages` using `onChildAdded`. Collect the snapshot's key and value into a standardized `{ id, ...data }` payload and ensure the listener can be detached.

**Starter Code:**
```javascript
import { getDatabase, ref, onChildAdded, query, limitToLast } from "firebase/database";

function subscribeToRecentMessages(roomId, onNewMessage) {
  const db = getDatabase();
  const messagesRef = query(ref(db, `rooms/${roomId}/messages`), limitToLast(20));

  // TODO: Attach child listener and return the unsubscribe function
}
```

**Expected Solution:**
```javascript
function subscribeToRecentMessages(roomId, onNewMessage) {
  const db = getDatabase();
  const messagesRef = query(ref(db, `rooms/${roomId}/messages`), limitToLast(20));

  const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
    onNewMessage({
      id: snapshot.key,
      ...snapshot.val()
    });
  });

  return unsubscribe;
}
```

---

### Exercise 3: Dynamic Path Switching Without Leaks
**Task:** Implement a subscription manager class or object that switches between chat rooms. Calling `joinRoom(newRoomId)` must automatically unsubscribe from the previous room before subscribing to the new one.

**Starter Code:**
```javascript
import { getDatabase, ref, onValue } from "firebase/database";

class RoomManager {
  constructor() {
    this.db = getDatabase();
    this.currentUnsubscribe = null;
  }

  joinRoom(roomId, onUpdate) {
    // TODO: Clean up existing listener if present, then subscribe to `rooms/${roomId}`
  }

  leaveRoom() {
    // TODO: Clean up any active subscription
  }
}
```

**Expected Solution:**
```javascript
class RoomManager {
  constructor() {
    this.db = getDatabase();
    this.currentUnsubscribe = null;
  }

  joinRoom(roomId, onUpdate) {
    this.leaveRoom();

    const roomRef = ref(this.db, `rooms/${roomId}`);
    this.currentUnsubscribe = onValue(roomRef, (snapshot) => {
      onUpdate(snapshot.val());
    });
  }

  leaveRoom() {
    if (this.currentUnsubscribe) {
      this.currentUnsubscribe();
      this.currentUnsubscribe = null;
    }
  }
}
```

---

## Self-Check Checklist

* Did you capture and invoke the `unsubscribe` function returned directly by `onValue` or `onChildAdded`?
* Did you guarantee that re-subscribing to a new path tears down the preceding listener to prevent memory leaks and duplicate callbacks?
* Did you handle instances where the snapshot may return `null` when a path does not exist?
* Are all subscriptions bound to lifecycle hooks (e.g., component unmount or explicit teardown methods)?
