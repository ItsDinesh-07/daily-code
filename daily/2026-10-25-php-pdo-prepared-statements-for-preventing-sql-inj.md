# PHP PDO: Prepared Statements for Preventing SQL Injection

Prepared statements protect against SQL injection by separating the query structure from the user-supplied data. The database engine compiles the SQL template first, ensuring incoming values are strictly treated as data literals rather than executable commands.

```php
<?php
// Initialize an in-memory SQLite database for a standalone, runnable demo
$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false, // Forces native prepared statements
]);

// Set up a mock users table
$pdo->exec("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, email TEXT)");

// 1. Insert data using named placeholders (:username, :email)
$insertStmt = $pdo->prepare("INSERT INTO users (username, email) VALUES (:username, :email)");
$insertStmt->execute([
    ':username' => 'alice',
    ':email'    => 'alice@example.com',
]);

// 2. Attempt a query using a classic SQL injection payload
$untrustedInput = "alice' OR '1'='1";

// Safe query using a positional placeholder (?)
$selectStmt = $pdo->prepare("SELECT id, username, email FROM users WHERE username = ?");
$selectStmt->execute([$untrustedInput]);
$result = $selectStmt->fetch();

// The injection fails because the database looks for the literal string "alice' OR '1'='1"
if ($result) {
    echo "User found: " . $result['username'] . "\n";
} else {
    echo "Query executed safely: No user matched the literal injected string.\n";
}
```

## Key takeaways

* **Separation of Concerns**: `prepare()` compiles the query logic, while `execute()` transmits parameters independently, preventing payloads from modifying the SQL syntax.
* **Disable Emulation**: Set `PDO::ATTR_EMULATE_PREPARES => false` to ensure the database engine handles parameter binding natively rather than PHP string-interpolating it.
* **Placeholder Types**: Use named placeholders (`:name`) or positional placeholders (`?`), passing parameter arrays directly to `execute()`.
* **Never Concatenate**: Dynamic values must never be concatenated (`$sql = "..." . $input`) into query strings, even when using PDO.
