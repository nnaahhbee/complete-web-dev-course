import React, {useContext} from 'react'
import UserContext from '../context/UserContext'

function Profile() {
    const {user} = useContext(UserContext) // Access the user state from the UserContext to display the user's information

    if(!user) return <h1>Login to see profile</h1>
  return (
    <div>
        <h1>Profile: {user.username}</h1>
    </div>
  )
}

export default Profile