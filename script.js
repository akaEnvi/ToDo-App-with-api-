// ist der state der alle todo daten beinhaltet
let todos = [];
let localStorageIsEmpty = false;

const clearBtn = document.querySelector("#clear-btn");

/**
 * fügt ein neues ToDo hinzu
 * @param {string} text
 */
function addTodo(text) {
  if (text.length > 3) {
    const data = { description: text, done: false };
    console.log(data);
    fetch("http://localhost:4730/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((data) => {
      console.log(data);
      renderApiData();
    });
  }
}

function renderApiData() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      todos = data;
      render();
    });
}
renderApiData();

function updateTodo(todo) {
  const data = { description: todo.description, done: !todo.done };
  console.log(data);
  fetch("http://localhost:4730/todos/" + todo.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((data) => {
    console.log(data);
    renderApiData();
  });
}

// ^____ Array mit einträgen aus dem Localstorage befüllt werden
// Neue Einträge müssen in das todos array, und in den localstorage gespeichert werden

const newTodoInputElement = document.querySelector("#new-todo");

const newBtnElement = document.querySelector("#new-todo-btn");
const newTodoItemForm = document.querySelector("#new-item-form");

newTodoItemForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addTodo(newTodoInputElement.value);

  render();
  // reset input feld
  newTodoInputElement.value = "";
});

// list html element wo Einträge angezeigt werden sollen
const todoListElement = document.querySelector(".todo-list");

function render() {
  // reset
  todoListElement.innerHTML = "";

  if (localStorageIsEmpty) {
    const infoTextElement = document.createElement("li");
    infoTextElement.textContent = "Keine To-Dos vorhanden.";
    todoListElement.appendChild(infoTextElement);
  }

  // aus dem todos state einzelne todos erzeugen
  for (let todo of todos) {
    // dynamisch li html Elemente erzeugen mit den Daten von todo
    const listItemElement = document.createElement("li");
    listItemElement.innerText = todo.description;

    const checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.id = todo.id;

    checkboxElement.addEventListener("change", function () {
      updateTodo(todo);
    });

    if (todo.done) {
      checkboxElement.checked = true;
    }

    listItemElement.appendChild(checkboxElement);
    todoListElement.appendChild(listItemElement);
  }
}

clearBtn.addEventListener("click", (e) => {
  if (todos.isDone === true) {
    todos = todos.filter((d) => d != todos);
  }
  localStorage.setItem("todos", JSON.stringify(todos));
  render();
});
