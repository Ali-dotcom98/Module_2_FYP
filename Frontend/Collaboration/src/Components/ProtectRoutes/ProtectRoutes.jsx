// src/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../ContextApi/UserContext';

const Protected = ({ children, status }) => {
  const { loading , User} = useContext(UserContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  // if (!User?.status) return <Navigate to="/Login" />;

  if (!status.includes(User?.status)) return <Navigate to="/Login" />;

  return children;
};

export default Protected;
