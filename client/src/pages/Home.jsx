// File: client/src/pages/Home.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === 'OWNER') {
    return <Navigate to="/owner" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default Home;
