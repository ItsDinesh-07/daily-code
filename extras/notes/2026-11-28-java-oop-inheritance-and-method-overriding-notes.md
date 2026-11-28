# Notes & Interview Tips: Java OOP: Inheritance and Method Overriding

## Common Pitfalls & Anti-Patterns

1. **The "Fragile Base Class" Problem:** Over-relying on deep inheritance hierarchies makes code difficult to maintain, as changes to a base class ripple unpredictably. **Avoid:** Favor composition over inheritance; use inheritance only for "is-a" relationships, not for code reuse.
2. **Violating Liskov Substitution Principle (LSP):** Overriding a method to do something completely different from the base class (e.g., throwing an `UnsupportedOperationException`). **Avoid:** Ensure that objects of a subclass can replace objects of a superclass without altering the correctness of the program.
3. **Overusing `protected` access:** Exposing internal state to subclasses creates tight coupling. **Avoid:** Keep fields `private` and provide `protected` or `public` getters/setters to maintain encapsulation.

## Key Interview Questions

1. **What is the difference between Method Overloading and Method Overriding?**
   * **Answer:** Overloading occurs within the same class with the same method name but different parameter lists (compile-time polymorphism). Overriding occurs in a subclass with the same signature as a superclass method to provide a specific implementation (runtime polymorphism).
2. **Can you override a `static` method in Java?**
   * **Answer:** No. Static methods are bound at compile-time (method hiding). If you define a static method in a subclass with the same signature as one in the superclass, you are "hiding" the parent method, not overriding it. It cannot be polymorphic.
3. **What is the purpose of the `@Override` annotation?**
   * **Answer:** It is a compiler directive that ensures the method is actually overriding a superclass method. If the signature doesn't match exactly, the compiler throws an error, preventing subtle bugs caused by typos or signature mismatches.

## Best Practices Summary

* **Use `@Override` consistently:** Always annotate overridden methods to catch signature mismatches at compile time.
* **Keep the base class closed for modification:** Follow the Open/Closed Principle; prefer extending classes for features rather than changing existing core logic.
* **Use `final` wisely:** Mark classes as `final` if they are not intended to be extended, and mark specific methods as `final` to prevent overriding of sensitive logic.
* **Respect visibility:** Do not lower the visibility (e.g., changing `public` to `private`) of an overridden method in a subclass.
* **Favor interfaces:** Use interfaces for defining contracts and abstract classes for shared behavior to keep designs flexible.
