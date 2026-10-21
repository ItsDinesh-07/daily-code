# JavaScript: ES6 Modules and Exports

ES6 modules provide a standardized, file-level scoping mechanism for organizing and sharing JavaScript code across files. Developers use `export` to expose functions, objects, or primitives as named or default bindings, and `import` to consume them in other files.

```javascript
// A self-contained, runnable example demonstrating ES6 export and import syntax.
// Data URLs allow inline execution of standard module syntax in modern Node.js and browsers.

const moduleSource = `
  // 1. Named exports: multiple values per module
  export const TAX_RATE = 0.07;

  export function calculateTotal(subtotal) {
    return subtotal + (subtotal * TAX_RATE);
  }

  // 2. Default export: the primary function or entity of the module
  export default function formatReceipt(customer, total) {
    return \`Receipt for \${customer}: $\${total.toFixed(2)}\`;
  }
`;

// Dynamically import the module via a Data URL
async function run() {
  const moduleUrl = `data:text/javascript,${encodeURIComponent(moduleSource)}`;

  // Equivalent to: import formatReceipt, { TAX_RATE, calculateTotal } from './receipt.js';
  const { 
    default: formatReceipt, 
    TAX_RATE, 
    calculateTotal 
  } = await import(moduleUrl);

  const subtotal = 100;
  const total = calculateTotal(subtotal);

  console.log(`Current Tax Rate: ${TAX_RATE * 100}%`);
  console.log(formatReceipt("Ada Lovelace", total));
}

run();
```

## Key takeaways

- **Named Exports**: A module can export multiple variables or functions by prepending `export` or using `export { name1, name2 }`; consumers import them using matching names enclosed in curly braces.
- **Default Exports**: Each module can designate at most one `export default`, which consumers can import under any arbitrary alias without curly braces.
- **Strict & Scoped**: Modules execute in strict mode by default (`"use strict"`), and variables declared at the top level stay scoped to the module rather than leaking into the global namespace.
- **Static vs. Dynamic**: Static `import ... from ...` statements are evaluated at parse-time and must sit at the top level, while `import()` functions dynamically load modules asynchronously at runtime.
