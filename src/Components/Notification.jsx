// Create a new file: src/Components/Notifications/NotificationBell.js
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '@/services/interceptor';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.login);
  const wsRef = useRef(null);
  const notificationRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);


  // Fetch initial notifications
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      connectWebSocket();
      
      return () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
      };
    }
  }, [user]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/api/notifications/recent/');
      setNotifications(response.data);
      setNotificationCount(response.data.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const connectWebSocket = () => {
    // Get the protocol (ws or wss)
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    // Get the host
    // const host = process.env.NODE_ENV === 'development' ? '127.0.0.1:8000' : window.location.host;
    const host = process.env.NODE_ENV === 'development' ? '127.0.0.1:8000' : 'www.martia.sbs';

    const token = JSON.parse(localStorage.getItem('authTokens'))?.access
    const url = `${protocol}://${host}/ws/notifications/?token=${token}`;

    console.log('Connecting to WebSocket:', url);

    // Connect to WebSocket
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');

      // Reset reconnect attempt counter on successful connection
      reconnectTimeoutRef.current = null;
    };

    wsRef.current.onmessage = (e) => {
      console.log('Received message:', e.data);
      const data = JSON.parse(e.data);
      
      if (data.type === 'new_notification') {
        // Prevent duplicate notifications by checking if the notification already exists
        setNotifications(prev => {
          // Check if the notification is already in the list
          const isDuplicate = prev.some(notification => 
            notification.id === data.notification.id
          );

          // Only add if it's not a duplicate
          if (!isDuplicate) {
            return [data.notification, ...prev];
          }

          return prev;
        });

        // Only increment count if it's a new notification
        setNotificationCount(prev => {
          const isDuplicate = notifications.some(notification => 
            notification.id === data.notification.id
          );

          return isDuplicate ? prev : prev + 1;
        });
      
      } else if (data.type === 'recent_notifications') {
        // Remove duplicates from recent notifications
        const uniqueNotifications = data.notifications.filter((notification, index, self) => 
          index === self.findIndex(t => t.id === notification.id)
        );

        setNotifications(uniqueNotifications);
        setNotificationCount(uniqueNotifications.length);

      } else if (data.type === 'notification_deleted') {
        setNotifications(prev => prev.filter(notification => notification.id !== data.notification_id))
        setNotificationCount(prev => prev - 1)

      } else if (data.type === 'all_notification_deleted') {
        setNotifications([])
        setNotificationCount(0)

      }
    };

    wsRef.current.onerror = (e) => {
      console.error('WebSocket error:', e);
    };

    wsRef.current.onclose = (event) => {
      console.warn(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
      // Optional: Attempt to reconnect after a delay
      setTimeout(() => {
        if (user?.id) connectWebSocket();
      }, 3000);
    };
  };

  const deletNotifications = async(notificationId,e) => {
    // Stop the event from propagating to parent (important to prevent navigation)
    e.stopPropagation();

    try {
      await axiosInstance.delete(`/api/notifications/${notificationId}/delete_notification/`);

       // Send delete command via WebSocket for real-time updates to all clients
       if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          command: 'delete_notification',
          notification_id: notificationId
        }));
      }

      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      setNotificationCount(prev => prev - 1);
      
    } catch (error) {
      console.error('Error deleting notification:', error);
      
    }
     
  }




  const deleteAllNotifications = async () => {
    try {
      // Send delete all request to server
      await axiosInstance.delete('/api/notifications/delete_all/');
      
      // Send delete all command via WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          command: 'delete_all'
        }));
      }
      
      // Update local state
      setNotifications([]);
      setNotificationCount(0);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };







  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    
    // Request notification permission if not already granted
    // if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    //   Notification.requestPermission();
    // }
  };

 

  return (
    <div className="relative" ref={notificationRef}>
      <button
        className="relative p-2 rounded-lg hover:bg-gray-700"
        onClick={toggleNotifications}
      >
        <Bell className="w-6 h-6 text-gray-300" />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-100">Notifications</h3>
            {notificationCount > 0 && (
              <button
                onClick={deleteAllNotifications}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${
                    !notification.read ? 'bg-gray-700/50' : ''
                  }`}
                 
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-100">{notification.title}</h4>
                    <button
                        onClick={(e) => deletNotifications(notification.id, e)}
                        className="group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400 opacity-100"
                        aria-label="Delete notification"
                      >
                        <X className="w-4 h-4" />
                      </button>

                  </div>
                  <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-gray-700">
            <button
              className="w-full text-center text-sm text-blue-400 hover:text-blue-300"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;