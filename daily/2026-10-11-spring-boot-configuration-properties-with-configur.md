# Type-Safe Configuration with Spring Boot @ConfigurationProperties

`@ConfigurationProperties` maps external properties (from `application.properties`, environment variables, etc.) directly to strongly typed Java objects. It replaces scattered `@Value` annotations with a centralized, reusable class that supports nested objects and relaxed binding.

```java
package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
// Register the properties class as a Spring-managed bean
@EnableConfigurationProperties(ServerProperties.class)
public class Application {

    public static void main(String[] args) {
        // Set sample properties programmatically for self-contained execution
        System.setProperty("server.config.host-name", "api.example.com");
        System.setProperty("server.config.port", "8443");
        System.setProperty("server.config.security.tls-enabled", "true");

        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner runner(ServerProperties props) {
        return args -> {
            System.out.println("Host: " + props.getHostName());
            System.out.println("Port: " + props.getPort());
            System.out.println("TLS:  " + props.getSecurity().isTlsEnabled());
        };
    }
}

// Binds all properties starting with "server.config"
@ConfigurationProperties(prefix = "server.config")
class ServerProperties {
    // Relaxed binding matches "host-name", "host_name", or "hostName"
    private String hostName;
    private int port = 8080; // Default value if not specified
    private final Security security = new Security(); // Nested group

    public String getHostName() { return hostName; }
    public void setHostName(String hostName) { this.hostName = hostName; }
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    public Security getSecurity() { return security; }

    public static class Security {
        private boolean tlsEnabled;
        public boolean isTlsEnabled() { return tlsEnabled; }
        public void setTlsEnabled(boolean tlsEnabled) { this.tlsEnabled = tlsEnabled; }
    }
}
```

## Key takeaways

* **Prefix-Based Grouping**: The `prefix` attribute binds hierarchical configurations (e.g., `server.config.*`) directly to matching class fields.
* **Relaxed Binding**: Spring Boot automatically resolves case variations, mapping kebab-case (`host-name`), snake_case (`host_name`), and camelCase (`hostName`) to the same field.
* **Registration**: Classes annotated with `@ConfigurationProperties` must be registered using `@EnableConfigurationProperties(Target.class)`, `@ConfigurationPropertiesScan`, or `@Component`.
* **Nested Structures**: Hierarchical properties map naturally to nested static classes, keeping complex configurations organized and type-safe.
