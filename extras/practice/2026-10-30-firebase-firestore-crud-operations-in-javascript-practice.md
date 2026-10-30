# Practice Exercises: Firebase: Firestore CRUD Operations in JavaScript

Strengthen your skills in managing Firestore data by implementing Create, Read, Update, and Delete operations using the Firebase Web SDK (v9+ Modular).

---

### Exercise 1: Create and Read a Document
**Task:** Write an asynchronous function `createAndFetchUser` that creates a new document in the `users` collection with auto-generated ID containing `name` and `email`, then fetches that newly created document and logs its data.

**Starter Code:**
```javascript
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

async function createAndFetchUser(userData) {
  // 1. Add userData to the "users" collection
  // 2. Fetch the document using its generated ID
  // 3. Return the document data
}
```

**Expected Solution Snippet:**
```javascript
async function createAndFetchUser(userData) {
  const docRef = await addDoc(collection(db, "users"), userData);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("No such document!");
  }
}
```

---

### Exercise 2: Update Nested Fields and Atomic Increments
**Task:** Write an asynchronous function `recordProductPurchase` that takes a `productId` and updates the product document in the `inventory` collection: set `status` to `"sold"`, and atomically decrement `stock` by 1 using Firestore's `increment` helper.

**Starter Code:**
```javascript
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";

const db = getFirestore();

async function recordProductPurchase(productId) {
  // Update "status" to "sold" and decrement "stock" by 1
}
```

**Expected Solution Snippet:**
```javascript
async function recordProductPurchase(productId) {
  const productRef = doc(db, "inventory", productId);
  await updateDoc(productRef, {
    status: "sold",
    stock: increment(-1)
  });
}
```

---

### Exercise 3: Delete Document with Existence Check
**Task:** Write an asynchronous function `deleteTaskIfExists` that takes a `taskId`. Check if the task exists in the `tasks` collection. If it exists, delete the document and return `true`; if it does not exist, return `false`.

**Starter Code:**
```javascript
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";

const db = getFirestore();

async function deleteTaskIfExists(taskId) {
  // Check existence, delete if found, return true or false
}
```

**Expected Solution Snippet:**
```javascript
async function deleteTaskIfExists(taskId) {
  const taskRef = doc(db, "tasks", taskId);
  const taskSnap = await getDoc(taskRef);

  if (taskSnap.exists()) {
    await deleteDoc(taskRef);
    return true;
  }
  return false;
}
```

---

## Self-Check Checklist

* Used modular functions (`doc()`, `collection()`, `getDoc()`, `addDoc()`, `updateDoc()`, `deleteDoc()`) instead of namespaced methods.
* Awaited all asynchronous Firestore calls and wrapped operational logic in appropriate error handling (`try/catch`).
* Verified document presence using `snapshot.exists()` before calling `snapshot.data()`.
* Utilized atomic transforms like `increment()` instead of manual read-modify-write patterns where applicable.
