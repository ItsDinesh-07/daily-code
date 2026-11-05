# Practice Exercises: SQL: Window Functions ROW_NUMBER and RANK

This section provides practical scenarios to master the distinction between `ROW_NUMBER()` and `RANK()` when handling duplicate values and ranking datasets.

### Exercise 1: Ranking Sales by Revenue
**Task:** Identify the top 3 products by sales revenue. If two products have the exact same revenue, use `RANK()` to assign them the same position, ensuring the next rank is skipped.

**Starter Code:**
```sql
SELECT product_name, revenue FROM sales_data;
```

**Solution Snippet:**
```sql
SELECT product_name, revenue,
       RANK() OVER(ORDER BY revenue DESC) as sales_rank
FROM sales_data
LIMIT 3;
```

### Exercise 2: Handling Duplicate Employee IDs
**Task:** Assign a unique identifier to every row in an `employee_logs` table. If multiple entries exist for the same employee, ensure each log entry receives a distinct, sequential number using `ROW_NUMBER()`.

**Scenario:** Table `employee_logs` has columns `employee_id` and `timestamp`.

**Solution Snippet:**
```sql
SELECT employee_id, timestamp,
       ROW_NUMBER() OVER(PARTITION BY employee_id ORDER BY timestamp) as log_sequence
FROM employee_logs;
```

### Exercise 3: Identifying the "First" Order
**Task:** Select the very first order (earliest timestamp) placed by each customer. Use `ROW_NUMBER()` to ensure exactly one row per customer is returned.

**Starter Code:**
```sql
-- Assume table: orders (customer_id, order_date)
-- Use a CTE or subquery to filter where the row number is 1.
```

**Solution Snippet:**
```sql
WITH RankedOrders AS (
    SELECT *, ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY order_date ASC) as rn
    FROM orders
)
SELECT * FROM RankedOrders WHERE rn = 1;
```

## Self-Check Checklist
* [ ] Can I explain why `RANK()` produces gaps in numbering while `ROW_NUMBER()` does not?
* [ ] Did I remember to include the `PARTITION BY` clause when I needed to reset rankings per group?
* [ ] Am I using the `ORDER BY` clause inside the `OVER()` function to define the ranking criteria?
* [ ] Have I verified that `ROW_NUMBER()` is strictly unique even when data points are tied?
