import React from 'react';
import PropTypes from 'prop-types';
import useUserContext from '../../hooks/useUserContext';

const Sidebar = ({ currentChannel, changeChannel }) => {
  const { user, logout } = useUserContext();

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <p className="sidebar__subtext">Logged in as:</p>
        <div className="sidebar__user">
          <h3 className="sidebar__username">{user.username}</h3>
          <button
            type="button"
            className="sidebar__logout"
            onClick={logout}
          >
            &#10006;
          </button>
        </div>
      </div>
      <div className="sidebar__channels">
        <h2>Channels</h2>
        {user.channels.map((channel) => (
          <button
            type="button"
            className={`channel ${channel.id === currentChannel.id ? 'current' : ''}`}
            onClick={() => changeChannel(channel.id)}
            key={channel.id}
          >
            {channel.name}
          </button>
        ))}
        {/* <div className="createChannel">
          <h4>Create a new channel:</h4>
          <form onSubmit={createChannel}>

          </form>
        </div>
        <div className="joinNewChannel">
          <h4>Join a new channel:</h4>
          <form onSubmit={addChannel}>

          </form>
        </div> */}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  currentChannel: PropTypes.oneOfType([
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      messages: PropTypes.arrayOf(PropTypes.object).isRequired,
      users: PropTypes.arrayOf(PropTypes.object).isRequired,
      createdAt: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.exact({}),
  ]).isRequired,
  changeChannel: PropTypes.func.isRequired,
};

export default Sidebar;
