# Secure Database Connection with PHP PDO

Connecting to a database with PDO requires strict configurations to prevent SQL injection and sensitive data leakage. This example configures UTF-8 encoding, disables emulated prepared statements for true parameter isolation, and safely handles exceptions.

```php
<?php
declare(strict_types=1);

// Configuration: Load credentials securely (fallback to local defaults)
$host    = getenv('DB_HOST') ?: '127.0.0.1';
$db      = getenv('DB_NAME') ?: 'test_db';
$user    = getenv('DB_USER') ?: 'root';
$pass    = getenv('DB_PASS') ?: '';
$charset = 'utf8mb4'; // Prevents multi-byte character injection vulnerabilities

// Data Source Name (DSN)
$dsn = "mysql:host={$host};dbname={$db};charset={$charset}";

// PDO security and runtime options
$options = [
    // Throw exceptions on errors instead of failing silently or emitting warnings
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    // Return rows as associative arrays by default (e.g., ['column' => 'value'])
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    // Turn off emulation to ensure the DB engine handles prepared statements natively
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Establish the connection
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Verify connection with a safe, simple test query
    $stmt = $pdo->query('SELECT CURRENT_TIMESTAMP AS current_time');
    $row = $stmt->fetch();

    echo "Connected successfully. Database time: " . $row['current_time'] . PHP_EOL;

} catch (PDOException $e) {
    // Log the real error internally for debugging
    error_log('Database connection error: ' . $e->getMessage());

    // Never show $e->getMessage() to users; it may expose DB host, username, or credentials
    http_response_code(500);
    echo "Database error. Please try again later." . PHP_EOL;
    exit(1);
}
```

## Key takeaways

* **Disable Emulation (`PDO::ATTR_EMULATE_PREPARES => false`)**: Forces the database server to execute real prepared statements, mitigating SQL injection risks that can bypass client-side emulation.
* **Use `utf8mb4` in DSN**: Enforces full UTF-8 encoding at the driver level, closing security gaps caused by multi-byte character vulnerabilities.
* **Enforce Exceptions (`PDO::ERRMODE_EXCEPTION`)**: Ensures database errors trigger exceptions instead of silent failures, avoiding accidental fallback logic.
* **Catch and Redact `PDOException`**: Never expose raw connection errors to end users, as exception messages often contain hostnames, database names, and credentials.
