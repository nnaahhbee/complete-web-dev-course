import React from 'react'
import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'

function Github() {

    const data = useLoaderData() //getting the data from the loader function in the main.jsx file

    // const [data, setData] = React.useState([])
    // useEffect(() => {
    //     fetch('https://api.github.com/users/hannabuilds')
    //     .then((response) => response.json())
    //     .then((data) => {
    //         console.log(data)
    //         setData(data)
    //     })
    // }, [])

  return (
    <div className='text-center m-4 bg-gray-600 text-white p-4 text-3xl'>Github Name: {data.name}
    <img src={data.avatar_url} width="200" height="200" alt={data.name} />
    </div>
  )
}

export default Github 


export const githubLoader = async () => {
    const response = await fetch('https://api.github.com/users/hannabuilds')
    return response.json() //returning the data from the api to the component

}