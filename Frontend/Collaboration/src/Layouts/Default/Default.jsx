import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../Components/SideBar/Sidebar'
const Default = () => {
  return (
    <div className='flex'>
      <div className='w-[20%] '><SideBar/></div>
      <div className='w-[80%]'>
        <Outlet/>
      </div>

    </div>
  )
}

export default Default