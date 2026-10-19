# JavaScript: Array Methods (map, filter, reduce) Deep Dive

This example demonstrates how to transform, filter, and aggregate array data using JavaScript's core functional array methods in a concise, readable pipeline.

```javascript
// Sample dataset: Products in a shopping cart
const cart = [
  { name: 'Laptop', price: 1200, category: 'electronics', inStock: true },
  { name: 'Mouse', price: 25, category: 'electronics', inStock: true },
  { name: 'Desk', price: 300, category: 'furniture', inStock: false },
  { name: 'Keyboard', price: 75, category: 'electronics', inStock: true }
];

// 1. FILTER: Keep only in-stock electronics
const availableElectronics = cart.filter(item => 
  item.category === 'electronics' && item.inStock
);

// 2. MAP: Transform the filtered items into a list of formatted strings
const productDescriptions = availableElectronics.map(item => 
  `${item.name}: $${item.price.toFixed(2)}`
);

// 3. REDUCE: Calculate the total cost of all available electronics
const totalPrice = availableElectronics.reduce((sum, item) => 
  sum + item.price, 0 // Initial accumulator value starts at 0
);

// Output the results
console.log('Available Electronics:', productDescriptions);
console.log(`Total Cost: $${totalPrice}`);
```

## Key takeaways
- `filter()` creates a new array with all elements that pass the test implemented by the provided function, without mutating the original array.
- `map()` creates a new array populated with the results of calling a provided function on every element in the calling array.
- `reduce()` executes a user-supplied "reducer" callback function on each element of the array, passing in the return value from the calculation on the preceding element to derive a single final value.
- These methods can be chained together sequentially for clean, declarative, and readable data manipulation pipelines.
