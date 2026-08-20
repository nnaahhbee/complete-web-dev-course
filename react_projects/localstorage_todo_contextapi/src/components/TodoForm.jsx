import React, { useState } from 'react'
import { useTodo } from '../context/TodoContext'

function TodoForm() {
   // Holds the current text typed in the input field before it is submitted.
   const [todo, setTodo] = useState("")

   // Gets the addTodo function from context so this component can create a new todo item.
   const {addTodo} = useTodo()
   
   // Handles the form submission and creates a todo only when the input is not empty.
   const add = (e) => {
       e.preventDefault()
       if(!todo) return
       addTodo({todo, completed: false})
       setTodo("")
   }

   return (
       // Renders the input and button used to create a new todo item.
       <form onSubmit={add} className="flex">
           <input type="text"
           placeholder="Add a todo"
           className="w-full border border-black/10 rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
           value={todo}
           onChange={(e) => setTodo(e.target.value)}
           />
           <button type="submit"
           className="rounded=r-lg px-3 py-1 bg-green-600 text-white shrink-0">Add</button>
       </form>
  )
}

export default TodoForm