import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Redirect } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import useUserContext from '../../hooks/useUserContext';

const Register = () => {
  const { user, register } = useUserContext();

  return (
    <div className="register">
      <Helmet>
        <title>Simple Chat App | Register</title>
      </Helmet>
      {user && <Redirect to="/app" />}
      <RegisterForm register={register} />
    </div>
  );
};

export default Register;
