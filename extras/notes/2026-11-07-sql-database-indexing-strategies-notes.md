# Notes & Interview Tips: SQL: Database Indexing Strategies

## Common Pitfalls & Anti-Patterns
*   **Over-indexing:** Creating indexes on every column. *Avoidance:* Only index columns frequently used in `WHERE`, `JOIN`, or `ORDER BY` clauses. Indexes slow down `INSERT`, `UPDATE`, and `DELETE` operations due to overhead.
*   **Ignoring Index Cardinality:** Creating indexes on columns with low cardinality (e.g., "is_active" boolean). *Avoidance:* Use indexes for high-selectivity columns where the query returns a small fraction of total rows.
*   **Functions on Indexed Columns:** Using `WHERE YEAR(date_column) = 2023`. *Avoidance:* This prevents index usage (non-SARGable). Use range queries instead: `WHERE date_column >= '2023-01-01' AND date_column < '2024-01-01'`.

## Key Interview Questions
1.  **What is the difference between a Clustered and Non-Clustered index?**
    *   *Answer:* A Clustered index determines the physical storage order of data in the table (one per table). A Non-Clustered index is a separate structure containing a pointer to the actual data rows; a table can have multiple non-clustered indexes.
2.  **What is a Covering Index?**
    *   *Answer:* An index that contains all the columns requested in a query (including those in the SELECT clause). This allows the database to retrieve all required data directly from the index tree without performing a "bookmark lookup" or "key lookup" to the base table.
3.  **Explain the "Left-Prefix" rule in composite indexes.**
    *   *Answer:* For a composite index on `(A, B, C)`, the database can use the index for queries filtering by `(A)`, `(A, B)`, or `(A, B, C)`. It cannot effectively use the index for queries filtering only by `(B)` or `(C)` because the search tree is ordered by the leading column `A` first.

## Best Practices Summary
*   **Prioritize selectivity:** Target columns that filter the most data for your index candidates.
*   **Maintain composite index order:** Put the most restrictive or frequently queried columns at the start of the index definition.
*   **Analyze before optimizing:** Always use `EXPLAIN` or `EXPLAIN ANALYZE` to verify if the query optimizer is actually utilizing your indexes.
*   **Clean up:** Periodically drop unused indexes to reduce write latency and storage costs.
*   **Monitor fragmentation:** Rebuild or reorganize indexes regularly if the table experiences high churn to maintain scan performance.
