//responsible for setting the data

import React, {useState, useContext} from 'react'
import UserContext from '../context/UserContext'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const {setUser} = useContext(UserContext) // Access the setUser function from the UserContextProvider to update the user state

  const handleSubmit = (e) => {
    e.preventDefault()
    setUser({username, password}) // Update the user context with the entered username and password
  }

  return (
    <div>
        <h2>Login</h2>
        <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        />
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default Login