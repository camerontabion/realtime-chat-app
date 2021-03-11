import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import auth from '../services/auth';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticating, setAuthenticating] = useState(true);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const retUser = await auth.authenticate();
      if (!retUser.error) setUser(retUser);
      setAuthenticating(false);
    })();
  }, []);

  const login = async (authInfo) => {
    const loggedInUser = await auth.login(authInfo);
    if (loggedInUser.error) throw new Error(loggedInUser.error);

    setUser(loggedInUser);
    history.push('/app');
  };

  const logout = async () => {
    const res = await auth.logout();
    if (res.error) throw new Error('Error logging out!');
    else setUser(null);
  };

  return (
    <>
      {!authenticating && (
        <UserContext.Provider
          value={{
            user,
            login,
            logout,
          }}
        >
          {children}
        </UserContext.Provider>
      )}
    </>
  );
};

UserProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
