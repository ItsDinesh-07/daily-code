# Java OOP: Polymorphism in Action

Polymorphism allows objects of different concrete classes to be treated as instances of a shared superclass or interface. At runtime, the Java Virtual Machine dynamically determines and invokes the appropriate overridden method based on the actual object's type, decoupling client code from specific implementations.

```java
// Common interface defining a shared contract
interface PaymentMethod {
    void processPayment(double amount);
}

// Concrete implementation 1: Credit Card
class CreditCard implements PaymentMethod {
    private final String lastFourDigits;

    public CreditCard(String cardNumber) {
        this.lastFourDigits = cardNumber.substring(cardNumber.length() - 4);
    }

    @Override
    public void processPayment(double amount) {
        System.out.printf("Charged $%.2f to Credit Card ending in %s%n", amount, lastFourDigits);
    }
}

// Concrete implementation 2: PayPal
class PayPal implements PaymentMethod {
    private final String email;

    public PayPal(String email) {
        this.email = email;
    }

    @Override
    public void processPayment(double amount) {
        System.out.printf("Sent $%.2f via PayPal account: %s%n", amount, email);
    }
}

public class Main {
    public static void main(String[] args) {
        // Polymorphic collection: storing distinct types under one interface type
        PaymentMethod[] methods = {
            new CreditCard("1234567890123456"),
            new PayPal("user@example.com")
        };

        // Dynamic dispatch: the JVM executes the subclass implementation at runtime
        for (PaymentMethod method : methods) {
            checkout(method, 49.99);
        }
    }

    // Accepts the interface type, making the method extensible to new payment types
    public static void checkout(PaymentMethod paymentMethod, double amount) {
        paymentMethod.processPayment(amount);
    }
}
```

## Key takeaways

* **Interface as a Contract:** Subclasses or implementing classes fulfill a shared interface, guaranteeing the availability of defined methods.
* **Dynamic Method Dispatch:** Java resolves method calls at runtime based on the actual object instance, not the reference variable's declared type.
* **Open/Closed Principle:** New payment methods can be added without modifying the `checkout` method or client code, improving maintainability.
