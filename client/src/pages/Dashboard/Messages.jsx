import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import useUserContext from '../../hooks/useUserContext';

const Messages = ({
  currentChannel, messages, send, leaveChannel,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messageList = useRef(null);
  const { user } = useUserContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    send(newMessage);
    setNewMessage('');
  };

  useLayoutEffect(() => {
    messageList.current.scrollTop = messageList.current.scrollHeight;
  }, [messages]);

  return (
    <div className="messages">
      <div className="messages__header">
        <h1>{currentChannel.name}</h1>
        <span className="channel-id">{`- ${currentChannel.id} -`}</span>
        {user.channels[0].id !== currentChannel.id && (
          <button type="button" onClick={() => leaveChannel(currentChannel.id)}>Leave Channel</button>
        )}
      </div>
      <div className="messages__container" ref={messageList}>
        <div className="message__list">
          {messages.map((message) => {
            const createdAt = new Date(message.createdAt);
            const date = createdAt.toLocaleDateString();
            const time = createdAt.toLocaleTimeString();

            return (
              <div className="message" key={message.id}>
                <div className="message__info">
                  <h3 className="message__username">{message.user.username}</h3>
                  <span className="message__timestamp">{`${date} at ${time}`}</span>
                </div>
                <p className="message__text">
                  {message.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="messages__form">
        <form onSubmit={handleSubmit} className="message__form">
          <input
            type="text"
            placeholder="Enter message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message__input"
          />
        </form>
      </div>
    </div>
  );
};

Messages.propTypes = {
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
  messages: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    createdAt: PropTypes.string.isRequired,
  })).isRequired,
  send: PropTypes.func.isRequired,
  leaveChannel: PropTypes.func.isRequired,
};

export default Messages;
