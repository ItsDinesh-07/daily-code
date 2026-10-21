# Practice Exercises: JavaScript: ES6 Modules and Exports

Practice using ES6 module syntax to organize code, manage named and default exports, and import modules using destructuring, aliases, and aggregation.

---

### Exercise 1: Named Exports and Aliasing

**Task:**  
In `mathUtils.js`, export two functions using named exports: `add(a, b)` and `multiply(a, b)`. In `app.js`, import both functions, but alias `multiply` as `mult`. Execute both functions and log the results.

**Starter Code:**
```javascript
// mathUtils.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// TODO: Export both functions as named exports

// app.js
// TODO: Import 'add' and import 'multiply' as 'mult'

console.log(add(2, 3));
console.log(mult(4, 5));
```

**Expected Solution Snippet:**
```javascript
// mathUtils.js
export { add, multiply };

// app.js
import { add, multiply as mult } from './mathUtils.js';

console.log(add(2, 3));  // Output: 5
console.log(mult(4, 5)); // Output: 20
```

---

### Exercise 2: Combining Default and Named Exports

**Task:**  
Create a module `User.js` that has a default export (`User` class) and a named export (`USER_ROLES` object). Then, in `main.js`, import both the default class and the named object in a single `import` statement and instantiate a new admin user.

**Starter Code:**
```javascript
// User.js
const USER_ROLES = {
  ADMIN: 'admin',
  GUEST: 'guest'
};

class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
}

// TODO: Export USER_ROLES as a named export and User as the default export

// main.js
// TODO: Import User and USER_ROLES in one line

const admin = new User('Alice', USER_ROLES.ADMIN);
console.log(admin);
```

**Expected Solution Snippet:**
```javascript
// User.js
export { USER_ROLES };
export default User;

// main.js
import User, { USER_ROLES } from './User.js';

const admin = new User('Alice', USER_ROLES.ADMIN);
console.log(admin); // Output: User { name: 'Alice', role: 'admin' }
```

---

### Exercise 3: Aggregating Modules (Barrel Export Pattern)

**Task:**  
You have two utility modules: `stringUtils.js` and `numberUtils.js`. Create an `index.js` file that acts as a "barrel" by re-exporting all functions from both modules in one place, so a consumer can import them from `./index.js` directly.

**Starter Code:**
```javascript
// stringUtils.js
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// numberUtils.js
export const isEven = (num) => num % 2 === 0;

// index.js
// TODO: Re-export all members from stringUtils.js and numberUtils.js

// consumer.js
import { capitalize, isEven } from './index.js';

console.log(capitalize('hello'));
console.log(isEven(4));
```

**Expected Solution Snippet:**
```javascript
// index.js
export * from './stringUtils.js';
export * from './numberUtils.js';

// consumer.js
// Output:
// 'Hello'
// true
```

---

## Self-Check Checklist

- Did you use curly braces `{}` exclusively for named imports and omit them for default imports?
- Did you use the `as` keyword correctly when aliasing imports or exports?
- Did you combine default and named exports into a single statement using the `import DefaultName, { NamedItem } from 'path'` pattern?
- Did you use `export * from './path.js'` without an intermediate `import` step when re-exporting modules?
