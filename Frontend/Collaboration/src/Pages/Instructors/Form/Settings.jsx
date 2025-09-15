import React, { useEffect, useState } from 'react'
import Input from '../../../Components/Inputs/Input'
import Modal from '../../../Layouts/Modal'
import AxiosInstance from '../../../Utility/AxiosInstance'
import { API_PATH } from '../../../Utility/ApiPath'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { LuCircleAlert } from 'react-icons/lu'


const Settings = ({allowLateSubmission,visibility,groupsDetail,studentsPerGroup,assignmentMode,numberOfGroups,UpdateSection}) => {
  const [displayGroups, setdisplayGroups] = useState(false)
  const [studentPerGroup, setstudentPerGroup] = useState(studentsPerGroup || 0)

  
  const [groups, setgroups] = useState(0)
  
  const [groupedStudents, setGroupedStudents] = useState([]);

  const [studentPool, setStudentPool] = useState([]); // unassigned students
  const [groupsDetails, setGroupsDetails] = useState([]);

  const [error, seterror] = useState("")

  console.log("groupsDetail",groupsDetail);

  
  


  

  

  
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

  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  )
    return;

  let updatedGroups = [...groupsDetails]; 
  let updatedPool = [...studentPool]
  let movedStudent;

  
  if (source.droppableId === "studentPool") {
    movedStudent = updatedPool[source.index];
    updatedPool.splice(source.index, 1);
  } else {
    const sourceGroupIndex = parseInt(source.droppableId, 10);
    movedStudent = updatedGroups[sourceGroupIndex][source.index];
    updatedGroups[sourceGroupIndex].splice(source.index, 1);
  }

  
  if (destination.droppableId !== "studentPool" && studentPerGroup > 0) {
    const destGroupIndex = parseInt(destination.droppableId, 10);
    const destGroup = updatedGroups[destGroupIndex];

    console.log("Checking group capacity", {
      destGroupSize: destGroup.length,
      limit: studentPerGroup,
    });

    if (destGroup.length >= studentPerGroup) {
      alert(
        `Group ${destGroupIndex + 1} already has max ${studentPerGroup} students`
      );
      return;
    }
  }


  if (destination.droppableId === "studentPool") {
    updatedPool.splice(destination.index, 0, movedStudent);
  } else {
    const destGroupIndex = parseInt(destination.droppableId, 10);
    updatedGroups[destGroupIndex].splice(destination.index, 0, movedStudent);
  }

  setStudentPool(updatedPool);
  setGroupsDetails(updatedGroups);
};




useEffect(() => {
  setgroups(numberOfGroups);
  if (groupsDetail) {
    setGroupedStudents(groupsDetail);
  }
}, [numberOfGroups]);




  useEffect(() => {

  if (studentPerGroup > 0) {
    const calculatedGroups = Math.ceil(student.length / studentPerGroup);
    setgroups(calculatedGroups)
    UpdateSection("groupSettings", "numberOfGroups", Number(calculatedGroups));
  } 
}, [studentPerGroup, student.length]);


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
    setGroupsDetails(Array.from({ length: groups > 0 ? groups : 1 }, () => []));
  }
}, [assignmentMode, student, groups]);

const handleView = ()=>{
  if(studentPerGroup == 0 )
    return seterror("Students Per Group is required")
  else
    setdisplayGroups(true)
}

useEffect(() => {
  if (!error) return;

  const timeout = setTimeout(() => {
    seterror("");
  }, 3000);

  return () => clearTimeout(timeout);
}, [error]);




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
                <select value={visibility} onChange={({target})=>UpdateSection(null , "visibility",target.value)} className='p-3 bg-slate-50 relative outline-none rounded-md border z-10'  name="" id="">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>
            <div>
                <label htmlFor=""  className="font-medium">Total Students</label>
                <input type="text" className='p-3 pr-10 border bg-slate-50 outline-none rounded-md w-full' disabled= {true} value={student.length} name="" id="" />

            </div>
          </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                  value={studentsPerGroup}
                  onchange={({ target }) => {
                    const val = Number(target.value); 
                    UpdateSection("groupSettings", "studentsPerGroup", val);
                    setstudentPerGroup(val);
                  }}
                  label="Student per Group"
                  placeholder="2"
                  type="Number"
                />

                  <Input
                value={numberOfGroups}
                label="Groups"
                placeholder="3"
                type="Number"
                disabled= {true}

                />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col space-y-1.5 '>
                  <label htmlFor=""  className="font-medium">Assingment Mode</label>
                  <select value={assignmentMode} onChange={({target})=>UpdateSection("groupSettings","assignmentMode",target.value)} className='p-3 border bg-slate-50 relative outline-none rounded-md' name="" id="">
                      <option value="random">Random</option>
                      <option value="instructor">Instructor</option>
                  </select>
                </div>
                <div className='flex flex-col space-y-1.5 '>
                  <label htmlFor=""  className="font-medium">Group Details</label>
                  <button className='btn-primary' onClick={handleView}>View</button>
                </div>
                {error && (
                  <div className=" flex items-center text-[11px] gap-2 font-medium  justify-center text-amber-600 bg-amber-100 py-0.5 px-2 my-1 rounded ">
                      <LuCircleAlert className="text-md" />
                      {error}
                  </div>
                  )} 

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
                <div className="w-full">
                  <div className={`flex flex-col space-y-4 mt-3 h-full min-w-max`}>
                    {groupedStudents.map((grp, index) => (
                      <div
                        key={index}
                        className="col-span-1 bg-purple-50 mx-5 rounded-2xl shadow-md p-4 min-w-[220px] transition hover:shadow-lg"
                      >
                        <h1 className="text-md font-semibold bg-purple-300  mb-3 border-b  p-2 rounded-md">
                          Group {index + 1}
                        </h1>
                        {grp.map((st, i) => (
                          <div
                            key={i}
                            className="border border-purple-400  rounded-lg px-3 py-2 my-2  transition"
                          >
                            {st.name}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end py-6">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => HandleSave("random")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}



              {assignmentMode === "instructor" && (
  <DragDropContext onDragEnd={handleDragEnd}>
    {/* Student Pool */}
    <Droppable droppableId="studentPool" direction="vertical">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="border mx-5  border-purple-300 bg-purple-300 rounded-2xl p-4 w-1/4 overflow-y-auto flex flex-col justify-between shadow-md"
        >
          <div>
            <h2 className="text-lg font-semibold  text-white  mb-3 border-b pb-2">
              All Students
            </h2>
            {studentPool.map((st, index) => (
              <Draggable key={st._id} draggableId={st._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="border border-purple-800 bg-purple-100  rounded-lg px-3 py-2 mb-2  transition"
                  >
                    {st.name}
                  </div>
                )}
              </Draggable>
            ))}
          </div>

          {provided.placeholder}
          <div className="flex items-center justify-center mt-4">
            <button
              onClick={() => HandleSave("Instructor")}
              className={`px-4 py-2 rounded-xl shadow transition-colors duration-200 ${
                studentPool.length === 0
                  ? "bg-white text-gray-600 hover:bg-slate-200"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              disabled={studentPool.length > 0}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </Droppable>

    {/* Groups */}
    <div className="flex gap-6 w-3/4 overflow-x-auto pl-4">
      {groupsDetails.map((students, groupIndex) => (
        <Droppable droppableId={`${groupIndex}`} key={groupIndex}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="border border-purple-400  rounded-2xl p-4 min-w-[220px] bg-purple-50 shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold  mb-3 border-b pb-2 border-purple-400">
                Group {groupIndex + 1}
              </h3>
              {students.map((student, studentIndex) => (
                <Draggable
                  draggableId={student._id}
                  index={studentIndex}
                  key={student._id}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border border-green-400 rounded-lg px-3 py-2 mb-2 bg-green-200    transition"
                    >
                      {student.name}
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