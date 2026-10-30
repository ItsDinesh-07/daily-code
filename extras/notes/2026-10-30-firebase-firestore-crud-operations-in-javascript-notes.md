# Notes & Interview Tips: Firebase: Firestore CRUD Operations in JavaScript

## Common Pitfalls & Anti-Patterns
*   **Over-fetching Data:** Retrieving entire documents or large collections when only a specific field is needed. **Fix:** Use `field masks` or select only necessary fields in your query logic to reduce latency and costs.
*   **Insecure Security Rules:** Using `allow read, write: if true;` in production. **Fix:** Always define granular rules based on authentication state (`request.auth != null`) and resource ownership.
*   **Ignoring Asynchronous Errors:** Failing to wrap operations in `try/catch` blocks. **Fix:** Since Firestore returns Promises, always handle network failures or permission denials to prevent unhandled promise rejections.

## Key Interview Questions
1. **How do you handle real-time updates vs. one-time fetches in Firestore?**
   * **Answer:** Use `.onSnapshot()` for real-time listeners, which push updates to the client whenever data changes. Use `.get()` for one-time fetches when data doesn't need to stay synchronized, saving on read costs.
2. **Explain the difference between `set()` and `update()` in Firestore.**
   * **Answer:** `set()` creates a document or overwrites it entirely if it exists (unless `{ merge: true }` is used). `update()` modifies specific fields in an existing document; it will fail if the document does not exist.
3. **What is a Firestore Batch Write and why should you use it?**
   * **Answer:** A batch write allows you to group multiple write operations (set, update, delete) into a single request. It ensures atomicity: either all operations succeed, or none do, which is critical for maintaining data consistency across related records.

## Best Practices Summary
*   **Use Data Converter Classes:** Implement `withConverter()` to map Firestore data directly to JavaScript classes, ensuring type safety and cleaner code.
*   **Optimize Read Costs:** Cache data locally when possible and use pagination (`limit()` and `startAfter()`) to avoid loading unnecessary documents.
*   **Structured Collections:** Design your database schema with subcollections to improve query performance and keep document sizes within the 1MB limit.
*   **Use Auto-ID:** Rely on `doc()` without arguments to generate unique document IDs rather than manually creating collision-prone IDs.
*   **Audit Permissions:** Regularly test security rules using the Firebase Local Emulator Suite before deploying to production.
