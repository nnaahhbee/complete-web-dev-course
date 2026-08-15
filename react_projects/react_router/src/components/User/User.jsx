import React from 'react'
import {useParams} from 'react-router-dom' 

function User() {
//useParams is a hook that allows us to access the parameters of the current route. In this case, we are accessing the userid parameter from the URL.
const {userid} = useParams()
  return (
    <div>User: {userid}</div>
  )
}

export default User