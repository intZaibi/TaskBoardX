import { io } from 'socket.io-client';

export const connectNotificationSocket = (userId) => {
  return io('http://localhost:4000/notify', {
    query: { userId },
    transports: ['websocket'],
  });
};
