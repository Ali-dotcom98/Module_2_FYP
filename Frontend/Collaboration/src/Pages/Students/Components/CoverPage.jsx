import moment from 'moment';
import React from 'react'


const CoverPage = ({DefaultInfo ,Students ,SubmittedTo}) => {

  return (
    <div className="relative w-full h-screen bg-white flex flex-col border rounded-lg">
      {/* Top section with title */}
      <div className="flex-1 flex flex-col justify-center px-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-light text-gray-800 mb-4">
            {DefaultInfo?.title}
          </h1>
          
          {/* Underline */}
          <div className="w-full h-px bg-gray-400 mb-6 "></div>
          
          <p className="text-gray-600 font-medium tracking-wide mt-4">
            <h1 className="text-md font-medium  text-gray-800 mb-4">
                Students
            </h1>
            <ol className="px-5 mb-2 space-y-1">
            {Students.map((item , index) => (
                <li key={item.id} className='flex'><p className='w-5'>{index+1}</p><p>{item.name}</p></li>
            ))}
            </ol>
            
          </p>
          {/* <p className='text-gray-600 font-medium mt-4'>
            <h1 className='text-md font-medium  text-gray-800'>Submitted to :</h1>
            <p className='w-full  p-3 flex items-center justify-center space-x-3'>
                <p>{SubmittedTo.email}</p>
                <h1>{SubmittedTo?.name}</h1>
            </p>
        </p> */}
        </div>
      </div>

      {/* Bottom colored section */}
      <div className="relative h-32 -translate-y-5">
        {/* Blue stripe */}
        <div className="absolute top-1 w-full h-3 bg-[#6c63ff] "></div>
        
        {/* Orange section */}
        <div className="absolute bottom-0 left-0 w-full h-28  bg-gradient-to-r from-purple-500 to-purple-700 ">
          <div className="flex items-end h-full px-8 pb-4">
            <div className="text-white text-xs space-y-2">
              <div className="font-semibold">{moment(DefaultInfo.dueDate).format("Do MMM YYYY")}</div>
              <div className="opacity-90">Platform CodeAscend</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoverPage