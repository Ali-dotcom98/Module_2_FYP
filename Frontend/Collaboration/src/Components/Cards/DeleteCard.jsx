import { Delete, OctagonAlert } from 'lucide-react'

import React from 'react'
import { LuBatteryWarning, LuDelete, LuFileWarning, LuMailWarning } from 'react-icons/lu'

const DeleteCard = ({AssingmentInfo, HandleDelete}) => {
  return (
    <div className=''>
      <div className="font-urbanist text-black px-6 space-y-5">
          <div className='space-y-3'>
            <div className='flex items-center gap-3 mt-2'>
              <OctagonAlert className='size-6 text-red-500' />
            <h3 className="text-lg font-semibold text-black">Delete Current Assingment</h3>
            
            </div>
            <p className="text-md text-center ">
              You're about to permanently delete the  titled{' '}
              <span className="font-semibold text-red-600">"{AssingmentInfo.title}"</span>.
              
          </p>
          <p className="text-xs text-slate-700 mt-[5px] ">
              This action cannot be undone.
          </p>
          </div>
          <div className="flex items-center justify-center  gap-4">
              <button
                  onClick={HandleDelete}
                  className="btn-Delete"
              >
                  Yes, Delete
              </button>
          </div>
      </div>
    </div>
  )
}

export default DeleteCard