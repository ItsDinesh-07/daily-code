# JavaScript: Closures and Lexical Scope

Lexical scope determines variable accessibility based on where functions are physically authored in the source code. A closure is formed when an inner function preserves access to its outer (lexical) scope even after the outer function has returned. This mechanism allows functions to maintain persistent, private state without relying on global variables.

```javascript
// Outer function creates a lexical scope
function createBankAccount(accountHolder, initialBalance = 0) {
  // 'balance' and 'accountHolder' are private to this lexical scope
  let balance = initialBalance;

  // Returning an object containing inner functions.
  // Each method forms a closure over 'balance' and 'accountHolder'.
  return {
    deposit(amount) {
      if (amount <= 0) return "Deposit must be greater than 0.";
      balance += amount; // Accesses and updates outer 'balance'
      return `${accountHolder}: Deposited $${amount}. Balance: $${balance}`;
    },

    withdraw(amount) {
      if (amount > balance) return `${accountHolder}: Insufficient funds.`;
      balance -= amount;
      return `${accountHolder}: Withdrew $${amount}. Balance: $${balance}`;
    },

    getBalance() {
      return `${accountHolder}'s current balance is $${balance}.`;
    }
  };
}

// Instantiate two independent accounts
const aliceAccount = createBankAccount("Alice", 100);
const bobAccount = createBankAccount("Bob", 50);

// Each instance maintains its own distinct closure environment
console.log(aliceAccount.deposit(50));  // "Alice: Deposited $50. Balance: $150"
console.log(aliceAccount.withdraw(30)); // "Alice: Withdrew $30. Balance: $120"

// Bob's balance remains untouched by Alice's actions
console.log(bobAccount.getBalance());   // "Bob's current balance is $50."

// Demonstrating encapsulation: 'balance' cannot be accessed directly
console.log(aliceAccount.balance);      // undefined
```

## Key takeaways

* **Lexical Scoping:** Inner functions search upward through their parent scopes to resolve variable identifiers based on where functions are written in the code.
* **Closure Creation:** A closure is created whenever a function is defined; it carries a hidden reference to its enclosing lexical environment.
* **Persistent References:** Variables captured in a closure are not garbage collected as long as the inner function remains reachable.
* **Data Privacy:** Closures enable true encapsulation in JavaScript, allowing you to hide state and only expose controlled access methods.
