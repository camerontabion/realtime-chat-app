import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Messages = ({ messages, send }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    send(newMessage);
    setNewMessage('');
  };

  return (
    <div className="messages">
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
      <form onSubmit={handleSubmit} className="message__form">
        <input
          type="text"
          placeholder="Enter message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message__input"
        />
        <button
          type="submit"
          className="message__submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    createdAt: PropTypes.string.isRequired,
  })).isRequired,
  send: PropTypes.func.isRequired,
};

export default Messages;
