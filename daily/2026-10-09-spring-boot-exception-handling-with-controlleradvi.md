# Spring Boot @ControllerAdvice Exception Handling

This example demonstrates how to use `@ControllerAdvice` to intercept exceptions across all controllers, providing a centralized and consistent error response format for your API.

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

// Define a custom error response structure
record ErrorResponse(int status, String message) {}

// Global exception handler class
@ControllerAdvice
public class GlobalExceptionHandler {

    // Catch specific exceptions and return a structured JSON response
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(), 
            ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Catch all other unhandled exceptions to prevent stack trace leaks
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(), 
            "An unexpected error occurred."
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

## Key takeaways
*   **Decoupling:** `@ControllerAdvice` keeps your controller logic clean by removing repetitive `try-catch` blocks.
*   **Consistency:** It ensures that all errors returned by your API follow the same JSON schema.
*   **Global Scope:** Annotating a class with `@ControllerAdvice` allows it to handle exceptions thrown by any `@Controller` or `@RestController` in the application.
