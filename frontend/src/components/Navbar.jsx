import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User, Bell } from "lucide-react";
import NotificationPanel from './NotificationPanel';

const Navbar = () => {

  const { authUser, logout, getFriendRequests } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (authUser) {
      loadNotificationCount();
      // Poll for new requests every 30 seconds
      const interval = setInterval(loadNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [authUser]);

  const loadNotificationCount = async () => {
    try {
      const requests = await getFriendRequests();
      setNotificationCount(requests.length);
    } catch (error) {
      console.log("Error loading notification count:", error);
      setNotificationCount(0);
    }
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chat-ify</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {authUser && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`btn btn-sm gap-2 transition-colors relative ${showNotifications ? "btn-active" : ""
                    }`}
                >
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>

                <NotificationPanel
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  onRequestHandled={loadNotificationCount}
                />
              </div>
            )}

            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  )
}

export default Navbar