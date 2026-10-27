# PHP PDO Database Transactions

Transactions ensure data integrity by grouping multiple operations into a single unit of work. If any operation fails, the `rollback()` method reverts all changes, while `commit()` saves them permanently.

```php
<?php
$dsn = 'mysql:host=localhost;dbname=test_db;charset=utf8mb4';
$pdo = new PDO($dsn, 'username', 'password', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

try {
    // 1. Start the transaction
    $pdo->beginTransaction();

    // 2. Perform database operations
    $pdo->exec("UPDATE accounts SET balance = balance - 100 WHERE id = 1");
    $pdo->exec("UPDATE accounts SET balance = balance + 100 WHERE id = 2");

    // 3. Commit the changes if both queries succeeded
    $pdo->commit();
    echo "Transaction successful.";

} catch (Exception $e) {
    // 4. Roll back changes if any error occurred
    $pdo->rollBack();
    echo "Transaction failed: " . $e->getMessage();
}
```

## Key takeaways
* Always wrap transaction logic in a `try-catch` block to handle potential errors gracefully.
* Setting `PDO::ERRMODE_EXCEPTION` is mandatory for the `catch` block to trigger correctly upon SQL failures.
* `rollBack()` undoes every operation performed since `beginTransaction()` was called.
* Transactions prevent "partial updates" where only half of your operations succeed, keeping your database in a consistent state.
