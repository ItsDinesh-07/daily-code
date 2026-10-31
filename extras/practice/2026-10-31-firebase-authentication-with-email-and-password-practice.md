# Practice Exercises: Firebase: Authentication with Email and Password
Build practical competence in implementing user registration, login state management, and secure credential handling using Firebase Auth.

1. **User Registration Implementation**
   - **Problem Task:** Write an asynchronous function `registerUser(email, password)` using the Firebase Web SDK v9+ modular syntax that creates a new user with an email and password, handling any potential errors.
   - **Starter Code:**
     ```javascript
     import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

     const auth = getAuth();

     async function registerUser(email, password) {
       // TODO: Implement user creation logic
     }
     ```
   - **Expected Output/Solution Snippet:**
     ```javascript
     try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       return userCredential.user;
     } catch (error) {
       console.error("Registration failed:", error.code, error.message);
       throw error;
     }
     ```

2. **User Sign-In and Error Handling**
   - **Problem Task:** Implement a login function `loginUser(email, password)` that authenticates an existing user and catches specific Firebase error codes (e.g., `auth/user-not-found` or `auth/wrong-password`) to return user-friendly error messages.
   - **Starter Code:**
     ```javascript
     import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

     const auth = getAuth();

     async function loginUser(email, password) {
       // TODO: Sign in user and handle specific errors
     }
     ```
   - **Expected Output/Solution Snippet:**
     ```javascript
     try {
       const userCredential = await signInWithEmailAndPassword(auth, email, password);
       return userCredential.user;
     } catch (error) {
       if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
         throw new Error('Invalid email or password.');
       }
       throw new Error('An unexpected error occurred. Please try again.');
     }
     ```

3. **Authentication State Observer**
   - **Problem Task:** Set up a real-time authentication state observer using `onAuthStateChanged` to update a UI element (represented by a `setUserUI` callback function) whenever a user logs in or out.
   - **Starter Code:**
     ```javascript
     import { getAuth, onAuthStateChanged } from "firebase/auth";

     const auth = getAuth();

     function initAuthListener(setUserUI) {
       // TODO: Set up the observer and return the unsubscribe function
     }
     ```
   - **Expected Output/Solution Snippet:**
     ```javascript
     return onAuthStateChanged(auth, (user) => {
       if (user) {
         setUserUI({ isLoggedIn: true, uid: user.uid, email: user.email });
       } else {
         setUserUI({ isLoggedIn: false, uid: null, email: null });
       }
     });
     ```

## Self-Check Checklist
- [ ] Successfully initialized the Firebase Auth instance using modular SDK methods.
- [ ] Handled asynchronous promises correctly using `async/await` and `try/catch` blocks.
- [ ] Implemented error handling targeting specific Firebase error codes (e.g., weak passwords, invalid credentials).
- [ ] Cleanly managed user session state changes using `onAuthStateChanged`.
