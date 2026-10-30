# Firestore CRUD Operations in JavaScript

This example demonstrates essential Create, Read, Update, and Delete (CRUD) operations using the modern Firebase Modular SDK (v9+). It shows how to interact with Firestore asynchronously using collection and document references.

```javascript
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runFirestoreCRUD() {
  // 1. CREATE: Add a document with an auto-generated ID
  const usersCollection = collection(db, "users");
  const docRef = await addDoc(usersCollection, {
    name: "Ada Lovelace",
    role: "Developer",
  });
  console.log(`Created: Document ID: ${docRef.id}`);

  // 2. READ: Fetch document data using the reference
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Read:", docSnap.data());
  } else {
    console.log("No such document!");
  }

  // 3. UPDATE: Modify specific fields without overwriting the document
  await updateDoc(docRef, {
    role: "Senior Developer",
  });
  console.log("Updated: Role modified successfully.");

  // 4. DELETE: Remove the document from the collection
  await deleteDoc(docRef);
  console.log("Deleted: Document removed successfully.");
}

runFirestoreCRUD().catch(console.error);
```

## Key takeaways
* **Modular Imports**: Modern Firebase uses functional imports (e.g., `addDoc`, `getDoc`) instead of chaining methods on objects, allowing tree-shaking to reduce bundle size.
* **References vs. Snapshots**: `collection()` and `doc()` create lightweight pointers (references); snapshot functions (`getDoc`) retrieve the actual server data.
* **Partial Updates**: `updateDoc()` modifies only the specified fields, while `setDoc()` can overwrite the entire document unless configured with `{ merge: true }`.
* **Existence Check**: Always call `docSnap.exists()` before calling `docSnap.data()` to avoid runtime errors on missing documents.
