import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../Components/SideBar/Sidebar'
import NavBar from "../../Components/NavBar"
const Default = () => {
  return (
    <div className="flex min-h-screen">

      <div className="hidden lg:block w-[20%]">
        <SideBar />
      </div>
      <div className="flex-1 ">
        <NavBar />
        <div className="px-4 sm:px-6 lg:px-10 py-5">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default Default;

