import React, { useEffect, useState } from 'react'
import img from '../../../src/assets/AV.jpg'
const GroupCard = ({ imgurl, title, status, lastUpdated, onselect, group , ID}) => {  
    
    return(
        <div
            className={` h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200  relative cursor-pointer hover:border-purple-600 overflow-hidden transition`}
            style={{backgroundColor: "#F5F4FF"}}

            onClick={ onselect }
            >
            <p className='absolute bg-yellow-300 text-yellow-600 top-5 -right-9 rotate-45 min-w-36 text-center text-sm py-1 font-medium'>{status}</p>
            <div className="p-4">
                {imgurl ? (
                <img
                    src={imgurl}
                    alt="Resume Thumbnail"
                    className=" h-[175px] rounded"
                />
                ) : (
                <span className="text-gray-400">No Preview Available</span>
                )}
            </div>
            <div className='w-full bg-white px-4 py-3'>
                <h3 className="text-sm font-medium truncate overflow-hidden whitespace-nowrap">{title}</h3>
                    <div className='flex items-center '>
                        {
                            group.slice(0,3).map((item,index)=>(
                                <img key={index}  src={img} alt="" className='size-9 rounded-full border-2 border-white -ml-3 first:ml-0' />

                            ))
                        }
                    {
                        (group?.length > 3) && (
                            <div className='text-black'>
                                +{group.length-3}
                            </div>
                        )
                    }
                    </div>
                    
                <p className="text-xs font-medium text-gray-500 mt-0.5">Last updated: {lastUpdated}</p>

            </div>
        </div>
    )
    
  
}

export default GroupCard