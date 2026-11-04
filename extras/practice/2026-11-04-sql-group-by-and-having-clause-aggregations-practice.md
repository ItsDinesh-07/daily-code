# Practice Exercises: SQL: GROUP BY and HAVING Clause Aggregations

Master the ability to summarize data sets and filter aggregate results by completing the following exercises designed to test your knowledge of analytical SQL queries.

### Exercise 1: Finding High-Volume Categories
**Task:** Retrieve the `category` and the total number of items from the `products` table, but only include categories that have more than 5 items.

**Starter Code:**
```sql
SELECT category, COUNT(*) as total_items
FROM products
-- Add your clauses here
```

**Expected Output:** A list of categories where `total_items > 5`.

---

### Exercise 2: Average Salary by Department
**Task:** Calculate the average salary for each department in the `employees` table. Filter the results to show only departments where the average salary is greater than $60,000.

**Starter Code:**
```sql
SELECT department_id, AVG(salary) as avg_salary
FROM employees
GROUP BY department_id
-- Add your HAVING clause here
```

**Solution Snippet:** `HAVING AVG(salary) > 60000;`

---

### Exercise 3: Identifying Frequent Customers
**Task:** Using an `orders` table with columns `customer_id` and `order_amount`, find the `customer_id` of all customers who have placed at least 3 orders.

**Scenario:**
- Table: `orders`
- Columns: `customer_id`, `order_id`

**Expected Logic:**
```sql
SELECT customer_id, COUNT(order_id) as order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(order_id) >= 3;
```

## Self-Check Checklist
*   Did I use `GROUP BY` on every non-aggregated column present in the `SELECT` statement?
*   Did I place the `WHERE` clause (for filtering rows) before the `GROUP BY` clause?
*   Did I use `HAVING` specifically to filter the results of an aggregate function?
*   Is the column in the `HAVING` clause either an aggregate function or part of the `GROUP BY` list?
