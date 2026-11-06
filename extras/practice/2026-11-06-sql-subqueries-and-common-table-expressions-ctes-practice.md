# Practice Exercises: SQL: Subqueries and Common Table Expressions (CTEs)

This section focuses on mastering nested data retrieval and improving query readability through modular CTE structures.

### Exercise 1: Subquery for Filtering
**Task:** Find the names of all employees who earn more than the company's average salary.
**Scenario:** Use table `employees` with columns `name` and `salary`.
**Solution Snippet:**
```sql
SELECT name FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### Exercise 2: Using a CTE for Aggregation
**Task:** Create a CTE named `DeptTotals` to calculate the total salary per department, then select departments where the total salary exceeds $50,000.
**Scenario:** Table `employees` has columns `department_id` and `salary`.
**Solution Snippet:**
```sql
WITH DeptTotals AS (
    SELECT department_id, SUM(salary) as total_salary
    FROM employees
    GROUP BY department_id
)
SELECT department_id FROM DeptTotals WHERE total_salary > 50000;
```

### Exercise 3: Multi-Level CTEs
**Task:** Use two CTEs—first to identify employees in the 'Sales' department, and second to find the top earner within that filtered group.
**Scenario:** Table `employees` has columns `name`, `department`, and `salary`.
**Solution Snippet:**
```sql
WITH SalesStaff AS (
    SELECT name, salary FROM employees WHERE department = 'Sales'
),
MaxSalary AS (
    SELECT MAX(salary) as top_pay FROM SalesStaff
)
SELECT name FROM SalesStaff, MaxSalary WHERE SalesStaff.salary = MaxSalary.top_pay;
```

## Self-Check Checklist
* [ ] Did I use a subquery only when the inner result is a single value or a simple list?
* [ ] Is my CTE named descriptively to enhance the readability of the overall query?
* [ ] Have I considered if a `JOIN` might perform better than a subquery for my specific dataset?
* [ ] Does my CTE reference itself recursively only when necessary for tree-structured data?
