import React, { useContext, useEffect, useRef, useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { LuBell } from "react-icons/lu";
import { UserContext } from '../ContextApi/UserContext';
import AxiosInstance from "../Utility/AxiosInstance";

const NavBar = () => {
  const { User } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); 


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await AxiosInstance.get("/Notifications");
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);

    for (const n of unreadNotifications) {
      try {
        await AxiosInstance.put(`/Notifications/${n._id}/read`);
      } catch (err) {
        console.error(err);
      }
    }


    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type) => {
    switch(type) {
      case "Assignment": return "📄";
      case "Message": return "💬";
      case "System": return "⚙️";
      default: return "🔔";
    }
  };

  return (
    <nav className="font-urbanist shadow-sm border-b flex items-center justify-between px-6 py-3 bg-white">

      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold italic text-purple-600 tracking-wider">CollabAssign</span>
      </div>

      <div className="relative flex sm:block">
        <input
          type="text"
          placeholder="Search..."
          className="w-full text-sm text-black outline-none pl-8 bg-white border border-slate-300 px-2.5 py-1 rounded-md placeholder:text-gray-400 focus-within:border-purple-400"
        />
        <FaSearch className="absolute left-3 top-1.5 text-gray-400" />
      </div>

     
      <div className="flex items-center gap-4">

        <div className="relative" ref={dropdownRef}> 
          <button
            onClick={handleDropdownToggle}
            className="relative text-gray-600 hover:text-indigo-600"
          >
            <LuBell className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute -right-16  mt-3 w-96 bg-white border shadow-lg rounded-lg z-50 flex flex-col">
              
             
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <p className="text-sm text-gray-500">
                  You have {unreadCount} new {unreadCount === 1 ? "notification" : "notifications"}.
                </p>
              </div>

             
              <div className="flex-1 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-500 text-sm">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`flex items-start gap-3 p-4 border-b hover:bg-gray-50 transition ${!n.read ? "bg-purple-50" : ""}`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg">
                        {getNotificationIcon(n.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${!n.read ? "text-purple-700" : "text-gray-800"}`}>{n.title}</p>
                        <p className="text-sm text-gray-600">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              
              {unreadCount > 0 && (
                <div className="p-3 border-t">
                  <button
                    onClick={handleMarkAllRead}
                    className="w-full text-center text-sm text-gray-600 hover:text-purple-600 py-2 rounded-md border border-gray-300 hover:border-purple-400 transition"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>


        <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
          <FaUserCircle size={22} className="text-purple-500" />
          <span className="hidden sm:block font-medium">{User.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
