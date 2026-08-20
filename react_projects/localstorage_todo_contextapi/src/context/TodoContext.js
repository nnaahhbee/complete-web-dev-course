import {createContext, useContext} from 'react'

// Creates the shared todo state container so different components can access the same data without passing props around manually.
export const TodoContext = createContext({
    todos: [
        {
            id: 1,
            todo: "Todo Message",
            completed: false
        }
    ],
    addTodo: (todo) => {},
    updateTodo: (id, todo) => {},
    deleteTodo: (id) => {},
    toggleComplete: (id) => {}
})

// A custom hook that gives any component quick access to the todo context values and methods.
export const useTodo = () => {
    return useContext(TodoContext)
}

// Exports the context provider so App can wrap the app and share the todo state globally.
export const TodoProvider = TodoContext.Provider