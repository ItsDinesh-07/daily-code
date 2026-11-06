# SQL Subqueries and Common Table Expressions

Subqueries allow you to nest queries to retrieve data based on intermediate results, while Common Table Expressions (CTEs) improve readability by defining temporary result sets. Both are powerful tools for modularizing complex data transformations.

```sql
-- 1. Subquery: Retrieve employees earning more than the company average
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- 2. CTE: Calculate department salary totals, then filter those above 50k
WITH DeptTotals AS (
    SELECT department_id, SUM(salary) AS total_pay
    FROM employees
    GROUP BY department_id
)
SELECT department_id, total_pay
FROM DeptTotals
WHERE total_pay > 50000;
```

## Key takeaways
* **Subqueries** are ideal for simple, one-off comparisons or filtering criteria.
* **CTEs** enhance code maintainability by breaking complex logic into named, sequential blocks.
* **Readability:** CTEs are generally preferred over deeply nested subqueries for recursive logic or multi-step data processing.
