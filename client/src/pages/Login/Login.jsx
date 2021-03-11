import React from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';
import useUserContext from '../../hooks/useUserContext';

const Login = () => {
  const { user, login } = useUserContext();

  return (
    <div className="login">
      {user && <Redirect to="/app" />}
      <LoginForm login={login} />
    </div>
  );
};

export default Login;
