import { useReducer, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import channelsService from '../services/channels';
import useUserContext from './useUserContext';

const ACTIONS = {
  ADD_MESSAGE: 'addMessage',
  UPDATE_CHANNEL: 'updateChannel',
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_CHANNEL:
      return {
        data: action.payload.channel.messages,
        channel: action.payload.channel,
      };
    case ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        data: [...state.data, action.payload.message],
      };
    default:
      throw new Error();
  }
};

const useMessages = () => {
  const { addChannel } = useUserContext();

  const socket = useRef();
  const [{ data, channel }, dispatch] = useReducer(reducer, {
    data: [],
    channel: {},
  });

  useEffect(() => {
    socket.current = io('http://localhost:3001', {
      withCredentials: true,
    });
    socket.current.on('message', (message) => {
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: { message },
      });
    });
    return () => {
      socket.current.close();
    };
  }, []);

  const send = (message) => {
    if (channel) socket.current.emit('message', channel.id, message);
  };

  const updateChannel = (newChannel, id) => {
    socket.current.emit('join', channel.id, id);
    dispatch({
      type: ACTIONS.UPDATE_CHANNEL,
      payload: { channel: newChannel },
    });
  };

  const changeChannel = async (id) => {
    const newChannel = await channelsService.get(id);
    updateChannel(newChannel, id);
  };

  const createChannel = async (name) => {
    const newChannel = await channelsService.create(name);
    if (newChannel.error) throw new Error(newChannel.error);

    addChannel(newChannel);
    updateChannel(newChannel, newChannel.id);
  };

  const joinChannel = async (id) => {
    const newChannel = await channelsService.join(id);
    if (newChannel.error) throw new Error('Invalid Channel ID!');

    addChannel(newChannel);
    updateChannel(newChannel, newChannel.id);
  };

  return {
    data,
    channel,
    send,
    changeChannel,
    createChannel,
    joinChannel,
  };
};

export default useMessages;
