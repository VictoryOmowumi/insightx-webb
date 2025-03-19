import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';
const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // if not user go to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;