import React from 'react';
import Sidebar from './Sidebar';
import Messages from './Messages';
import useMessages from '../../hooks/useMessages';

const Dashboard = () => {
  const messages = useMessages();

  return (
    <main className="dashboard">
      <Sidebar
        currentChannel={messages.channel}
        changeChannel={messages.changeChannel}
      />
      <Messages
        messages={messages.data}
        send={messages.send}
      />
    </main>
  );
};

export default Dashboard;
