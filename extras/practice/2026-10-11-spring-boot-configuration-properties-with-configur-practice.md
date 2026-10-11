# Practice Exercises: Type-Safe Configuration with Spring Boot @ConfigurationProperties

Master externalized configuration binding, nested object mapping, and startup-time validation using immutable, type-safe Spring Boot properties.

---

### Exercise 1: Immutable Record Binding with Custom Prefix

**Problem Task:**  
Create an immutable configuration record bound to the prefix `storage.s3` that maps the endpoint URL, bucket name, and max upload size in megabytes. Ensure the class is registered for configuration processing.

**Starter Scenario:**  
`application.properties`:
```properties
storage.s3.endpoint-url=https://s3.amazonaws.com
storage.s3.bucket-name=my-app-uploads
storage.s3.max-file-size-mb=25
```

**Solution Snippet:**
```java
@ConfigurationProperties(prefix = "storage.s3")
public record StorageProperties(
    String endpointUrl,
    String bucketName,
    int maxFileSizeMb
) {}

// Registration via configuration or main application class:
@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

---

### Exercise 2: Mapping Nested Structures and Collections

**Problem Task:**  
Define the configuration structure for a cluster service that contains a top-level timeout (`Duration`) and a list of nested server nodes, each containing a `host` and a `port`.

**Starter Scenario:**  
`application.yml`:
```yaml
cluster:
  connect-timeout: 5s
  nodes:
    - host: node1.internal
      port: 8080
    - host: node2.internal
      port: 8081
```

**Solution Snippet:**
```java
import java.time.Duration;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "cluster")
public record ClusterProperties(
    Duration connectTimeout,
    List<Node> nodes
) {
    public record Node(String host, int port) {}
}
```

---

### Exercise 3: Fail-Fast Startup Validation

**Problem Task:**  
Add Jakarta Bean Validation constraints to a database connection properties class so the application fails to start if `poolName` is blank or `maxConnections` is less than 1. Verify the expected failure behavior.

**Starter Code:**
```java
@ConfigurationProperties(prefix = "db")
public class DatabaseProperties {
    private String poolName;
    private int maxConnections;
    // Getters and setters omitted
}
```

**Solution Snippet:**
```java
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "db")
public class DatabaseProperties {

    @NotBlank(message = "Pool name must not be blank")
    private String poolName;

    @Min(value = 1, message = "Max connections must be at least 1")
    private int maxConnections;

    public String getPoolName() { return poolName; }
    public void setPoolName(String poolName) { this.poolName = poolName; }
    public int getMaxConnections() { return maxConnections; }
    public void setMaxConnections(int maxConnections) { this.maxConnections = maxConnections; }
}
```
**Expected Behavior on Failure:**  
Providing `db.max-connections=0` causes startup failure throwing `ConfigurationPropertiesBindException` wrapping a `BindValidationException`.

---

## Self-Check Checklist

- [ ] Used relaxed binding conventions (e.g., kebab-case in properties like `max-file-size-mb` maps to camelCase `maxFileSizeMb`).
- [ ] Annotated with `@Validated` and applied Jakarta Validation constraints (`@NotNull`, `@Min`, etc.) for startup-time validation.
- [ ] Correctly registered the properties class using `@EnableConfigurationProperties` or `@ConfigurationPropertiesScan`.
- [ ] Utilized Java `record` types or immutable classes with constructor binding for thread-safe configuration.
