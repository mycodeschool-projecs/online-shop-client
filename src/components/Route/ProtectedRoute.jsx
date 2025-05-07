import React from 'react';
import { Navigate } from 'react-router-dom';
import { usersContext } from "../../services/state/userState";
import { useContext } from 'react';


export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(usersContext);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}