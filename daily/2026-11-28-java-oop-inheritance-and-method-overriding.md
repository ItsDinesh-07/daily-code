# Java Inheritance and Method Overriding

Inheritance allows a subclass to acquire the properties and behaviors of a parent class. Method overriding enables the subclass to provide a specific implementation for a method already defined in its parent class.

```java
// Parent class
class Animal {
    void makeSound() {
        System.out.println("The animal makes a generic sound.");
    }
}

// Child class inheriting from Animal
class Dog extends Animal {
    // Overriding the parent method to provide specific behavior
    @Override
    void makeSound() {
        System.out.println("The dog barks: Woof! Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal myDog = new Dog(); // Polymorphism: Parent reference, child object
        myDog.makeSound();        // Executes the overridden method in Dog
    }
}
```

## Key takeaways
* Use the `@Override` annotation to clearly indicate that a method is intended to replace the parent's implementation.
* The subclass must have the same method signature (name, return type, and parameters) as the parent class to successfully override it.
* Inheritance promotes code reusability, while overriding allows for runtime polymorphism where the object type determines the method execution.
