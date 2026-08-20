import React, { useState } from 'react'
import {useTodo} from '../context/TodoContext'

function TodoItem({todo}) {
   // Controls whether the text field is in editing mode or read-only mode.
   const [isTodoEditable, setIsTodoEditable] = useState(false)

   // Keeps the current text value of the item while editing so changes are not immediately saved to the global state.
   const [todoMsg, setTodoMsg] = useState(todo.todo)
    
   // Pulls update, delete, and toggle functions from the shared todo context for this item.
   const {updateTodo, deleteTodo, toggleComplete} = useTodo()

   // Saves the edited text back to the todo object and exits edit mode.
   const editTodo = () => {
    updateTodo(todo.id, {...todo, todo: todoMsg})
    setIsTodoEditable(false)
   }

   // Calls the context function that toggles the completion status for the current todo.
   const toggleCompleted = () => {
    toggleComplete(todo.id)
   }

  return (
   // Renders one todo item card with a different background based on whether it is completed.
   <div className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300 text-black ${todo.completed ? "bg-[#c6e9a7]" : "bg-[#ccbed7]"}`}>
       {/* Checkbox that marks the todo as complete or incomplete. */}
       <input type="checkbox"
       className="cursor-pointer"
       checked={todo.completed}
       onChange={toggleCompleted}
       />

       {/* Text field that shows the todo content and becomes editable when the user selects edit. */}
       <input type="text"
       className={`border outline-none w-full bg-transparent rounded-lg ${isTodoEditable ? "border-black/10 px-2" : "border-transparent"}`}
       value={todoMsg}
       onChange={(e) => setTodoMsg(e.target.value)}
       readOnly={!isTodoEditable}
       />

       {/* Edit/save button. It prevents editing completed todos and either saves or starts editing based on the state. */}
       <button className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
       onClick={() => {
           if(todo.completed) return
           if(isTodoEditable) {
               editTodo()
           }else setIsTodoEditable((prev) => !prev)
       }}
       disabled={todo.completed}
       >{isTodoEditable ? "💾" : "✏️"}</button>

       {/* Delete button removes the selected todo from the context-managed list. */}
       <button className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
       onClick={() => deleteTodo(todo.id)}
       >❌</button>
   </div>
  )
}

export default TodoItem