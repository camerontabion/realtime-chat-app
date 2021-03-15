import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import useUserContext from '../../hooks/useUserContext';

const Landing = () => {
  const { user } = useUserContext();

  return (
    <div className="landing">
      <Helmet>
        <title>Simple Chat App</title>
      </Helmet>
      <h1>Simple Chat App</h1>
      <p>Create an account, join a room, and start chatting!</p>
      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <Link to="/app">Dashboard</Link>
      )}
    </div>
  );
};

export default Landing;
