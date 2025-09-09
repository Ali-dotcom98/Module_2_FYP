import { Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const AssinmentCard = ({ imgurl, title, lastUpdated, onselect, DeletedArray , ID , tag}) => {  
    console.log(tag);
    
    return(
        <div
            className={`${DeletedArray ? DeletedArray?.includes(ID)?"border border-purple-600 ":"" : ""} h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200  relative cursor-pointer hover:border-purple-600 overflow-hidden transition`}
            style={{backgroundColor: "#F5F4FF"}}

            onClick={tag == "Edit" ? onselect :()=>onselect(ID) }
            >
                {
                tag=="Performance"  && (
                <p className='absolute bg-yellow-300 text-yellow-600 top-5 -right-9 rotate-45 min-w-36 text-center text-sm py-1 font-medium'>Submitted</p>

                )
            }
             {
                tag == "Evaluation" && (
                <p className='absolute bg-yellow-300 text-yellow-600 top-5 -right-9 rotate-45 min-w-36 text-center text-sm py-1 font-medium'>Closed</p>

                )
            }

            <div className="p-2">
                {imgurl ? (
                <img
                    src={imgurl}
                    alt="Resume Thumbnail"
                    className=" h-[220px] rounded"
                />
                ) : (
                <span className="text-gray-400">No Preview Available</span>
                )}
            </div>
            <div className='w-full bg-white px-4 py-3'>
                <h3 className="text-sm font-medium truncate overflow-hidden whitespace-nowrap">{title}</h3>
                {
                    tag && <p className="text-xs font-medium text-gray-500 mt-0.5">Due Date :  {lastUpdated}</p>

                }
            </div>
        </div>
    )
    
  
}

export default AssinmentCard