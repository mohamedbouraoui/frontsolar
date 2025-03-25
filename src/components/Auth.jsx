import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import { Navigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const authToken = localStorage.getItem('authToken');

  // If the user is already logged in, redirect to the Dashboard
  if (authToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      {isLogin ? (
        <Login setIsLogin={setIsLogin} />
      ) : (
        <Signup setIsLogin={setIsLogin} />
      )}
    </div>
  );
}

export default Auth;