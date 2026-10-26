# PHP PDO: Executing SELECT Queries and Fetching Data

This example demonstrates how to securely connect to a SQLite database using PHP PDO, execute a parameterized `SELECT` query, and fetch the resulting records efficiently.

```php
<?php
// Enable strict typing and error reporting for robust code
declare(strict_types=1);

try {
    // 1. Establish a database connection using PDO (using in-memory SQLite for portability)
    $pdo = new PDO('sqlite::memory:');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2. Setup a dummy table and insert sample data for demonstration
    $pdo->exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, role TEXT)");
    $pdo->exec("INSERT INTO users (name, role) VALUES ('Alice', 'Admin'), ('Bob', 'Editor')");

    // 3. Define the SELECT query with a placeholder for security
    $sql = "SELECT id, name, role FROM users WHERE role = :role";

    // 4. Prepare the statement to prevent SQL injection
    $stmt = $pdo->prepare($sql);

    // 5. Execute the query, binding the parameter value
    $stmt->execute(['role' => 'Admin']);

    // 6. Fetch all matching records as an associative array
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 7. Output the results
    foreach ($users as $user) {
        echo "User: {$user['name']} (Role: {$user['role']})\n";
    }

} catch (PDOException $e) {
    // Handle connection or query errors gracefully
    echo "Database Error: " . $e->getMessage();
}
```

## Key takeaways
* Always use `prepare()` and parameterized queries (`:role`) instead of direct variable interpolation to prevent SQL injection.
* Set `PDO::ATTR_ERRMODE` to `PDO::ERRMODE_EXCEPTION` so database errors throw exceptions rather than failing silently.
* Use `fetchAll(PDO::FETCH_ASSOC)` to retrieve result sets as clean, easy-to-use associative arrays.
