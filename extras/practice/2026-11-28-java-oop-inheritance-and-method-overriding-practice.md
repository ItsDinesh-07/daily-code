# Practice Exercises: Java OOP: Inheritance and Method Overriding

This section focuses on applying inheritance hierarchies and overriding base class behavior to demonstrate polymorphic principles in Java.

### Exercise 1: Basic Inheritance and Overriding
**Task:** Create a class `Animal` with a method `makeSound()`. Create a subclass `Dog` that extends `Animal` and overrides `makeSound()` to print "Bark". In your `Main` class, instantiate a `Dog` object and call the method.

**Starter Code:**
```java
class Animal {
    public void makeSound() { System.out.println("Generic animal sound"); }
}
// Implement Dog class here
```
**Expected Output:**
`Bark`

### Exercise 2: Using 'super' Keyword
**Task:** Create a `Vehicle` class with a field `speed`. Create a `Car` subclass that adds a `model` field. Override a method `displayInfo()` in `Car` to print the model name, but use `super.displayInfo()` to print the speed defined in the parent class.

**Starter Code:**
```java
class Vehicle {
    int speed = 100;
    void displayInfo() { System.out.println("Speed: " + speed); }
}
// Implement Car class here
```
**Expected Output:**
```text
Model: Sedan
Speed: 100
```

### Exercise 3: Polymorphism with Method Overriding
**Task:** Define a base class `Employee` with a method `calculateBonus()`. Create two subclasses, `Manager` and `Developer`. Override `calculateBonus()` in both to return different values. Iterate through an array of `Employee` objects and print the result of `calculateBonus()` for each.

**Starter Code:**
```java
class Employee {
    double calculateBonus() { return 0.0; }
}
// Create Manager and Developer classes, then test in Main
```
**Expected Output:**
```text
Manager Bonus: 5000.0
Developer Bonus: 2000.0
```

## Self-Check Checklist
* [ ] Did you use the `@Override` annotation on your overridden methods to catch potential errors?
* [ ] Can you explain why the program calls the subclass method instead of the parent method at runtime?
* [ ] Did you ensure that the access modifiers in the subclass are not more restrictive than those in the superclass?
* [ ] Have you successfully used `super` to access the parent class's fields or methods?
