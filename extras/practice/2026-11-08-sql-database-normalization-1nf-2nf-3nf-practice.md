# Practice Exercises: SQL: Database Normalization (1NF, 2NF, 3NF)

This section provides practical scenarios to help you identify normalization violations and restructure relational tables to meet 1NF, 2NF, and 3NF standards.

### Exercise 1: Achieving 1NF
**Task:** Identify the violation of 1NF in the table below and write the SQL to restructure it into a normalized format.
**Scenario:** A `Students` table exists with a column `Enrolled_Courses` containing comma-separated values (e.g., 'CS101, MATH200').
**Solution:** Create a bridge table `Student_Courses` with `student_id` and `course_id`.
```sql
-- Move data from the comma-separated list into individual rows
CREATE TABLE Student_Courses (
    student_id INT,
    course_id VARCHAR(10),
    PRIMARY KEY (student_id, course_id)
);
```

### Exercise 2: Achieving 2NF
**Task:** Resolve the partial functional dependency in the table below.
**Scenario:** A `Project_Assignments` table has a composite primary key (`employee_id`, `project_id`) and includes an `employee_name` column. `employee_name` depends only on `employee_id`, not the full key.
**Solution:** Split the table to remove the partial dependency.
```sql
-- Table 1: Entity
CREATE TABLE Employees (employee_id INT PRIMARY KEY, employee_name VARCHAR(50));
-- Table 2: Relationship
CREATE TABLE Project_Assignments (employee_id INT, project_id INT, PRIMARY KEY (employee_id, project_id));
```

### Exercise 3: Achieving 3NF
**Task:** Remove the transitive dependency from the table below.
**Scenario:** A `Orders` table has `order_id` (PK), `customer_id`, and `customer_zip`. `customer_zip` depends on `customer_id`, which depends on `order_id`.
**Solution:** Extract the customer details into a separate table to eliminate the transitive dependency.
```sql
-- Table 1: Orders
CREATE TABLE Orders (order_id INT PRIMARY KEY, customer_id INT);
-- Table 2: Customers
CREATE TABLE Customers (customer_id INT PRIMARY KEY, customer_zip VARCHAR(10));
```

## Self-Check Checklist
* Are all attributes atomic (no multi-valued or comma-separated cells)? (1NF)
* Have I removed all partial functional dependencies where non-key attributes depend on only part of the primary key? (2NF)
* Have I ensured that all non-key attributes depend solely on the primary key, with no transitive dependencies? (3NF)
* Does the schema maintain referential integrity through properly defined foreign keys?
