# PHP PDO: Updating and Deleting Records Safely

Using PHP Data Objects (PDO) with prepared statements is the standard practice for modifying database records securely. Parameterized queries bind user inputs separately from the SQL statement, neutralizing SQL injection vulnerabilities. Inspecting the affected row count ensures your operation targeted the expected data.

```php
<?php
// Initialize an in-memory SQLite database for a self-contained, runnable example
try {
    $pdo = new PDO('sqlite::memory:', null, null, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Set up a demo table and initial records
    $pdo->exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, status TEXT)");
    $pdo->exec("INSERT INTO users (name, email, status) VALUES 
        ('Alice', 'alice@example.com', 'pending'),
        ('Bob', 'bob@example.com', 'active')");

    // 1. SAFELY UPDATING A RECORD (using named parameters)
    // Never concatenate user input directly into SQL strings
    $updateSql = "UPDATE users SET status = :status WHERE email = :email";
    $updateStmt = $pdo->prepare($updateSql);

    // Bind parameters and execute in one call
    $updateStmt->execute([
        ':status' => 'active',
        ':email'  => 'alice@example.com'
    ]);

    // Verify how many rows were updated
    echo "Rows updated: " . $updateStmt->rowCount() . PHP_EOL;

    // 2. SAFELY DELETING A RECORD (using positional parameters)
    $deleteSql = "DELETE FROM users WHERE id = ?";
    $deleteStmt = $pdo->prepare($deleteSql);

    $userIdToDelete = 2; // Bob's ID
    $deleteStmt->execute([$userIdToDelete]);

    // Verify how many rows were deleted
    echo "Rows deleted: " . $deleteStmt->rowCount() . PHP_EOL;

    // Output remaining users to confirm changes
    $remainingUsers = $pdo->query("SELECT * FROM users")->fetchAll();
    print_r($remainingUsers);

} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
```

## Key takeaways

* **Always use prepared statements**: Binding variables via `prepare()` and `execute()` isolates input data from SQL syntax, preventing SQL injection.
* **Always specify a precise `WHERE` clause**: Missing or malformed `WHERE` conditions will inadvertently update or delete all records in the table.
* **Inspect `rowCount()`**: Use `PDOStatement::rowCount()` to confirm that the expected number of records was affected by the operation.
* **Enable exception handling**: Set `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION` so failed operations trigger catchable exceptions rather than failing silently.
