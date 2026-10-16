# React Vite: Component Composition and Children Prop

Component composition in React allows you to build generic container components that accept arbitrary children via the built-in `children` prop. This promotes code reuse and flexible UI layouts.

```jsx
import { createRoot } from 'react-dom/client';

// A reusable Card component that accepts a 'children' prop for flexible content
function Card({ title, children }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '8px', maxWidth: '300px' }}>
      <h3>{title}</h3>
      {/* Render whatever is passed inside <Card>...</Card> */}
      <div>{children}</div>
    </div>
  );
}

// App component composing the Card with different internal elements
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>User Dashboard</h2>
      
      {/* Card containing text and a paragraph */}
      <Card title="Profile">
        <p>Name: Jane Doe</p>
        <p>Role: Developer</p>
      </Card>

      {/* Card containing an interactive button */}
      <Card title="Actions">
        <button onClick={() => alert('Clicked!')}>Click Me</button>
      </Card>
    </div>
  );
}

// Mount the app to the DOM (Vite standard entry point)
createRoot(document.getElementById('root')).render(<App />);
```

## Key takeaways
* The `children` prop automatically receives any elements passed between the opening and closing tags of a component.
* Composition makes components like `Card` generic and reusable, as they don't need to hardcode their inner markup.
* It helps avoid "prop drilling" by letting parent components dictate the exact structure of their nested children.
