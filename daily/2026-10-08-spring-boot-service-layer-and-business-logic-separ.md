# Spring Boot Service Layer Pattern

The Service layer acts as a mediator between the Controller and the Data Access layer. It encapsulates business rules, ensuring that controllers remain thin and focused solely on handling HTTP requests.

```java
// UserDto.java
public record UserDto(String name, String email) {}

// UserService.java - The Business Logic Layer
@Service
public class UserService {
    // Service handles validation and complex logic before DB operations
    public String registerUser(UserDto userDto) {
        if (userDto.name() == null || userDto.name().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        // Imagine a repository.save() call here
        return "User " + userDto.name() + " registered successfully.";
    }
}

// UserController.java - The Entry Point
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService; // Dependency Injection

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto) {
        // Controller delegates business logic to the Service
        return ResponseEntity.ok(userService.registerUser(userDto));
    }
}
```

## Key takeaways
* **Separation of Concerns:** Controllers handle transport (HTTP), while Services handle business rules.
* **Testability:** Business logic in a Service can be unit-tested without mocking the entire web stack.
* **Maintainability:** Changes to business rules only happen in the Service layer, not the Controller.
* **Dependency Injection:** Services are loosely coupled to Controllers via constructor injection.
