# Firebase Firestore Querying and Filtering

Firestore allows you to retrieve specific subsets of data using the `.where()` method. This example demonstrates how to filter documents in a collection based on field values and ordering.

```javascript
import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

async function getFilteredUsers() {
  // 1. Reference the target collection
  const usersRef = collection(db, "users");

  // 2. Create a query: filter by 'age' and order by 'name'
  // Note: Compound queries often require a composite index in Firebase Console
  const q = query(
    usersRef, 
    where("age", ">=", 18), 
    orderBy("age", "asc")
  );

  // 3. Execute the query and process results
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

getFilteredUsers();
```

## Key takeaways
* **Chaining:** Use `query()` to combine multiple constraints like `where`, `orderBy`, and `limit`.
* **Indexes:** Firestore requires composite indexes for complex queries involving multiple fields; the console will provide a link to create them if missing.
* **Efficiency:** Querying filters data on the server side, ensuring you only download the documents that match your specific criteria.
