# Database Normalization (1NF, 2NF, 3NF)

Database normalization organizes table columns and relations to minimize redundancy and eliminate data anomalies. First Normal Form (1NF) enforces atomic values and unique keys, Second Normal Form (2NF) removes partial dependencies on composite keys, and Third Normal Form (3NF) removes transitive dependencies between non-key attributes.

```sql
-- 1NF: Atomic values, primary keys exist.
-- 2NF: No partial dependencies on composite keys (Product details live in products, not order_items).
-- 3NF: No transitive dependencies (Customer city belongs in customers, not orders).

-- Step 1: Customer table (Prevents 3NF transitive dependency: order_id -> customer_id -> city)
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY,
    customer_name TEXT NOT NULL,
    city TEXT NOT NULL
);

-- Step 2: Product table (Separated to satisfy 2NF; prices depend solely on product_id)
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Step 3: Orders table (Relies on customer_id, avoiding repeated customer attributes)
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Step 4: Order Items table (Composite PK: order_id, product_id)
-- 1NF: Atomic rows instead of comma-separated product lists.
-- 2NF: 'quantity' depends on BOTH order_id AND product_id (full functional dependency).
CREATE TABLE order_items (
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Populate normalized tables with sample data
INSERT INTO customers (customer_id, customer_name, city) 
VALUES (1, 'Alice Smith', 'Seattle');

INSERT INTO products (product_id, product_name, unit_price) 
VALUES (101, 'Keyboard', 75.00), (102, 'Mouse', 25.00);

INSERT INTO orders (order_id, customer_id, order_date) 
VALUES (5001, 1, '2023-11-01');

INSERT INTO order_items (order_id, product_id, quantity) 
VALUES (5001, 101, 1), (5001, 102, 2);

-- Query the normalized database via JOINs to reconstruct the complete record
SELECT 
    o.order_id,
    c.customer_name,
    c.city,
    p.product_name,
    oi.quantity,
    (oi.quantity * p.unit_price) AS line_total
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;
```

## Key takeaways

* **1NF (Atomic Data):** Each column holds only single, indivisible values (no arrays or comma-delimited strings), and each table has a defined primary key.
* **2NF (Full Functional Dependency):** Must be in 1NF; every non-key column must depend on the *entire* primary key, which eliminates partial dependencies in tables with composite keys.
* **3NF (No Transitive Dependency):** Must be in 2NF; non-key columns must depend *only* on the primary key, preventing chains like `X -> Y -> Z` (e.g., storing a customer's address in the `orders` table).
* **Trade-offs:** Normalization drastically reduces insert, update, and delete anomalies at the cost of requiring multi-table `JOIN` operations for read queries.
