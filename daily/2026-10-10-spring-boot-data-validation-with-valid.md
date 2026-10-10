# Spring Boot Data Validation with @Valid

Spring Boot integrates with the Jakarta Validation API to validate request payloads automatically before controller execution. By placing constraint annotations on DTO fields and using `@Valid` on the handler method parameter, invalid requests are rejected with a `400 Bad Request` error before reaching business logic.

```java
package com.example.validation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
@RequestMapping("/users")
public class ValidationApplication {

    // 1. Define validation rules directly on the DTO using Jakarta annotations
    public record CreateUserRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid email address")
        String email,

        @Min(value = 18, message = "Age must be at least 18")
        int age
    ) {}

    // 2. Add @Valid to trigger validation.
    // If validation fails, Spring automatically aborts and returns HTTP 400.
    @PostMapping
    public ResponseEntity<String> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok("User '%s' registered successfully!".formatted(request.name()));
    }

    public static void main(String[] args) {
        SpringApplication.run(ValidationApplication.class, args);
    }
}
```

## Key takeaways

* **Dependency**: Requires `spring-boot-starter-validation` in your `pom.xml` or `build.gradle` to provide the underlying Hibernate Validator implementation.
* **DTO Constraints**: Standard annotations like `@NotBlank`, `@Email`, `@Min`, and `@NotNull` declare the validation rules and custom error messages on fields or records.
* **Triggering Validation**: Placing `@Valid` on a controller method parameter instructs Spring MVC to validate the payload during data binding.
* **Failure Handling**: Validation failures throw a `MethodArgumentNotValidException`, resulting in an HTTP 400 Bad Request status that can be intercepted and customized using an `@ExceptionHandler` inside a `@RestControllerAdvice`.
