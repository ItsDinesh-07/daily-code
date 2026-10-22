# Practice Exercises: JavaScript: Event Delegation Pattern

Master the event delegation pattern by writing centralized event listeners that efficiently manage dynamic DOM nodes and nested target elements.

---

### Exercise 1: Dynamic List Item Toggling

**Task:** Attach a single click event listener to `#todo-list`. When any existing or dynamically appended `.todo-item` is clicked, toggle the `completed` class on that specific item. Clicks directly on the `<ul>` background must be ignored.

**Starter Code:**
```html
<ul id="todo-list">
  <li class="todo-item">Write unit tests</li>
  <li class="todo-item">Refactor handlers</li>
</ul>
```

```javascript
const todoList = document.querySelector('#todo-list');

// TODO: Implement event delegation on todoList
```

**Solution Snippet:**
```javascript
todoList.addEventListener('click', (event) => {
  const item = event.target.closest('.todo-item');
  if (item && todoList.contains(item)) {
    item.classList.toggle('completed');
  }
});
```

---

### Exercise 2: Handling Nested Children inside Delegated Targets

**Task:** The table `#data-table` contains rows with action buttons that contain nested icon elements. Using a single listener on `#data-table`, ensure clicking anywhere inside the button (including the `<span>` icon) removes the entire parent `<tr>` row.

**Starter Code:**
```html
<table id="data-table">
  <tbody>
    <tr>
      <td>User 1</td>
      <td>
        <button class="btn-delete" type="button">
          <span class="icon">🗑️</span> Remove
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

```javascript
const table = document.querySelector('#data-table');

// TODO: Handle row removal when clicking anywhere on or inside .btn-delete
```

**Solution Snippet:**
```javascript
table.addEventListener('click', (event) => {
  const deleteBtn = event.target.closest('.btn-delete');
  if (deleteBtn && table.contains(deleteBtn)) {
    const row = deleteBtn.closest('tr');
    if (row) row.remove();
  }
});
```

---

### Exercise 3: Action Dispatching via `data-*` Attributes

**Task:** Implement an action bar on `#toolbar` where a single listener routes actions based on a `data-action` attribute. Run the corresponding method from the `actions` map and log the returned output.

**Starter Code:**
```html
<div id="toolbar">
  <button data-action="save">Save</button>
  <button data-action="edit">Edit</button>
  <button data-action="delete">Delete</button>
  <span>Unrelated text</span>
</div>
```

```javascript
const actions = {
  save: () => 'Document saved.',
  edit: () => 'Editing enabled.',
  delete: () => 'Document deleted.'
};

const toolbar = document.querySelector('#toolbar');

// TODO: Read data-action from clicked target and execute corresponding function
```

**Solution Snippet:**
```javascript
toolbar.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button || !toolbar.contains(button)) return;

  const action = button.dataset.action;
  if (actions[action]) {
    console.log(actions[action]());
  }
});
```

---

## Self-Check Checklist

* Did you use `event.target.closest(selector)` instead of `event.target` alone to safely handle clicks on nested child elements?
* Did you verify that the matched element is contained within the parent listener node (`parent.contains(match)`) to prevent escaping the component boundary?
* Did you avoid attaching individual listeners inside loops or every time new elements are created?
* Does your implementation gracefully ignore clicks that hit the parent container outside of the intended target elements?
