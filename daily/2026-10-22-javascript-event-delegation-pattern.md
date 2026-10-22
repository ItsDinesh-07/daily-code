# JavaScript: Event Delegation Pattern

Event delegation is a technique where you attach a single event listener to a parent element to manage events for all its current and future child elements. It works by taking advantage of event bubbling.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Event Delegation Example</title>
</head>
<body>

  <!-- Parent container holding multiple child items -->
  <ul id="item-list">
    <li class="item">Item 1</li>
    <li class="item">Item 2</li>
    <li class="item">Item 3</li>
  </ul>

  <script>
    // 1. Select the parent element
    const list = document.getElementById('item-list');

    // 2. Attach a single event listener to the parent
    list.addEventListener('click', (event) => {
      // 3. Check if the clicked element matches the desired child selector
      if (event.target && event.target.matches('li.item')) {
        
        // 4. Handle the event for the specific child
        console.log(`Clicked on: ${event.target.textContent}`);
        event.target.style.backgroundColor = 'yellow';
      }
    });

    // Bonus: Dynamically added items automatically work with this pattern
    const newItem = document.createElement('li');
    newItem.className = 'item';
    newItem.textContent = 'Item 4 (Dynamic)';
    list.appendChild(newItem);
  </script>

</body>
</html>
```

## Key takeaways
* **Memory Efficiency:** Attaches one listener to a parent instead of many listeners to every child.
* **Dynamic Elements:** Automatically handles events for elements added to the DOM after the page loads.
* **Event Bubbling:** Relies on events propagating upward from the target element to the parent container.
* **Target Checking:** Uses `event.target.matches()` to ensure the correct child element was clicked.
