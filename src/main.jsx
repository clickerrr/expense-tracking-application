import React from 'react'
import ReactDOM from 'react-dom/client'
import Dashboard from './components/views/Dashboard.jsx'
import Login from './components/views/Login.jsx'
import Signup from "./components/views/Signup.jsx";
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard/>,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <RouterProvider router={router}>

      <Dashboard />
    </RouterProvider>
  </React.StrictMode>,
)
