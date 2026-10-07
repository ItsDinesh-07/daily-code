# Spring Boot Constructor Injection

Constructor injection is the recommended way to perform dependency injection in Spring. It ensures that required dependencies are immutable and fully initialized before the bean is used.

```java
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// 1. A service component to be injected
@Service
class GreetingService {
    public String getMessage() { return "Hello from Constructor Injection!"; }
}

// 2. A controller using Constructor Injection
@RestController
class GreetingController {
    // Dependencies should be marked final to ensure immutability
    private final GreetingService greetingService;

    // Spring automatically injects the bean via the constructor
    public GreetingController(GreetingService greetingService) {
        this.greetingService = greetingService;
    }

    @GetMapping("/")
    public String greet() {
        return greetingService.getMessage();
    }
}
```

## Key takeaways
* **Immutability:** Marking fields as `final` ensures dependencies cannot be changed after initialization.
* **Testing:** Constructor injection makes unit testing easier as you can manually pass mock objects into the constructor.
* **No @Autowired required:** In Spring Boot, if a class has only one constructor, the `@Autowired` annotation is optional.
* **Fail-fast:** The application will fail to start if a required dependency is missing, preventing NullPointerExceptions at runtime.
