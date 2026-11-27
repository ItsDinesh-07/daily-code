# CSS Grid Auto-Fit Responsive Layout

This layout uses `repeat(auto-fit, minmax(...))` to create a responsive grid that automatically adjusts the number of columns based on container width without media queries.

```html
<!DOCTYPE html>
<style>
  .grid-container {
    display: grid;
    /* auto-fit: fills row with as many columns as fit */
    /* minmax(200px, 1fr): min width 200px, expands to fill space */
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
  .card {
    background: #3498db;
    color: white;
    padding: 2rem;
    text-align: center;
  }
</style>

<div class="grid-container">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
  <div class="card">Item 4</div>
</div>
```

## Key takeaways

* `auto-fit` instructs the grid to wrap items automatically when space runs out.
* `minmax(200px, 1fr)` ensures items are at least 200px wide, but grow to share remaining space equally.
* This approach eliminates the need for manual `@media` breakpoints for simple grid layouts.
