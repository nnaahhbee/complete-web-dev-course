import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import User from './components/User/User.jsx'

//routes in react to load a path
const router = createBrowserRouter(
  createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='' element={<Home />}/>
        <Route path='about' element={<About />}/>
        <Route path="user/" element={<User />}> <Route path=':userid/' element={<User />} />
        </Route>  {/*for dynamic routing we can use the :userid in the path and then we can use the useParams hook to get the userid from the url */}
        
      </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
