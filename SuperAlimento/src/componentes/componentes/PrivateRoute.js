import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode }from 'jwt-decode'; 
const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const currentLocation = window.location.pathname;

  if (!token || (roles && !roles.split(',').some(role => decoded?.rol === role.trim()))) {
    return <Navigate to="/Error" state={{ from: currentLocation }} />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
