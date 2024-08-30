import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;

  if (!token || (roles && !roles.split(',').some(role => decoded?.rol === role.trim()))) {
    return <Navigate to="/Index" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
