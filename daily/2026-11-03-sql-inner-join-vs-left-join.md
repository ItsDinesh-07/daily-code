# SQL: INNER JOIN vs LEFT JOIN

`INNER JOIN` returns only rows with matching values in both tables, while `LEFT JOIN` returns all rows from the left table, plus matching rows from the right table (filling with `NULL` where no match exists).

```sql
-- Create two sample tables
CREATE TABLE users (id INT, name TEXT);
CREATE TABLE orders (user_id INT, item TEXT);

INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie');
INSERT INTO orders VALUES (1, 'Laptop'), (2, 'Phone');

-- INNER JOIN: Returns only users who have placed an order
-- Result: Alice (Laptop), Bob (Phone)
SELECT users.name, orders.item
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN: Returns all users, even those without orders
-- Result: Alice (Laptop), Bob (Phone), Charlie (NULL)
SELECT users.name, orders.item
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

## Key takeaways
* **INNER JOIN** acts as a filter, excluding data that does not have a pair in the joined table.
* **LEFT JOIN** preserves all records from the primary (left) table regardless of matches.
* Use **LEFT JOIN** when you want to see a full list of items and additional data only if it exists.
