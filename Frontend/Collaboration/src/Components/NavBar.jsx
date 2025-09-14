import React from "react";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa"
import { LuBell } from "react-icons/lu"
import { UserContext } from "../ContextApi/UserContext";
import { useContext } from "react";

const NavBar = () => {
  const {User} = useContext(UserContext)
  return (
    <nav className="font-urbanist shadow-sm border-b flex items-center justify-between px-6 py-3">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold italic text-purple-600 tracking-wider">CollabAssign</span>
      </div>

      {/* Center: Links */}
    

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex  sm:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full text-sm text-black outline-none pl-8  bg-white border border-slate-300 px-2.5 py-1 rounded-md  placeholder:text-gray-500 focus-within:border-purple-300"
          />
          <FaSearch className="absolute left-3 top-1.5 text-gray-400" />
        </div>

        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-indigo-600">
          <LuBell size={20} />
          <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
          <FaUserCircle size={22} className="text-purple-500" />
          <span className="hidden sm:block font-medium">{User.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
