# Java Encapsulation and Access Modifiers

Encapsulation restricts direct access to an object's internal data, using private fields and public getter/setter methods. This ensures data integrity by allowing controlled access and validation.

```java
public class BankAccount {
    // Private modifier restricts direct access from other classes
    private double balance;

    public BankAccount(double initialBalance) {
        if (initialBalance > 0) {
            this.balance = initialBalance;
        }
    }

    // Public getter allows controlled read access
    public double getBalance() {
        return balance;
    }

    // Public setter allows controlled write access with validation
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    public static void main(String[] args) {
        BankAccount myAccount = new BankAccount(100.0);
        myAccount.deposit(50.0); // Valid update
        System.out.println("Balance: " + myAccount.getBalance());
    }
}
```

## Key takeaways
* **Private modifier:** Hides data from outside classes to prevent unauthorized modifications.
* **Getters and Setters:** Provide a controlled interface to interact with private fields.
* **Data Integrity:** Allows developers to implement validation logic (e.g., checking for negative deposits) before updating state.
