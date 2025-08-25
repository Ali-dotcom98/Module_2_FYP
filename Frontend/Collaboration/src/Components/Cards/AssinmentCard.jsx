import React, { useEffect, useState } from 'react'

const AssinmentCard = ({ imgurl, title, lastUpdated, onSelect, DeletedArray , ID }) => {  
    
    return(
        <div
            className={`${DeletedArray ? DeletedArray?.includes(ID)?"border border-purple-600 ":"" : ""} h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200  cursor-pointer hover:border-purple-600 overflow-hidden transition`}
            style={{backgroundColor: "#F5F4FF"}}
            onClick={onSelect}
            >
            <div className="p-4">
                {imgurl ? (
                <img
                    src={imgurl}
                    alt="Resume Thumbnail"
                    className=" h-[210px] rounded"
                />
                ) : (
                <span className="text-gray-400">No Preview Available</span>
                )}
            </div>
            <div className='w-full bg-white px-4 py-3'>
                <h3 className="text-sm font-medium truncate overflow-hidden whitespace-nowrap">{title}</h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Last updated: {lastUpdated}</p>
            </div>
        </div>
    )
    
  
}

export default AssinmentCard