var controlsSection = document.querySelector('.controls');

window.toggleTodoCard = async function () {
  var todo_card = document.getElementById('todo_card');
  if (!todo_card) return;

  todo_card.classList.toggle('open');

  if (todo_card.classList.contains('open')) {
    todo_card.style.display = 'flex';
    const todo_input = document.getElementById('todo_input');
    if (todo_input) todo_input.focus();
    renderTodos();
  } else {
    todo_card.style.display = 'none';
  }
};

const STORAGE_KEY = 'todoplugin_data';

function getTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  const todo_grid = document.getElementById('todo_grid');
  const todos = getTodos();
  todo_grid.innerHTML = '';

  if (todos.length === 0) {
    todo_grid.innerHTML = '<p class="empty-text">No todos yet.</p>';
    return;
  }

  todos.forEach((todo, idx) => {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';

    // Add done class only for styling the label text, not the whole container
    if (todo.done) todoItem.classList.add('done');

    const label = document.createElement('label');
    label.className = 'todo-label';
    if (todo.done) label.classList.add('done-label'); // add class only to label text

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.className = 'todo-checkbox';
    checkbox.onchange = () => {
      todos[idx].done = checkbox.checked;
      saveTodos(todos);
      renderTodos();
    };

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(todo.text));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete todo';
    deleteBtn.onclick = () => {
      todos.splice(idx, 1);
      saveTodos(todos);
      renderTodos();
    };

    todoItem.appendChild(label);
    todoItem.appendChild(deleteBtn);

    todo_grid.appendChild(todoItem);
  });
}

function addTodo(text) {
  if (!text.trim()) return;
  const todos = getTodos();
  todos.push({ text: text.trim(), done: false });
  saveTodos(todos);
  renderTodos();
}

if (controlsSection) {
  var newButton = document.createElement("button");
  newButton.className = 'todo-toggle-btn';
  newButton.innerHTML = `<i class="bx bx-list-check"></i>`;
  newButton.title = "Toggle Todo List";
  newButton.onclick = () => { toggleTodoCard(); };
  
  controlsSection.insertBefore(newButton, controlsSection.querySelector('button[onclick="sendMessage()"]'));
  
  document.body.insertAdjacentHTML('beforeend', `
    <div id="todo_card" class="todo-card" style="display:none; flex-direction: column;">
      <div class="todo-header">
        <p class="todo-title">Todo List</p>
        <button onclick="toggleTodoCard()" class="todo-close-btn" aria-label="Close todo list">
          <i class="bx bx-x"></i>
        </button>
      </div>
      <input id="todo_input" type="text" placeholder="Add new todo..." class="todo-input" autocomplete="off" />
      <div id="todo_grid" class="todo-grid"></div>
    </div>

    <style>
      /* Container */
      .todo-card {
        max-width: 360px;
        max-height: 420px;
        position: fixed;
        bottom: 80px; /* offset above chat controls bar */
        right: 20px;
        background: var(--darker-secondary-color, #222);
        box-shadow: 0 4px 12px rgba(0,0,0,0.7);
        padding: 15px 18px;
        border-radius: 12px;
        display: none;
        flex-direction: column;
        color: white;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        transition: opacity 0.25s ease, transform 0.25s ease;
        z-index: 10000;
      }

      .todo-card.open {
        display: flex;
      }

      /* Header */
      .todo-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .todo-title {
        font-weight: 700;
        font-size: 1.3rem;
        margin: 0;
        user-select: none;
      }

      .todo-close-btn {
        background: transparent;
        border: none;
        color: #bbb;
        font-size: 22px;
        cursor: pointer;
        transition: color 0.2s ease;
      }
      .todo-close-btn:hover {
        color: #ff5555;
      }

      /* Input */
      .todo-input {
        width: 100%;
        padding: 10px 14px;
        font-size: 1rem;
        border-radius: 8px;
        border: none;
        background: var(--secondary-color, #333);
        color: white;
        box-sizing: border-box;
        margin-bottom: 15px;
        outline-offset: 2px;
        transition: background 0.2s ease;
      }
      .todo-input::placeholder {
        color: #aaa;
      }
      .todo-input:focus {
        background: var(--primary-color, #555);
      }

      /* Todo grid */
      .todo-grid {
        flex-grow: 1;
        overflow-y: auto;
        background: var(--secondary-color, #333);
        border-radius: 8px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      /* Individual todo item */
      .todo-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 10px;
        background: #444;
        border-radius: 6px;
        user-select: none;
        transition: background 0.2s ease;
      }
      .todo-item:hover {
        background: #555;
      }

      /* Label styling */
      .todo-label {
        display: flex;
        align-items: center;
        flex-grow: 1;
        cursor: pointer;
        gap: 10px;
        font-size: 1rem;
      }

      /* Strike through only the label text, not the whole item */
      .done-label {
        color: #888;
        text-decoration: line-through;
      }

      /* Checkbox and label */
      .todo-checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: var(--primary-color, #0af);
      }

      /* Delete button */
      .todo-delete-btn {
        background: transparent;
        border: none;
        color: #ff6666;
        font-weight: 700;
        font-size: 20px;
        line-height: 1;
        cursor: pointer;
        padding: 0 6px;
        transition: color 0.2s ease;
        user-select: none;
      }
      .todo-delete-btn:hover {
        color: #ff0000;
      }

      /* Empty message */
      .empty-text {
        color: #888;
        font-style: italic;
        text-align: center;
        margin-top: 40px;
        user-select: none;
      }
    </style>
  `);

  const todoInput = document.getElementById('todo_input');
  todoInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      addTodo(this.value);
      this.value = '';
    }
  });
}
