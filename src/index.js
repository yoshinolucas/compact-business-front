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
import FormUserInfo from './components/Users/FormUser/FormUserInfo';
import Faturamento from './pages/Faturamento';
import Relatorios from './pages/Relatorios';
import Records from './pages/Records';
import Accesses from './pages/Accesses';
import Products from './pages/Products';
import Business from './pages/Business';
import FormProduct from './pages/Products/FormProduct';
import DetailsProduct from './pages/Products/DetailsProduct';
import FormProductInfo from './pages/Products/FormProduct/FormProductInfo';

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
    path: "/inicio",
    element: <PrivateRoute component={<Home />} />
  },
  {
    path: "/users",
    element: <PrivateRoute component={<Users />} />,
  },
  {
    path: "/users/edit",
    element: <PrivateRoute component={<FormUser />} />,
  },
  {
    path: "/users/edit/users-info",
    element: <PrivateRoute component={<FormUserInfo />} />
  },
  {
    path: "/negocios",
    element: <PrivateRoute component={<Business />} />
  },
  {
    path: "/faturamentos",
    element: <PrivateRoute component={<Faturamento />} />
  },
  {
    path: "/relatorios",
    element: <PrivateRoute component={<Relatorios />} />
  },
  {
    path: "/alteracoes",
    element: <PrivateRoute component={<Records />} />
  },
  {
    path: "/acessos",
    element: <PrivateRoute component={<Accesses />} />
  },
  {
    path: "/produtos",
    element: <PrivateRoute component={<Products />} />
  },
  {
    path: "/produtos/edit",
    element: <PrivateRoute component={<FormProduct />} />
  },
  {
    path: "/produtos/detalhes",
    element: <PrivateRoute component={<DetailsProduct/>} />
  },
  {
    path: "/produtos/edit/produto-info",
    element: <PrivateRoute component={<FormProductInfo/>} />
  }
  
  
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

