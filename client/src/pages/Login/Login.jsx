import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';
import useUserContext from '../../hooks/useUserContext';

const Login = () => {
  const { user, login } = useUserContext();

  return (
    <div className="login">
      <Helmet>
        <title>Simple Chat App | Login</title>
      </Helmet>
      {user && <Redirect to="/app" />}
      <LoginForm login={login} />
    </div>
  );
};

export default Login;
