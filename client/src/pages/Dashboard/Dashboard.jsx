import React from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from './Sidebar';
import Messages from './Messages';
import useMessages from '../../hooks/useMessages';

const Dashboard = () => {
  const messages = useMessages();

  return (
    <main className="dashboard">
      <Helmet>
        <title>Simple Chat App | Dashboard</title>
      </Helmet>
      <Sidebar
        currentChannel={messages.channel}
        changeChannel={messages.changeChannel}
        joinChannel={messages.joinChannel}
        createChannel={messages.createChannel}
      />
      <Messages
        currentChannel={messages.channel}
        messages={messages.data}
        send={messages.send}
        leaveChannel={messages.leaveChannel}
      />
    </main>
  );
};

export default Dashboard;
