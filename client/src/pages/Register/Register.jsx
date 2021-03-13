import React from 'react';
import { Redirect } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import useUserContext from '../../hooks/useUserContext';

const Register = () => {
  const { user, register } = useUserContext();

  return (
    <div className="register">
      {user && <Redirect to="/app" />}
      <RegisterForm register={register} />
    </div>
  );
};

export default Register;
