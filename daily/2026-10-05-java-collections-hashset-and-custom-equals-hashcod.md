# Java Collections: HashSet and Custom Equals/HashCode

A `HashSet` relies on the `hashCode()` and `equals()` contracts to ensure element uniqueness. When using custom objects, overriding both methods correctly prevents duplicate entries with identical logical values.

```java
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

// A custom class representing a User
class User {
    private final String username;

    public User(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    // hashCode must be overridden based on the fields used in equals
    @Override
    public int hashCode() {
        return Objects.hash(username);
    }

    // equals must be overridden to define logical equality
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return Objects.equals(username, user.username);
    }

    @Override
    public String toString() {
        return "User{username='" + username + "'}";
    }
}

public class HashSetCustomExample {
    public static void main(String[] args) {
        Set<User> users = new HashSet<>();

        // Adding distinct user objects with the same logical value
        users.add(new User("alice"));
        users.add(new User("bob"));
        users.add(new User("alice")); // Duplicate, should be ignored by the set

        // The set size should be 2 because "alice" is considered a duplicate
        System.out.println("Total unique users: " + users.size());
        
        for (User user : users) {
            System.out.println(user);
        }
    }
}
```

## Key takeaways
* **Contract Rule:** If two objects are equal according to `equals()`, they **must** return the same integer result from `hashCode()`.
* **Duplicate Prevention:** `HashSet` uses `hashCode()` to locate the correct bucket and `equals()` to check for exact matches, correctly filtering duplicates.
* **Immutability:** It is best practice to use immutable fields for properties that contribute to `hashCode()` and `equals()` computations inside hashed collections.
