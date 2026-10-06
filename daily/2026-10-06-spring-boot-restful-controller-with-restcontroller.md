# Spring Boot REST Controller Example

This example demonstrates a minimal Spring Boot controller that handles HTTP GET requests, returning a JSON response. It utilizes the `@RestController` annotation to automatically serialize returned objects to the response body.

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// @RestController marks this class as a handler for web requests
@RestController
public class GreetingController {

    // Maps HTTP GET requests for /hello to this method
    @GetMapping("/hello")
    public String sayHello() {
        // Returning a String directly results in a plain text response
        return "Hello, Spring Boot!";
    }

    // Returning a POJO/Map will be automatically serialized as JSON
    @GetMapping("/status")
    public Message getStatus() {
        return new Message("active", 200);
    }

    // Helper record for automatic JSON serialization
    public record Message(String status, int code) {}
}
```

## Key takeaways
* `@RestController` combines `@Controller` and `@ResponseBody`, ensuring method return values are written directly to the HTTP response.
* `@GetMapping` is a specialized shortcut for `@RequestMapping(method = RequestMethod.GET)`.
* Spring Boot uses the Jackson library by default to convert Java objects (like the `Message` record) into JSON format.
