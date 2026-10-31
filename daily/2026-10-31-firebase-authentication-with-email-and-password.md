# Firebase Email and Password Authentication

This example demonstrates how to initialize Firebase, sign up a new user with an email and password, and handle user login using the modern Firebase modular Web SDK (v9+).

```javascript
// Import the necessary Firebase Authentication functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration (replace with your actual project config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase and Auth services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Register a new user with email and password.
 */
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered successfully:", userCredential.user.uid);
  } catch (error) {
    console.error("Registration error:", error.code, error.message);
  }
}

/**
 * Sign in an existing user with email and password.
 */
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully:", userCredential.user.uid);
  } catch (error) {
    console.error("Login error:", error.code, error.message);
  }
}

// Example usage:
// registerUser("user@example.com", "securePassword123");
// loginUser("user@example.com", "securePassword123");
```

## Key takeaways
* Use `initializeApp` and `getAuth` to configure and instantiate the Firebase Authentication service.
* `createUserWithEmailAndPassword` handles new user registration securely out of the box.
* `signInWithEmailAndPassword` authenticates existing users and returns their credentials upon success.
* Always wrap authentication calls in `try...catch` blocks to gracefully handle network errors or invalid credentials.
