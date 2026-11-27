# Practice Exercises: CSS Layouts: CSS Grid Auto-Fit and Responsive Layouts

This section focuses on mastering responsive grid containers using `auto-fit` and `minmax()` to create fluid, adaptive layouts without media queries.

### Exercise 1: The Adaptive Photo Gallery
**Task:** Create a grid container that automatically places as many 250px-wide images as possible in a row, expanding them to fill available space if they don't fit perfectly.

**Starter Code:**
```css
.gallery {
  display: grid;
  gap: 1rem;
  /* Add your grid-template-columns property here */
}
```

**Expected Solution:**
```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

### Exercise 2: Responsive Card Deck
**Task:** Ensure a list of cards maintains a minimum width of 300px but prevents them from shrinking smaller than that, regardless of screen size. Use `auto-fill` to maintain the track count even if empty cells are created.

**Starter Code:**
```css
.card-deck {
  display: grid;
  gap: 20px;
  /* Add your grid-template-columns property here */
}
```

**Expected Solution:**
```css
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
```

### Exercise 3: Controlled Maximum Width
**Task:** Create a layout where items are at least 200px wide, but should never grow larger than 1fr (to prevent single items from stretching across a massive screen).

**Starter Code:**
```css
.container {
  display: grid;
  gap: 10px;
  /* Use minmax to set a minimum of 200px and a maximum of 1fr */
}
```

**Expected Solution:**
```css
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

## Self-Check Checklist
* [ ] Did I use `repeat()` to define the grid columns effectively?
* [ ] Can I distinguish between `auto-fit` (collapsing empty tracks) and `auto-fill` (preserving empty tracks)?
* [ ] Does the `minmax()` function handle the minimum constraint without breaking on smaller viewports?
* [ ] Have I tested the layout by manually resizing the browser window to trigger the reflow?
