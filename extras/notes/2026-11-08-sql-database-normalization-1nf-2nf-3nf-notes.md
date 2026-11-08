# Notes & Interview Tips: SQL: Database Normalization (1NF, 2NF, 3NF)

## Common Pitfalls & Anti-Patterns
*   **Over-Normalization:** Creating too many small tables leads to excessive `JOIN` operations, significantly degrading read performance. **Avoid by** balancing normalization with performance needs (denormalize only when necessary for read-heavy workloads).
*   **Ignoring Transitive Dependencies:** Developers often group attributes into a table that depend on a non-key column. **Avoid by** checking if any non-key column determines another, and move those into a separate table to satisfy 3NF.
*   **Using Multi-Valued Attributes:** Storing comma-separated strings (e.g., "1,2,3") in a single column violates 1NF and makes querying/indexing impossible. **Avoid by** creating a mapping table (junction table) to store these as distinct rows.

## Key Interview Questions
1. **Q: What is the primary difference between 2NF and 3NF?**
   *   **A:** 2NF requires the table to be in 1NF and all non-key attributes to be fully functionally dependent on the *entire* primary key. 3NF requires the table to be in 2NF and removes **transitive dependencies** (where non-key columns depend on other non-key columns).
2. **Q: Why would you choose to denormalize a database?**
   *   **A:** To improve read performance in read-heavy applications by reducing the number of costly `JOIN` operations. It is a calculated trade-off that sacrifices data redundancy for speed.
3. **Q: What is a partial dependency, and which normal form prevents it?**
   *   **A:** A partial dependency occurs when a non-key attribute depends on only part of a composite primary key. 2NF prevents this by requiring that non-key attributes depend on the whole primary key.

## Best Practices Summary
*   **Atomicity:** Ensure every column contains only atomic (indivisible) values (1NF).
*   **Eliminate Redundancy:** Ensure no non-key field describes another non-key field to keep data consistent (3NF).
*   **Use Surrogate Keys:** Prefer auto-incrementing integers (IDs) over complex composite keys to simplify relationships.
*   **Maintain Integrity:** Use Foreign Key constraints to enforce referential integrity between normalized tables.
*   **Analyze Before Denormalizing:** Always reach 3NF first; only move to a denormalized schema after profiling identifies clear performance bottlenecks.
