# SQL Database Indexing Strategies

Database indexing improves query performance by allowing the database to find rows without scanning the entire table. This example demonstrates how to create a standard index and a composite index to optimize specific query patterns.

```sql
-- Create a sample table
CREATE TABLE employees (
    id INT PRIMARY KEY,
    last_name VARCHAR(50),
    department_id INT,
    hire_date DATE
);

-- 1. Single-column index: Speeds up searches by last_name
CREATE INDEX idx_last_name ON employees(last_name);

-- 2. Composite index: Speeds up searches filtering by both columns
-- The order matters: it helps queries filtering by (dept, hire_date)
CREATE INDEX idx_dept_hire ON employees(department_id, hire_date);

-- Example of optimized queries:
-- Uses idx_last_name
SELECT * FROM employees WHERE last_name = 'Smith';

-- Uses idx_dept_hire (efficient multi-column lookup)
SELECT * FROM employees 
WHERE department_id = 5 
AND hire_date > '2023-01-01';
```

## Key takeaways
* **Indexes trade space for speed:** They speed up read operations (SELECT) but can slightly slow down write operations (INSERT/UPDATE/DELETE).
* **Selectivity matters:** Create indexes on columns frequently used in WHERE clauses, JOINs, or ORDER BY statements.
* **Composite index order:** Place the most restrictive or frequently used column first in a composite index for optimal performance.
