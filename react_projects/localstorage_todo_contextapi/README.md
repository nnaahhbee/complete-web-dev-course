# LocalStorage Todo App with Context API

A small React learning project that demonstrates how to manage a todo list using React Context API while persisting data in the browser with `localStorage`.

This project is created solely for educational purposes. It is intended to help learners understand how state can be shared across components and how browser storage can keep app data after page refreshes.

## Project Purpose

The app allows a user to:

- add a new todo
- mark a todo as complete or incomplete
- edit an existing todo
- delete a todo
- keep all todo items saved even after reloading the page

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS


## Core Concepts Covered

This project teaches the following ideas:

- React state management with `useState`
- Sharing state using Context API
- Using custom hooks for cleaner component access
- Saving application data in `localStorage`
- Loading persisted data on app startup
- Rendering lists dynamically in React
- Updating items in place without mutating the full array incorrectly

## How It Works

### 1. App-level todo state

The main state lives in `App.jsx`. It keeps an array called `todos` and defines functions to:

- add a todo
- update a todo
- delete a todo
- toggle completion status

These functions are passed to the provider so other components can use them.

### 2. Context API for shared data

The app uses a `TodoContext` created in `src/context/TodoContext.js`.

This file exposes:

- `TodoContext`
- `useTodo()`
- `TodoProvider`

This makes it possible for components like `TodoForm` and `TodoItem` to access shared todo functionality without passing props through many layers.

### 3. Form for creating todos

`TodoForm.jsx` contains the input field and Add button.

When the user submits the form:

- the input value is checked
- an empty value is ignored
- a new todo is created with `completed: false`
- the input field is cleared

### 4. Individual todo item behavior

`TodoItem.jsx` renders a single todo row.

Each item includes:

- a checkbox to mark the todo as complete
- a text field showing the todo message
- an Edit/Save button
- a Delete button

The component also prevents editing a completed item and allows saving the updated text back into the shared state.

### 5. Local storage persistence

The project stores todos in browser storage with `localStorage`.

There are two key effects in `App.jsx`:

- on mount, load previous todos from storage
- whenever the `todos` array changes, save it back to storage

This means the todo list remains available after a browser refresh.


## Learning Takeaways

This project is ideal for learning:

- how centralized state works in React
- how Context API reduces prop drilling
- how to keep app state persistent in the browser
- how list rendering and updates work in React
- how to create practical UI interactions in a simple app

## Educational Use Only

This project is created solely for educational purposes. It is not intended for production deployment, commercial use, or as a finalized real-world app template.

