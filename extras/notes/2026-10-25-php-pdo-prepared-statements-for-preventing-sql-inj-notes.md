# Notes & Interview Tips: PHP PDO: Prepared Statements for Preventing SQL Injection

## Common Pitfalls & Anti-Patterns

1. **Relying on Default Emulated Prepared Statements**
   * *Mistake*: Leaving `PDO::ATTR_EMULATE_PREPARES` set to its default (`true`). PHP performs basic string substitution internally rather than sending a true parameter-separated command to the database engine, which can introduce edge-case injection risks (such as multi-byte character set encoding mismatches).
   * *Fix*: Explicitly set `$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);` upon connection.

2. **Attempting to Parameterize Identifiers (Table/Column Names)**
   * *Mistake*: Using placeholders for dynamic table names, column names, or `ORDER BY` directions (e.g., `SELECT * FROM users ORDER BY ?`). Placeholders only represent literal values (data); the database parser will throw a syntax error or wrap the identifier in quotes, breaking functionality. Developers often fall back to raw string concatenation here.
   * *Fix*: Validate identifiers against an explicit whitelist of allowed values in PHP code before concatenating them into the query.

3. **Mixing Parameterization with String Concatenation**
   * *Mistake*: Preparing a query that already includes concatenated user input (e.g., `$pdo->prepare("SELECT * FROM users WHERE status = 'active' AND name = '" . $_GET['name'] . "'")`).
   * *Fix*: Ensure all variable input is completely replaced by named (`:name`) or positional (`?`) placeholders and supplied strictly via `execute()` or `bindValue()`.

## Key Interview Questions

### 1. How do native prepared statements prevent SQL injection at the database level?
**Answer:** Native prepared statements split query execution into two distinct phases: parsing and execution. First, the query structure (template) is sent to the database via `PREPARE`, where the query execution plan and syntax tree are compiled. Second, the user-supplied parameters are sent separately via `EXECUTE`. Because the database engine has already parsed and finalized the command structure, bound parameters are strictly treated as literal data, making it impossible for input to alter query logic or execute arbitrary SQL commands.

### 2. What is the difference between `bindValue()` and `bindParam()` in PDO?
**Answer:**
* `bindValue()` binds a variable by **value**. The value is resolved immediately at the time the method is invoked.
* `bindParam()` binds a variable by **reference**. The value is resolved only when `PDOStatement::execute()` is called. This is useful for executing the same prepared statement multiple times inside a loop by updating the variable’s value prior to each call.

### 3. Why must the character set be explicitly defined in the DSN when using PDO with MySQL?
**Answer:** If the character set is omitted or configured via `SET NAMES`, the database connection encoding and PHP's client encoding may become desynchronized. In environments utilizing multi-byte encodings (like GBK or BIG5) and emulated prepared statements, attackers can craft payloads using specific trailing bytes (e.g., `0xbf 0x27`) that consume the escaping backslash, generating an unescaped single quote and causing SQL injection. Setting `charset=utf8mb4` directly in the DSN ensures the driver and the database agree on character boundaries.

## Best Practices Summary

* Explicitly disable emulated prepares: `PDO::ATTR_EMULATE_PREPARES => false`.
* Always configure PDO to throw exceptions: `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`.
* Always define the character encoding inside the DSN (e.g., `mysql:host=localhost;dbname=test;charset=utf8mb4`).
* Never use placeholders for identifiers (tables, columns, sorting clauses); use strict PHP-level whitelisting instead.
* Never interpolate or concatenate untrusted input into `$pdo->prepare()`.
* Prefer passing an associative array directly to `execute($params)` for cleaner code unless explicit PDO data types are strictly required via `bindValue()`.
