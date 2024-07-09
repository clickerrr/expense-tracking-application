import React from 'react'
import ReactDOM from 'react-dom/client'
import Dashboard from './components/views/Dashboard.jsx'
import Login from './components/views/Login.jsx'
import Signup from "./components/views/Signup.jsx";
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthProvider from './AuthenticationContext.jsx';
import PrivateRoute from './PrivateRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
    <PrivateRoute>
      <Dashboard/>
    </PrivateRoute>),
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
    <AuthProvider>
      <RouterProvider router={router}>
        <Dashboard />
      </RouterProvider>
    </AuthProvider>
  </React.StrictMode>,
)
