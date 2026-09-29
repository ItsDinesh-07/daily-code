# Java OOP: Interfaces and Abstract Classes

Abstract classes provide a partial implementation and share code among closely related classes, while interfaces define a strict contract of behavior that any class can implement regardless of its place in the inheritance hierarchy.

```java
// Abstract class defining shared state and behavior for all vehicles
abstract class Vehicle {
    protected String brand;

    public Vehicle(String brand) {
        this.brand = brand;
    }

    // Concrete method shared by all subclasses
    public void startEngine() {
        System.out.println(brand + " engine is running.");
    }

    // Abstract method that subclasses must implement
    public abstract void drive();
}

// Interface defining a specific capability (behavior contract)
interface Electric {
    void chargeBattery();
}

// Tesla inherits from Vehicle and implements Electric
class Tesla extends Vehicle implements Electric {
    public Tesla(String brand) {
        super(brand);
    }

    @Override
    public void drive() {
        System.out.println(brand + " is driving silently.");
    }

    @Override
    public void chargeBattery() {
        System.out.println(brand + " is charging its battery.");
    }
}

// Main execution class
public class Main {
    public static void main(String[] args) {
        Tesla myTesla = new Tesla("Tesla Model 3");
        myTesla.startEngine();  // Inherited from abstract class
        myTesla.drive();        // Implemented from abstract class
        myTesla.chargeBattery();// Implemented from interface
    }
}
```

## Key takeaways
* Abstract classes (`extends`) model an "is-a" relationship and can hold state (fields) and constructors.
* Interfaces (`implements`) model a "can-do" capability and allow for a form of multiple inheritance in Java.
* Subclasses of an abstract class must provide implementations for all of its abstract methods.
