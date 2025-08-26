import React, { useEffect, useState } from 'react'
import Input from '../../../Components/Inputs/Input'
import Modal from '../../../Layouts/Modal'
import AxiosInstance from '../../../Utility/AxiosInstance'
import { API_PATH } from '../../../Utility/ApiPath'

const Settings = ({allowLateSubmission,visibility,groupsDetail,studentsPerGroup,assignmentMode,numberOfGroups,UpdateSection}) => {
  const [displayGroups, setdisplayGroups] = useState(false)
  const [student, setstudent] = useState([])
  const fetchStudent = async()=>{
    try {
      const result  =await AxiosInstance.get(API_PATH.ASSIGN.GETSTUDENTS);
      setstudent(result.data.Students)
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
    fetchStudent();
  },[])

  return (
    <div className="px-5 pt-5 min-h-[32vw]">
        <h2 className="text-lg  font-semibold text-gray-900">Settings</h2>

        <div className="mt-4">
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center justify-start my-3 gap-4 '>
                  <label htmlFor=""  className="font-medium">Allow Late Submission</label>
                  <input type="checkbox" checked={allowLateSubmission} onChange={({target})=>UpdateSection(null , "allowLateSubmission", target.checked)} name="" id="" />
                </div>
                

            </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-3'>
            <div className='flex flex-col  '>
                <label htmlFor=""  className="font-medium">Visibility</label>
                <select value={visibility} onChange={({target})=>UpdateSection(null , "visibility",target.value)} className='p-3 bg-slate-50 relative outline-none rounded-md' name="" id="">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>
            <div>
                <label htmlFor=""  className="font-medium">Total Students</label>
                <input type="text" className='p-3 pr-10 bg-slate-50 outline-none rounded-md w-full' disabled= {true} value={student.length} name="" id="" />

            </div>
          </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                value={studentsPerGroup}
                onchange={({ target }) => UpdateSection("groupSettings","studentsPerGroup", target.value)}
                label="Student per Group"
                placeholder="2"
                type="Number"
                />
                  <Input
                value={numberOfGroups}
                onchange={({ target }) => UpdateSection("groupSettings","numberOfGroups", target.value)}
                label="Groups"
                placeholder="3"
                type="Number"
                />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col space-y-1.5 '>
                  <label htmlFor=""  className="font-medium">Assingment Mode</label>
                  <select value={assignmentMode} onChange={({target})=>UpdateSection("groupSettings","assignmentMode",target.value)} className='p-3 bg-slate-50 relative outline-none rounded-md' name="" id="">
                      <option value="random">Random</option>
                      <option value="instructor">Instructor</option>
                  </select>
                </div>
                <div className='flex flex-col space-y-1.5 '>
                  <label htmlFor=""  className="font-medium">Group Details</label>
                  <button className='btn-primary' onClick={()=>setdisplayGroups(true)}>View</button>
                </div>

            </div>
        </div>
        <Modal
            isOpen = {displayGroups}
            onClose = {()=> setdisplayGroups((prev)=>!prev)}
            title={`Groups`}
            type={"Groups"}
        >
            <div className='flex w-full px-5 h-full'>
              <div className='border w-full'>
                <div className={`grid grid-cols-${student.length} h-full`}>
                  {
                    [...Array(student.length)].map((_,index)=>(
                      <div className='col-span-1 border'>
                          <h1 className='font-medium '>Group {index+1}</h1>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className='border w-1/4 p-3'>
                <div className='grid grid-cols-2'>
                  {
                    student.map((item)=>(
                      <div className=' border rounded-full w-fit px-4 py-3'>
                        {
                          item.name.slice(0,2)
                        }
                      </div>

                    ))
                  }
                </div>
              </div>
            </div>

        </Modal>
    </div>
  )
}

export default Settings