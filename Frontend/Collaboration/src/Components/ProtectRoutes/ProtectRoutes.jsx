// src/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../Pages/ContextApi/UserContext';

const Protected = ({ children, allowed }) => {
  const { User , loading} = useContext(UserContext);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!User.status) return <Navigate to="/Login" />;

  if (!allowed.includes(User.status)) return <Navigate to="/" />;

  return children;
};

export default Protected;
