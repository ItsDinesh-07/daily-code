# Practice Exercises: React (Vite): Component Composition and Children Prop

Master the art of building flexible, reusable UI by wrapping components and leveraging the `children` prop to avoid prop-drilling and rigid component structures.

### Exercise 1: The Generic Card Wrapper
**Task:** Create a reusable `Card` component that applies a border and padding to any content passed into it using the `children` prop.

**Starter Code:**
```jsx
// Card.jsx
export const Card = ({ children }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      {/* Render children here */}
    </div>
  );
};

// App.jsx
function App() {
  return (
    <Card>
      <h1>Product Title</h1>
      <p>This is a description inside a card.</p>
    </Card>
  );
}
```

**Expected Solution Snippet:**
Inside `Card.jsx`, the component should return:
```jsx
<div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
  {children}
</div>
```

---

### Exercise 2: Composition over Configuration
**Task:** Instead of creating a `Modal` component that takes a `text` prop, refactor it to use composition so it can accept images, buttons, or multiple paragraphs.

**Scenario:**
Refactor this rigid component:
`const Modal = ({ title, text }) => { ... }` 

To a composable version used like this:
```jsx
<Modal title="Success!">
  <img src="check.png" alt="success" />
  <p>Your changes have been saved.</p>
  <button>Close</button>
</Modal>
```

**Expected Solution Snippet:**
```jsx
const Modal = ({ title, children }) => (
  <div className="modal-backdrop">
    <div className="modal-content">
      <h2>{title}</h2>
      {children}
    </div>
  </div>
);
```

---

### Exercise 3: Layout Composition
**Task:** Create a `PageLayout` component that wraps the main content of your app with a standard `Navbar` and `Footer`, while allowing the specific page content to be injected dynamically.

**Starter Code:**
```jsx
const Navbar = () => <nav>My App Header</nav>;
const Footer = () => <footer>© 2023</footer>;

const PageLayout = ({ children }) => {
  // Task: Assemble the Navbar, children, and Footer
};

// Usage:
// <PageLayout><HomePage /></PageLayout>
```

**Expected Solution Snippet:**
```jsx
const PageLayout = ({ children }) => (
  <div className="app-container">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);
```

## Self-Check Checklist
*   Do I understand that `children` is a reserved prop name in React that automatically captures nested JSX?
*   Can I identify scenarios where using composition (children) is cleaner than passing multiple complex props?
*   Do I know how to pass additional props (like `title` or `theme`) alongside the `children` prop?
*   Can I nest multiple composed components within one another without breaking the layout?
