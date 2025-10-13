import React from 'react'
import Pic1 from "../../assets/NoFound.svg"

const NoFound = ({title}) => {
  return (
    <div className='font-poppins min-h-screen flex flex-col w-full items-center justify-center'>
        <div className='size-48 -translate-y-20 -translate-x-4'>
            <img src={Pic1} alt="No Data Found" />
        </div>
        <div className="text-center -translate-y-16">
        <h1 className="text-lg font-bold text-violet-600">No {title || "Assingment"} Available</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">
          You currently don’t have any {String({title}).toLowerCase || "assingments"} assigned to you.
          <br />
         
        </p>
      </div>
    </div>
  )
}

export default NoFound
