import React, { useEffect, useState } from 'react'
import Input from '../../../Components/Inputs/Input'
import Modal from '../../../Layouts/Modal'
import AxiosInstance from '../../../Utility/AxiosInstance'
import { API_PATH } from '../../../Utility/ApiPath'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';


const Settings = ({allowLateSubmission,visibility,groupsDetail,studentsPerGroup,assignmentMode,numberOfGroups,UpdateSection}) => {
  const [displayGroups, setdisplayGroups] = useState(false)
  const [studentPerGroup, setstudentPerGroup] = useState(0)
  const [groups, setgroups] = useState(0)
  
  const [groupedStudents, setGroupedStudents] = useState([]);

  const [studentPool, setStudentPool] = useState([]); // unassigned students
  const [groupsDetails, setGroupsDetails] = useState([]);


  console.log("groupsDetails",groupsDetails);
  console.log("studentPool",studentPool);
  
  


  

  

  
  const [student, setstudent] = useState([])
  const fetchStudent = async()=>{
    try {
      const result  =await AxiosInstance.get(API_PATH.ASSIGN.GETSTUDENTS);
      setstudent(result.data.Students)
    } catch (error) {
      console.log(error);
      
    }
  }

  const HandleSave = (mode)=>{
    if(mode == "random")
    {
      UpdateSection("groupSettings","groupsDetail", groupedStudents)
    }
    else
    {
      UpdateSection("groupSettings","groupsDetail", groupsDetails)
    }
   
    setdisplayGroups(false);  
  }

  const handleDragEnd = (result) => {
  if (!result.destination) return;

  const { source, destination } = result;

  // same place? do nothing
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) return;

  let updatedGroups = [...groupsDetails];
  let updatedPool = [...studentPool];
  let movedStudent;

  // Remove student from source
  if (source.droppableId === "studentPool") {
    movedStudent = updatedPool[source.index];
    updatedPool.splice(source.index, 1);
  } else {
    movedStudent = updatedGroups[parseInt(source.droppableId)].students[source.index];
    updatedGroups[parseInt(source.droppableId)].students.splice(source.index, 1);
  }

  // --- Check if destination group is full
  if (destination.droppableId !== "studentPool") {
    const destGroup = updatedGroups[parseInt(destination.droppableId)];
    if (destGroup.students.length >= Number(studentPerGroup)) {
      // put student back to original list
      if (source.droppableId === "studentPool") {
        updatedPool.splice(source.index, 0, movedStudent);
      } else {
        updatedGroups[parseInt(source.droppableId)].students.splice(source.index, 0, movedStudent);
      }
      alert(`Group ${parseInt(destination.droppableId) + 1} already has max ${studentPerGroup} students`);
      return;
    }
  }

  // Add student to destination
  if (destination.droppableId === "studentPool") {
    updatedPool.splice(destination.index, 0, movedStudent);
  } else {
    updatedGroups[parseInt(destination.droppableId)].students.splice(destination.index, 0, movedStudent);
  }

  setStudentPool(updatedPool);
  setGroupsDetails(updatedGroups);
};


  useEffect(()=>{
    {
      (student.length % studentPerGroup) == 0 ? setgroups(student.length / studentPerGroup) : setgroups(0)
    }
  },[studentPerGroup])
  useEffect(()=>{
    fetchStudent();
  },[])
  


  const shuffleArray = (array) => {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

useEffect(() => {
  if (assignmentMode === "random" && studentPerGroup > 0 && student.length > 0) {
    const shuffled = shuffleArray(student);
    let tempGroups = [];

    for (let i = 0; i < groups; i++) {
      tempGroups.push(shuffled.slice(i * studentPerGroup, (i + 1) * studentPerGroup));
    }

    setGroupedStudents(tempGroups);
  }
}, [studentPerGroup, groups, assignmentMode, student]);

useEffect(() => {
  if (assignmentMode === "instructor" && student.length > 0) {
    setStudentPool(student);
    setGroupsDetails(Array.from({ length: groups }, () => ({ students: [] })));
  }
}, [assignmentMode, student, groups]);



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
                onchange={({ target }) => (UpdateSection("groupSettings","studentsPerGroup", target.value) ,setstudentPerGroup(target.value))}
                label="Student per Group"
                placeholder="2"
                type="Number"
                />
                  <Input
                value={groups}
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
            isOpen={displayGroups}
            onClose={() => setdisplayGroups((prev)=>!prev)}
            title="Groups"
            type="Groups"
          >
            <div className="flex w-full h-full">
              {assignmentMode === "random" && (
              <div className=" w-full ">
                <div className={`grid grid-cols-${groups} gap-4 h-full min-w-max`}>
                  {groupedStudents.map((grp, index) => (
                    <div key={index} className="col-span-1 p-2 min-w-[200px]">
                      <h1 className="font-medium mb-2">Group {index + 1}</h1>
                      {grp.map((st, i) => (
                        <div key={i} className="border rounded px-2 py-1 my-1">
                          {st.name}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className='flex items-center justify-end py-4'>
                  <button className='btn-small' onClick={()=>HandleSave("random")}>Save</button>
                </div>
            </div>
          )}


              {assignmentMode === "instructor" && (
                // ✅ Instructor Mode (drag and drop)
                <DragDropContext onDragEnd={handleDragEnd}>
                  {/* Student Pool */}
                  <Droppable droppableId="studentPool" direction="vertical" isDropDisabled={groupsDetails.length >= Number(studentPerGroup)}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="border p-3 w-1/4 overflow-y-auto flex flex-col items-center justify-between"
                      >
                        <div>
                          <h2 className="font-bold mb-2">All Students</h2>
                        {studentPool.map((st, index) => (
                          <Draggable key={st._id} draggableId={st._id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border rounded px-2 py-1 mb-2 bg-gray-100"
                              >
                                {st.name}
                              </div>
                            )}
                          </Draggable>

                        ))}
                        </div>
                        
                        {provided.placeholder}
                        <div className='flex items-center justify-center'>
                          <button onClick={()=>HandleSave("Instructor")} className={`${studentPool==0 ?"btn-small":"btn-small-light"}`} disabled={studentPool.length > 0}
                            >Save</button>
                        </div>
                      </div>
                      
                    )}
                  </Droppable>

                  {/* Groups */}
                  <div className="flex gap-4 w-3/4 overflow-x-auto">
                    {groupsDetails.map((group, gIndex) => (
                      <Droppable key={gIndex} droppableId={`${gIndex}`} direction="vertical">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="border p-3 min-w-[200px]"
                          >
                            <h3 className="font-medium mb-2">Group {gIndex + 1}</h3>
                            {group.students.map((st, sIndex) => (
                              <Draggable key={st._id} draggableId={`${st._id}-${gIndex}`} index={sIndex}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="border rounded px-2 py-1 mb-2 bg-green-100"
                                  >
                                    {st.name}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </DragDropContext>

              )}
            </div>
        </Modal>

    </div>
  )
}

export default Settings