# Practice Exercises: SQL: Database Indexing Strategies
Apply practical indexing techniques to optimize query performance, manage composite indexes, and evaluate execution plans.

### Exercise 1: Creating a Single-Column B-Tree Index
**Problem Task:** 
You have a large `orders` table. A frequent query searches for orders by `customer_id`. Create an optimal index to speed up this exact lookup and write the query using it.

**Starter Code:**
```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    total_amount DECIMAL(10, 2)
);

-- Write your index creation statement below:

-- Write your query below:
SELECT * FROM orders WHERE customer_id = 42;
```

**Solution Snippet:**
```sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
SELECT * FROM orders WHERE customer_id = 42;
```

---

### Exercise 2: Designing a Composite (Multi-Column) Index
**Problem Task:** 
Queries against the `employees` table frequently filter by `department_id` and sort or filter by `hire_date` together. Create a composite index that satisfies both conditions efficiently, keeping leftmost-prefix rules in mind.

**Starter Code:**
```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    department_id INT,
    hire_date DATE,
    salary DECIMAL(10, 2)
);

-- Write your composite index statement below:

-- Write a query that successfully leverages the leftmost prefix of your index:
```

**Solution Snippet:**
```sql
CREATE INDEX idx_emp_dept_hire ON employees(department_id, hire_date);
-- This query leverages the leftmost prefix (department_id alone, or both columns):
SELECT * FROM employees WHERE department_id = 3 AND hire_date >= '2022-01-01';
```

---

### Exercise 3: Analyzing Execution Plans and Covering Indexes
**Problem Task:** 
Use `EXPLAIN` to inspect a query that retrieves employee salaries by department. Modify the query and create a covering index so the database can fulfill the request entirely from the index without hitting the table rows.

**Starter Code:**
```sql
-- Analyze this execution plan:
EXPLAIN SELECT department_id, salary FROM employees WHERE department_id = 5;

-- Create a covering index to optimize the query above:

```

**Solution Snippet:**
```sql
-- Creating a covering index that includes the 'salary' column
CREATE INDEX idx_emp_dept_salary ON employees(department_id, salary);

-- Execution plan will now show "Using index" (covering index hit), avoiding a full table lookup.
EXPLAIN SELECT department_id, salary FROM employees WHERE department_id = 5;
```

## Self-Check Checklist
- [ ] Did I create single-column indexes on high-cardinality foreign keys and frequently filtered columns?
- [ ] Did I order the columns in my composite indexes based on equality filters first, followed by range filters?
- [ ] Did I avoid over-indexing tables that experience heavy write (INSERT/UPDATE/DELETE) operations?
- [ ] Did I use `EXPLAIN` to verify that my queries utilize the newly created indexes instead of performing full table scans?
