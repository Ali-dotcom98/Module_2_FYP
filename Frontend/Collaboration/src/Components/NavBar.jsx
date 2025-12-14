import React, { useContext, useEffect, useRef, useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { LuBell } from "react-icons/lu";
import {
  FaRegFileAlt,
  FaRegCommentDots,
  FaCogs,
  FaBell,
} from "react-icons/fa";
import { UserContext } from "../ContextApi/UserContext";
import AxiosInstance from "../Utility/AxiosInstance";

const NavBar = () => {
  const { User } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    AxiosInstance.get("/Notifications")
      .then(res => setNotifications(res.data))
      .catch(console.error);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = e =>
      dropdownRef.current && !dropdownRef.current.contains(e.target) &&
      setOpen(false);

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    try {
      await AxiosInstance.put("/Notifications/read-all");
      setNotifications(n => n.map(i => ({ ...i, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const iconByType = type => {
    const base = "text-gray-600";
    switch (type) {
      case "Assignment":
        return <FaRegFileAlt className={base} />;
      case "Message":
        return <FaRegCommentDots className={base} />;
      case "System":
        return <FaCogs className={base} />;
      default:
        return <FaBell className={base} />;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 font-urbanist">

        {/* Logo */}
        <h1 className="text-xl font-semibold tracking-wide text-purple-600">
          CollabAssign
        </h1>

        {/* Search */}
        <div className="relative w-72 hidden md:block">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5">

          {/* Notifications */}
          <div ref={dropdownRef} className="relative">
            <button
              aria-label="Notifications"
              onClick={() => setOpen(!open)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <LuBell className="text-xl text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg border shadow-xl animate-fade-in">

                {/* Header */}
                <div className="px-4 py-3 border-b">
                  <h3 className="font-semibold text-gray-800">
                    Notifications
                  </h3>
                  <p className="text-xs text-gray-500">
                    {unreadCount} unread
                  </p>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                      No notifications
                    </p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n._id}
                        className={`flex gap-3 px-4 py-3 border-b hover:bg-gray-50 ${
                          !n.read && "bg-purple-50"
                        }`}
                      >
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
                          {iconByType(n.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="w-full py-2 text-sm text-purple-600 hover:bg-purple-50 border-t"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            )}
          </div>

          {/* User */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-purple-600">
            <FaUserCircle className="text-2xl text-purple-500" />
            <span className="hidden sm:block text-sm font-medium">
              {User?.name}
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
