import React from 'react'
import Pic1 from "../../assets/NoFound.svg"

const NoFound = () => {
  return (
    <div className='font-poppins min-h-screen flex flex-col w-full items-center justify-center'>
        <div className='size-56 -translate-y-20 -translate-x-4'>
            <img src={Pic1} alt="No Data Found" />
        </div>
        <div className='text-center -translate-y-14'>
            <h1 className='text-xl font-bold text-violet-600 '>No Cards Available</h1>
            <p className='text-sm font-medium text-gray-500 mt-2'>
                You haven't added any cards yet, or you've deleted all of them.
                <br />
                Start by creating a new one!
            </p>
        </div>
    </div>
  )
}

export default NoFound
