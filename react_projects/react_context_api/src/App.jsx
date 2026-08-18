import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Profile from './components/Profile'
import UserContextProvider from './context/UserContextProvider'

function App() {

  return (
    // Wrap the components that need access to the user context with the UserContextProvider
    <UserContextProvider>
      <h1>React video for context</h1>
      <Login />
      <Profile />
    </UserContextProvider>
  )
}

export default App
