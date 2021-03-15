import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import auth from '../services/auth';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    (async () => {
      const retUser = await auth.authenticate();
      if (!retUser.error) setUser(retUser);
      setAuthenticating(false);
    })();
  }, []);

  const register = async (authInfo) => {
    const registeredUser = await auth.register(authInfo);
    if (registeredUser.error) throw new Error(registeredUser.error);
    setUser(registeredUser);
  };

  const login = async (authInfo) => {
    const loggedInUser = await auth.login(authInfo);
    if (loggedInUser.error) throw new Error(loggedInUser.error);
    setUser(loggedInUser);
  };

  const logout = async () => {
    const res = await auth.logout();
    if (res.error) throw new Error('Error logging out!');
    else setUser(null);
  };

  const addChannel = (newChannel) => {
    setUser({ ...user, channels: user.channels.concat(newChannel) });
  };

  const removeChannel = (id) => {
    setUser({ ...user, channels: user.channels.filter((channel) => channel.id !== id) });
  };

  return (
    <>
      {!authenticating && (
        <UserContext.Provider
          value={{
            user,
            register,
            login,
            logout,
            addChannel,
            removeChannel,
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
