import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './includes/responsive.css';
import './includes/table.css';
import './includes/form.css';
import './includes/root.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Users from './components/Users';
import { isAuthenticated } from './services/auth';
import FormUser from './components/Users/FormUser';

const PrivateRoute = ({ component: Component }) => {
  if( isAuthenticated() ) return Component;
  return <Navigate to="/" />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/home",
    element: <PrivateRoute component={<Home />} />
  },
  {
    path: "/users",
    element: <PrivateRoute component={<Users />} />,
  },
  {
    path: "/users/edit",
    element: <PrivateRoute component={<FormUser />} />,
  }
  
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

