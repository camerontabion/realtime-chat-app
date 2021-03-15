import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found">
    <h1>Cannot find the page you are looking for!</h1>
    <Link to="/">Click to go back</Link>
  </div>
);

export default NotFound;
