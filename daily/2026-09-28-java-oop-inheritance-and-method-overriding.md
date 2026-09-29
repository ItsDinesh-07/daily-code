# Java OOP: Inheritance and Method Overriding

Inheritance allows a class to acquire the properties and behaviors of another class. Method overriding enables a subclass to provide a specific implementation for a method already defined in its parent class.

```java
// Parent class
class Animal {
    void makeSound() {
        System.out.println("The animal makes a generic sound");
    }
}

// Subclass inheriting from Animal
class Dog extends Animal {
    // Overriding the parent method to provide specific behavior
    @Override
    void makeSound() {
        System.out.println("The dog barks");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal myDog = new Dog(); // Polymorphism: Animal reference, Dog object
        myDog.makeSound();        // Executes the overridden method in Dog
    }
}
```

## Key takeaways
* Use the `extends` keyword to establish an inheritance relationship.
* Use the `@Override` annotation to clearly indicate that a method is intended to replace the parent's implementation.
* Overriding allows for polymorphic behavior, where the method executed depends on the actual object type, not the reference type.
