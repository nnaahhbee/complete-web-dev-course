import { useEffect, useState } from 'react'
import './App.css'
import { TodoProvider } from './context'
import { TodoForm } from './components'
import TodoItem from './components/TodoItem'

function App() {
  // Holds the entire todo list for the app. This is the main state shared through context.
  const [todos, setTodos] = useState([])

  // Adds a new todo to the top of the list using a timestamp as a unique id.
  const addTodo = (todo) => {
   setTodos((prev) => [{id: Date.now(), ...todo}, ...prev])
  }

  // Updates an existing todo by matching the current item id and replacing it with the newly edited version.
  const updateTodo = (id, todo) => {
   setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === todo.id ? todo : prevTodo)))
  }

  // Removes a todo item from the list by filtering out the matching id.
  const deleteTodo = (id) => {
   setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  // Toggles the completed status of a todo item without changing the rest of the array.
  const toggleComplete = (id) => {
   setTodos((prev) => 
     prev.map((prevTodo) => 
       prevTodo.id === id ? {...prevTodo, completed: !prevTodo.completed} : prevTodo
     )
   )
  }

  // On first render, loads saved todos from localStorage so the list persists across page reloads.
  useEffect(() => {
   const todos = JSON.parse(localStorage.getItem("todos"))
   if(todos && todos.length > 0){
      setTodos(todos)
   }
  }, [])

  // Whenever the todo list changes, it is saved to localStorage so the data remains available later.
  useEffect(() => {
   localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  return (
     // Provides the todo state and mutation functions to every component inside the app.
     <TodoProvider value={{todos, addTodo, updateTodo, deleteTodo, toggleComplete}}>
       <div className="bg-[#172842] min-h-screen py-8">
                 <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
                     <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>
                     <div className="mb-4">
                         {/* Renders the input form for creating new todos. */}
                         <TodoForm />
                     </div>
                     <div className="flex flex-wrap gap-y-3">
                         {/* Maps over the todo list and renders each item as a separate card component. */}
                         {todos.map((todo) => (
                           <div key={todo.id}
                           className='w-full'
                           >
                             <TodoItem todo={todo} />
                           </div>
                         ))}
                     </div>
                 </div>
             </div>
     </TodoProvider>
   )
}

export default App
