import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="landing">
    <h1>
      Landing
    </h1>
    <Link to="/login">Login</Link>
    <br />
    <Link to="/register">Register</Link>
  </div>
);

export default Landing;
