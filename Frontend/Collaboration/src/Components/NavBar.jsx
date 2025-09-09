import React from 'react'

import { FaCode } from 'react-icons/fa'

const NavBar = () => {
  return (
    <div className='font-urbanist border-b flex items-center justify-between px-5 py-2 border'>
      <h1 className='font-semibold flex items-center justify-center gap-2'>  <FaCode className="size-4" />Supported Languages</h1>
      <div className='flex gap-2'>
        {/* {
          LanguageIcons.map((item)=>(
            <div className='flex items-center justify-between gap-2 text-[12px] font-semibold text-purple-800 bg-purple-600/15 border hover:-rotate-12 border-purple-400 px-3 py-1 rounded-2xl cursor-pointer'>
              <img src={item.icons} className='w-3' alt="" />
              <span className=''>{item.label}</span>
            </div>
          ))
        } */}
      </div>
    </div>
  )
}

export default NavBar