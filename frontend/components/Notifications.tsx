import React, { useEffect } from 'react';
import { connectNotificationSocket } from '../utils/socket';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationSocket = ({ userId }) => {
  useEffect(() => {
    const socket = connectNotificationSocket(userId);

    socket.on('notification', (data) => {
      toast.info(`🔔 ${data.message}`, {
        position: 'bottom-right',
        autoClose: 5000,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return <ToastContainer />;
};

export default NotificationSocket;
