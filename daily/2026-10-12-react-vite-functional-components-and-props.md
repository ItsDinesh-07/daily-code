# React Functional Components and Props

This example demonstrates how to create a reusable React component and pass data into it using props. It uses a parent component to inject dynamic values into a child component.

```jsx
// Greeting.jsx - A reusable functional component
// Props are passed as an object argument to the function
const Greeting = ({ name, age }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h2>Hello, {name}!</h2>
      <p>You are {age} years old.</p>
    </div>
  );
};

// App.jsx - The parent component
export default function App() {
  return (
    <main>
      <h1>User Dashboard</h1>
      {/* Passing data to the child component via props */}
      <Greeting name="Alice" age={25} />
      <Greeting name="Bob" age={30} />
    </main>
  );
}
```

## Key takeaways
* **Functional Components:** Defined as standard JavaScript functions that return JSX.
* **Props:** Used to pass data from parent components to child components, making them reusable.
* **Destructuring:** Props are received as an object; using `{ propName }` inside the function signature makes code cleaner.
* **Read-only:** Props are immutable; child components should not modify the data they receive.
