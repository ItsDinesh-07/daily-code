# SQL GROUP BY and HAVING Clause Aggregations

This example demonstrates how to use the `GROUP BY` clause to aggregate data across categories and the `HAVING` clause to filter those aggregated results based on specific conditions.

```sql
-- SQLite compatible example

-- 1. Create a sample table for sales data
CREATE TABLE sales (
    id INTEGER PRIMARY KEY,
    category TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL
);

-- 2. Insert sample records
INSERT INTO sales (category, amount) VALUES 
('Electronics', 1200.00),
('Electronics', 300.00),
('Clothing', 45.00),
('Clothing', 120.00),
('Clothing', 60.00),
('Electronics', 800.00),
('Groceries', 50.00),
('Groceries', 25.00);

-- 3. Query using GROUP BY and HAVING
-- Find categories where the total sales amount is greater than $200
SELECT 
    category,
    SUM(amount) AS total_sales,
    COUNT(*) AS transaction_count
FROM 
    sales
GROUP BY 
    category                          -- Group rows by product category
HAVING 
    SUM(amount) > 200.00              -- Filter aggregated groups (total sales > 200)
ORDER BY 
    total_sales DESC;                 -- Sort the final result set

-- 4. Clean up the table
DROP TABLE sales;
```

## Key takeaways
* `GROUP BY` collapses rows sharing a common value into summary groups to perform aggregate functions like `SUM()` or `COUNT()`.
* `HAVING` filters the grouped results based on aggregate values, whereas the `WHERE` clause filters individual rows before grouping.
* The order of execution in SQL generally processes `WHERE` first, then `GROUP BY`, then `HAVING`, and finally `ORDER BY`.
