"use client"
import React, { useContext, useEffect, useState } from 'react';
import { connectNotificationSocket } from '../utils/socket';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from '@/app/context/context';
import { useRouter } from 'next/navigation';
import { fetchProjects } from '@/utils/apis';

const NotificationSocket = () => {
  const { user, setUser, setProjects } = useContext(Context);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/get-user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok && response.status === 401) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      } else {
        console.log('No user data found');
      }
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        toast.error('You are not logged in. Please log in to receive notifications.', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        router.push('/login');
      }
      console.log('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser(); 
    }
  }, [user]);

  const setProjectsData = async ()=>{
    const res = await fetchProjects();
    setProjects(res)
  }

  useEffect(() => {
    let socket: any = null;
    if (user && user.userId) {
      socket = connectNotificationSocket(user.userId);
      socket.on('connect', () => {
        console.log('Connected to notification socket');
        toast.success('Connected to notifications');
      });
      socket.on('notification', (data: any) => {
        toast.info(`🔔 ${data}`, {
          position: 'bottom-right',
          autoClose: 5000,
        });
        setProjectsData() 
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [user]);

  return <ToastContainer />;
};

export default NotificationSocket;

