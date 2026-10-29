# Practice Exercises: PHP PDO: Updating and Deleting Records Safely

Practice implementing safe `UPDATE` and `DELETE` operations using PDO prepared statements, input binding, row count verification, and transactions to prevent SQL injection and data corruption.

---

### Exercise 1: Safe Email Update with Row Verification

**Task:**  
Write a function `updateUserEmail(PDO $pdo, int $userId, string $newEmail): bool` that safely updates a user's email address using named parameters. Return `true` if at least one row was updated, and `false` if the user was not found or the email was unchanged.

**Starter Code:**
```php
function updateUserEmail(PDO $pdo, int $userId, string $newEmail): bool {
    // TODO: Prepare the UPDATE statement using named placeholders
    // TODO: Execute with bound parameters
    // TODO: Return true if rowCount() > 0, otherwise false
}
```

**Solution Snippet:**
```php
function updateUserEmail(PDO $pdo, int $userId, string $newEmail): bool {
    $sql = "UPDATE users SET email = :email WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':email' => $newEmail,
        ':id'    => $userId
    ]);

    return $stmt->rowCount() > 0;
}
```

---

### Exercise 2: Conditional Record Deletion with Positional Placeholders

**Task:**  
Write code to safely delete an order from an `orders` table. The deletion must only occur if the order ID matches and the order's status is `'cancelled'`. Use positional placeholders (`?`).

**Starter Code:**
```php
$orderId = 42;

// TODO: Write and prepare the DELETE query ensuring status is 'cancelled'
// TODO: Execute with positional parameters
// TODO: Print the number of deleted records
```

**Solution Snippet:**
```php
$sql = "DELETE FROM orders WHERE id = ? AND status = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$orderId, 'cancelled']);

echo "Deleted rows: " . $stmt->rowCount();
```

---

### Exercise 3: Atomic Soft-Delete and Session Purge with Transactions

**Task:**  
Deactivate an account by setting `is_active = 0` in the `users` table and remove all associated active sessions from the `user_sessions` table for a given `$userId`. Wrap both operations in a transaction to guarantee atomicity. Roll back on any `PDOException`.

**Starter Code:**
```php
$userId = 15;

try {
    // TODO: Begin transaction
    // TODO: Prepare and execute UPDATE on users
    // TODO: Prepare and execute DELETE on user_sessions
    // TODO: Commit transaction
} catch (PDOException $e) {
    // TODO: Roll back if in transaction
    throw $e;
}
```

**Solution Snippet:**
```php
try {
    $pdo->beginTransaction();

    $updateStmt = $pdo->prepare("UPDATE users SET is_active = 0 WHERE id = :id");
    $updateStmt->execute([':id' => $userId]);

    $deleteStmt = $pdo->prepare("DELETE FROM user_sessions WHERE user_id = :id");
    $deleteStmt->execute([':id' => $userId]);

    $pdo->commit();
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}
```

---

## Self-Check Checklist

- [ ] Are all dynamic values passed via parameter placeholders (`?` or `:name`) rather than concatenated directly into the SQL string?
- [ ] Does every `UPDATE` and `DELETE` query contain an explicit `WHERE` clause to avoid unintended full-table modifications?
- [ ] Is `$stmt->rowCount()` checked to confirm that the expected number of records were actually affected?
- [ ] Are multi-step update or delete operations wrapped in a transaction with proper `rollBack()` error handling?
