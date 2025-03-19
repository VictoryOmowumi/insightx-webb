import React, { useEffect, useState, useContext } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Bell, CheckCheck, Activity, UserPlus, MessageCircle, FileText, LoaderCircle } from "lucide-react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/api';
import SocketContext from '../../context/SocketContext';
import { Link } from 'react-router-dom';
import moment from 'moment';
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { socket } = useContext(SocketContext);
  const user = JSON.parse(localStorage.getItem('user'));
  const [markingAsRead, setMarkingAsRead] = useState({});

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await getNotifications();
        setNotifications(notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket && user) {
      // Join the user's room for notifications
      socket.emit('joinRoom', user._id);

      // Listen for new notifications
      socket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      // Cleanup on unmount
      return () => {
        socket.off('notification');
      };
    }
  }, [socket, user]);

  // Mark a single notification as read
  const handleMarkNotificationAsRead = async (id) => {
    setMarkingAsRead((prev) => ({ ...prev, [id]: true }));
    try {
      await markNotificationAsRead(id);
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      setNotifications(updatedNotifications);
      getNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setMarkingAsRead((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    setMarkingAsRead((prev) => ({ ...prev, all: true }));
    try {
      await markAllNotificationsAsRead();
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setMarkingAsRead((prev) => ({ ...prev, all: false }));
    }
  };

  // Mapping of notification types to icons
  const notificationIcons = {
    activity: <Activity size={20} strokeWidth={1} />,
    newMember: <UserPlus size={20} strokeWidth={1} />,
    mention: <MessageCircle size={20} strokeWidth={1} />,
    newRequest: <FileText size={20} strokeWidth={1} />,
    // Add more mappings as needed
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex relative w-10 min-h-10 h-full py-3 bg-[#fcfbfc83] dark:bg-zinc-800 rounded-full justify-center items-center hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
        >
          {notifications.filter((notification) => !notification.read).length > 0 && (
            <div className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.filter((notification) => !notification.read).length}
            </div>
          )}
          <Bell size={20} strokeWidth={1} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 mr-5 max-h-[400px] overflow-y-auto">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Notifications</span>
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-500 hover:text-blue-600"
              disabled={markingAsRead.all}
            >
              {markingAsRead.all ? <LoaderCircle size={16} strokeWidth={2} className='animate-spin' /> : 'Mark All as Read'}
            </button>
          </div>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Link
                to={notification.link}
                key={index}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-300 ease-in-out ${notification.read ? 'opacity-70 dark:opacity-85' : ''
                  }`}
              >
                {notificationIcons[notification.type] || <Activity size={20} strokeWidth={1} />}
                <div className="flex flex-col gap-1 flex-grow">
                 <div className="flex justify-between items-center">
                  <span className="text-sm capitalize">{notification.type}</span>
                   <span className="text-[10px] font-light ml-2">{moment(notification.createdAt).fromNow()}</span>
                 </div>
                  <span className="text-xs text-gray-500 dark:text-gray-100">{notification.message}</span>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkNotificationAsRead(notification._id)}
                    className={`p-1 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-full ${markingAsRead[notification._id] ? 'pointer-events-none' : 'cursor-pointer'}`}
                    disabled={markingAsRead[notification._id]}
                  >
                    {markingAsRead[notification._id] ? <LoaderCircle size={16} strokeWidth={2} className='animate-spin' /> : <CheckCheck size={16} strokeWidth={1} />}
                  </button>
                )}
              </Link>
            ))
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-300 ease-in-out">
              <span className="text-sm">No new notifications</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;