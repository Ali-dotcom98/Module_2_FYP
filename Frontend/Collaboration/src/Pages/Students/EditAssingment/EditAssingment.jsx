import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AxiosInstance from '../../../Utility/AxiosInstance';
import { LuArrowLeft, LuDownload, LuSave, LuTrash2 } from 'react-icons/lu';
import TitleInput from '../../../Components/Inputs/TitleInput';
import StepProgress from '../../../Components/StepProgress';
import Modal from '../../../Layouts/Modal';
import { API_PATH } from '../../../Utility/ApiPath';
import socket from '../../../Utility/Data';
import {UserContext} from "../../../ContextApi/UserContext"
import DisplayQuestion from '../Components/DisplayQuestion';
const EditAssingment = () => {
    const navigator = useNavigate();
    const {AssingmentId } = useParams();
    const {User} = useContext(UserContext)
    const resumeRef = useRef();
    const {ChallengeID} = useParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorMsg, seterrorMsg] = useState("")
    const [isLoading, setisLoading] = useState(false)
    const [DeleteModel, setDeleteModel] = useState(false)
    const [baseWidth, setBaseWidth] = useState(800);
    const [Buffer, setBuffer] = useState(false)
    const [progress, setprogress] = useState(0)
    console.log("progress",progress);

    const [Join, setJoin] = useState("")

    

    const [DefaultInfo, setDefaultInfo] = useState({
            title : "",
            description : "",
            dueDate : "",
            totalMarks : "",
            difficulty : "",
            questions:[
                {
                    type : "",
                    questionText :"",
                    options : "",
                    marks : null ,
                    answer : ""
                }
            ],
            settings:{
                groupSettings:{
                    groupsDetail : [""],
                    numberOfGroups : "",
                    studentsPerGroup : "",
                    assignmentMode : ""
                },
                allowLateSubmission : false,
                visibility : ""
            }  
    
        })
    
const FetchAssingment = async()=>{
        try {
            const result = await AxiosInstance.get(API_PATH.ASSIGN.ASSINGMENTSID(AssingmentId))

            if(result.data){
                const data = result.data
                setDefaultInfo((prev)=>({
                    ...prev , 
                    title : data.title || prev.title,
                    description : data.description || prev.description,
                    dueDate : data.dueDate || prev.dueDate,
                    totalMarks : data.totalMarks || prev.totalMarks,
                    difficulty : data.difficulty || prev.difficulty,
                    questions : data.questions || prev.questions,
                    settings: {
                        ...prev.settings,              
                        ...data.settings,             
                        groupSettings: {
                            ...prev.settings.groupSettings,       
                            ...(data.settings?.groupSettings || {})
                        }
                    }


                }))
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>{
        FetchAssingment(); 
    },[])


    useEffect(()=>{
        socket.emit("Welcome", User)

        socket.on("Welcome", (msg)=>{
            setJoin(msg)
        })
        
    },[])



const NextQuestion = ()=>{
    
}
const RenderForm= ()=>{
    
}


const UpdateSectionPro = (sectionName , key , value)=>{
    
    setDefaultChlng((prev)=>(
    {
        ...prev,
        [sectionName]: {
            ...prev[sectionName],
            [key] : value
        }
    }))
     
}
const AddItemInArray = (section , value)=>{
    setDefaultChlng((prev)=>(
        {
            ...prev,
            [section] : [...prev[section], value]
        }
    ))
}
const removeArrayItem = (section, index) => {
  setDefaultChlng((prev) => {
    const updatedArray = [...prev[section]];
    updatedArray.splice(index, 1); 
    return {
      ...prev, 
      [section]: updatedArray,  
    };
  });
}; 

const updateArrayItem = (section , index ,key , value)=>{
    setDefaultChlng((prev)=>{
        const updateArray= [...prev[section]]
        if(key==null)
        {
            updateArray[index]= value
        }
        else{
            updateArray[index] = {
                ...updateArray[index],
                [key] : value
            }
        }
        return{
            ...prev,
            [section]: updateArray
        }
    })
}


const updateSection = (key , value)=>{
     setDefaultChlng((prev)=>(
        {
            ...prev,
            [key] : value
        }))     
}

const handleNext = () => {
  if (currentIndex < DefaultInfo.questions.length - 1) {
    setCurrentIndex(prev => prev + 1);
  }
};

const handleBack = () => {
  if (currentIndex > 0) {
    setCurrentIndex(prev => prev - 1);
  }
};


const goBack = ()=>{
   
    window.scrollTo({ top: 0, behavior: "smooth" });
}

const validateAndNext = (e) => {
    const errors = [];
};

const goToNextStep = ()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
}
const gotoHome = ()=>{
    navigator("/Student");
}


    return (
    <div className=" px-5 py-4 font-urbanist flex gap-3 ">
        <div className="hidden md:flex flex-col  items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4">
        
            <div className="flex flex-col items-center gap-4">
                <button
                className="btn-small-light"
                onClick={gotoHome}
                >
                <LuArrowLeft className="text-[16px]" />
                </button>

            </div>
            
            
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="h-[95vh] bg-white col-span-2 rounded-lg border border-purple-100 overflow-hidden relative">
                <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4  my-3 mx-2">
                    <h1>{DefaultInfo.title}</h1>
                    <div>
                        <p>0/{DefaultInfo.questions.length}</p>
                    </div>
                </div>
                <StepProgress progress= {progress} />
                <div className='grid grid-rows-4 w-full border h-[90%] px-3 py-4'>
                    <div className='row-span-3'>
                        {DefaultInfo.questions.length > 0 && (
                            <DisplayQuestion
                                item={DefaultInfo.questions[currentIndex]}
                                index = {currentIndex}
                            />
                            )}

                    </div>
                    <div className='row-span-1 border' >
            
                        {Join}
                    </div>
                    
                </div>
                
                
                {errorMsg && (
                <div className=" flex items-center text-[11px] gap-2 font-medium  justify-center text-amber-600 bg-amber-100 py-0.5 px-2 my-1 rounded ">
                    <LuCircleAlert className="text-md" />

                    {errorMsg}
                </div>
                )}

                
                <div className="absolute bottom-0  w-full">
                    <div className='flex px-5 py-3 gap-3 items-center justify-end'>
                        <button
                        onClick={handleBack}
                        disabled={currentIndex === 0}
                        className={`btn-small-light ${currentIndex === 0 ? "cursor-none opacity-50" : ""}`}
                        >
                        <LuArrowLeft className="text-[16px]" />
                        Back
                        </button>

                        <button
                        onClick={handleNext}
                        disabled={currentIndex === DefaultInfo.questions.length - 1}
                        className="btn-small flex items-center gap-2"
                        >
                        <LuArrowLeft className="text-[16px] rotate-180" />
                        Next
                        </button>
                    </div>
                </div>


            </div>
            <div  className="h-[95vh] w-full bg-gray-100 rounded-lg shadow">
                <div className='text-red-400'>
                    {Join}
                </div>
            </div>
        </div>
        <Modal
           
        >
        </Modal>
    </div>
    
    )
}   
export default EditAssingment