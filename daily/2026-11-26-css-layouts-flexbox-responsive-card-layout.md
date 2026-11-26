# Flexbox Responsive Card Layout

This example uses CSS Flexbox with `flex-wrap` and `flex-basis` to create a grid of cards that automatically reflows based on the container width. The layout is fully responsive without needing complex media queries.

```html
<!DOCTYPE html>
<style>
  /* Flex container: enables wrap and gap for spacing */
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
  }

  /* Flex items: flex-basis ensures cards grow/shrink to fill space */
  .card {
    flex: 1 1 250px; /* Grow, Shrink, Base width of 250px */
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background: #f9f9f9;
  }
</style>

<div class="container">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
</div>
```

## Key takeaways

* `display: flex` combined with `flex-wrap: wrap` allows items to move to the next line when space runs out.
* The `flex` shorthand `1 1 250px` allows cards to be flexible while setting a minimum comfortable width of 250px.
* The `gap` property provides clean, consistent spacing between items without needing margin-right/bottom hacks.
* This approach is mobile-first and requires zero media queries to handle different screen sizes.
