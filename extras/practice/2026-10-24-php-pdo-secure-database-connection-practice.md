# Practice Exercises: PHP PDO: Secure Database Connection

Practice configuring and establishing hardened PHP Data Objects (PDO) connections using secure DSN parameters, robust exception handling, and defensive driver options.

---

### Exercise 1: Resilient Connection with Exception Handling

**Task:**  
Write a script that attempts to connect to a MySQL database (`dbname=app_db`, `host=127.0.0.1`, `port=3306`). Wrap the instantiation in a `try-catch` block that catches `PDOException`. If the connection fails, log the actual error message internally and print a generic error message so sensitive credentials and connection details are not exposed to the user.

**Starter Code:**
```php
<?php
$host = '127.0.0.1';
$db   = 'app_db';
$user = 'db_user';
$pass = 'super_secret_password';
$charset = 'utf8mb4';

// TODO: Create the DSN and connect inside a try-catch block
```

**Solution Snippet:**
```php
$dsn = "mysql:host=$host;dbname=$db;charset=$charset;port=3306";

try {
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log($e->getMessage());
    exit('Database connection error. Please try again later.');
}
```

---

### Exercise 2: Enforcing Secure Driver Options

**Task:**  
Refactor an unconfigured PDO connection to pass a security-hardened `$options` array directly into the constructor. Your configuration must:
1. Throw exceptions on errors (`PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`).
2. Disable emulated prepared statements to enforce true server-side prepares (`PDO::ATTR_EMULATE_PREPARES => false`).
3. Set default fetch mode to associative arrays (`PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC`).

**Starter Code:**
```php
<?php
$dsn = "mysql:host=localhost;dbname=store;charset=utf8mb4";

// INSECURE: Default connection without defensive attributes
$pdo = new PDO($dsn, 'store_admin', 'password123');
```

**Solution Snippet:**
```php
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$pdo = new PDO($dsn, 'store_admin', 'password123', $options);
```

---

### Exercise 3: Eliminating Charset Injection Vulnerabilities

**Task:**  
Identify the vulnerability in the starter code where character encoding is configured via a secondary query rather than the DSN. Rewrite the connection to set the character set properly, preventing multi-byte SQL injection attacks.

**Starter Code:**
```php
<?php
$dsn = "mysql:host=localhost;dbname=auth_db";
$pdo = new PDO($dsn, 'auth_user', 'secure_pass', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

// VULNERABLE: Executing SET NAMES after connecting can leave 
// emulated prepared statements vulnerable to charset-based SQLi
$pdo->exec("SET NAMES utf8mb4");
```

**Solution Snippet:**
```php
// SECURE: Define charset strictly within the DSN string
$dsn = "mysql:host=localhost;dbname=auth_db;charset=utf8mb4";

$pdo = new PDO($dsn, 'auth_user', 'secure_pass', [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
```

---

## Self-Check Checklist

- Is `charset=utf8mb4` declared directly in the DSN string instead of using a separate `SET NAMES` query?
- Is `PDO::ATTR_EMULATE_PREPARES` set to `false` to ensure native database prepared statements are used?
- Is `PDO::ATTR_ERRMODE` configured to `PDO::ERRMODE_EXCEPTION` to prevent silent query failures?
- Are connection attempts wrapped in a `try-catch` block that suppresses raw exception output to prevent credential and stack trace leakage?
