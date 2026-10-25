# Practice Exercises: PHP PDO: Prepared Statements for Preventing SQL Injection

This section provides practical scenarios to reinforce your ability to secure database interactions by replacing raw SQL queries with PDO prepared statements.

### Exercise 1: Refactoring a Vulnerable Query
**Task:** Refactor the following vulnerable code snippet to use a prepared statement to fetch a user by their email address safely.

*Starter Code:*
```php
$email = $_GET['email'];
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $pdo->query($sql);
```

*Solution Snippet:*
```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute(['email' => $_GET['email']]);
$user = $stmt->fetch();
```

### Exercise 2: Implementing a Secure Data Insertion
**Task:** Write a script that inserts a new comment into a `comments` table using `bindParam()` to ensure the `username` and `message` variables are sanitized.

*Scenario:*
`$username = "Alice";`
`$comment = "Hello, this is a secure comment!";`

*Solution Snippet:*
```php
$stmt = $pdo->prepare("INSERT INTO comments (username, message) VALUES (?, ?)");
$stmt->bindParam(1, $username);
$stmt->bindParam(2, $comment);
$stmt->execute();
```

### Exercise 3: Handling Multiple Filters
**Task:** Securely fetch products from a database where the `category` matches a user input and the `price` is less than a specified value.

*Starter Code:*
```php
$category = 'electronics';
$max_price = 500;
// Write the prepared statement below
```

*Solution Snippet:*
```php
$stmt = $pdo->prepare("SELECT * FROM products WHERE category = ? AND price < ?");
$stmt->execute([$category, $max_price]);
$products = $stmt->fetchAll();
```

## Self-Check Checklist
*   Did you use placeholders (`?` or `:name`) instead of concatenating variables directly into the SQL string?
*   Are you calling `execute()` with an array of parameters rather than executing the raw string?
*   Have you verified that user input is never placed inside the `prepare()` method itself?
*   Are you using `fetch()` or `fetchAll()` after the execution to retrieve your data securely?
