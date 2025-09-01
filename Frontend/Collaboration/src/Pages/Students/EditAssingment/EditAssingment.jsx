import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AxiosInstance from '../../../Utility/AxiosInstance';
import { LuArrowLeft, LuDownload, LuSave, LuTrash2 } from 'react-icons/lu';
import TitleInput from '../../../Components/Inputs/TitleInput';
import StepProgress from '../../../Components/StepProgress';
import Modal from '../../../Layouts/Modal';
import { API_PATH } from '../../../Utility/ApiPath';
import {UserContext} from "../../../ContextApi/UserContext"

import { SocketContext } from '../../../ContextApi/SocketContext';
import DisplayQuestion from '../Components/DisplayQuestion';
import axios from 'axios';
import { Send, Vote } from 'lucide-react';

const EditAssingment = () => {
    const socket = useContext(SocketContext);
    const navigator = useNavigate();
    const {AssingmentId } = useParams();
    const {User} = useContext(UserContext)

    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorMsg, seterrorMsg] = useState("")
    const [isLoading, setisLoading] = useState(false)

    const [progress, setprogress] = useState(0)
    const [Join, setJoin] = useState("")
    const [messages, setMessages] = useState([]);
    const [text, settext] = useState("")

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

    const [PartialSubmission, setPartialSubmission] = useState({

        Questions: [
            {
                type : "",
                questionText :"",
                options : "",
                marks : null ,
                answer : "",
                isLocked : false,
                lockedby : "",
                vote : ""
            }
        ],
        Students: [
            {
            name: "",
            status: "",
            }
        ],
        });
    console.log("PartialSubmission", PartialSubmission);
    

    const [SocketGroup, setSocketGroup] = useState("")

    
    
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

                    if (data.questions?.length > 0) {
                        await CreatePartialSubmission(data.questions, data.settings?.groupSettings?.groupsDetail);
                    }
                }
    
            } catch (error) {
                console.log(error);
                
            }
        }


    const CreatePartialSubmission   = async(questions , std)=>{
        try {
            const Questions = questions;
            const userGroup = std.find(group =>
            group.some(student => student._id.toString() === User._id)
            );
            const Isexist = await AxiosInstance.get(API_PATH.PARTIAL.SAVE(AssingmentId));
            console.log("Isexist",Isexist.data);
            
            if (!Isexist.data || Isexist.data.length === 0)
                {
                    const result = await AxiosInstance.post(API_PATH.PARTIAL.CREATE , {AssingmentId , Questions , userGroup  })
                    const PartailAssingment = result.data;
                    setPartialSubmission((prev)=>({
                        ...prev,
                        Questions: PartailAssingment.Questions || PartialSubmission.Questions,
                        Students: PartailAssingment.Students || PartialSubmission.Students, 

                    }))
                    return ;
                }
            
            setPartialSubmission((prev) => ({
                ...prev,
                Questions: (Isexist.data.Questions || PartialSubmission.Questions).map(q => ({
                    ...q,
                    vote: q.vote || ""  
                })),
                Students: Isexist.data.Students || PartialSubmission.Students, 
                }));

            

            

        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>{
        FetchAssingment();
    }, [])


    useEffect(() => {
    socket.emit("joinGroup", { assignmentId: AssingmentId, User: User });

    const handleUserJoined = ({ name, groupId }) => {
        setSocketGroup(groupId);
        setJoin(name);
    };

    const handleReceiveMessage = (User, text) => {
        setMessages(prev => [
            ...prev,
            { User: User._id, message: text, timestamp: new Date() },
        ]);
    };

    

    socket.on("userJoined", handleUserJoined);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
        socket.off("userJoined", handleUserJoined);
        socket.off("receiveMessage", handleReceiveMessage);
    };
}, [AssingmentId, User]);


    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!text.trim()) return; 

        socket.emit("sendMessage", {
            SocketGroup,
            User: User,
            message: text,
        });
            
        settext("");
    }


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
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-1">
            <div className="h-[95vh]  bg-white col-span-2 rounded-lg border border-purple-100 overflow-hidden relative">
                <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4  my-3 mx-2">
                    <h1>{DefaultInfo.title}</h1>
                    <div>
                        <p>0/{DefaultInfo.questions.length}</p>
                    </div>
                </div>  
                    
                <div className='grid grid-rows-4 w-full  h-[90%] px-3 py-4'>
                    <div className='row-span-3'>
                        {DefaultInfo.questions.length > 0 && (
                            <DisplayQuestion
                                item={PartialSubmission.Questions[currentIndex]}
                                index = {currentIndex}
                            />
                            )}
                    </div>
                    <div className='row-span-1 -translate-y-3 '>
                        {PartialSubmission.Questions[currentIndex]?.isLocked && (
                            <div className='border border-dashed rounded-md border-purple-200 flex items-center justify-between  px-3 gap-3 py-2'>
                                
                                <div className='w-full flex flex-col p-1 '>
                                    <p className="text-sm font-medium text-slate-600">Refinement Votes:</p>
                                    <div className='flex items-center gap-4'>
                                         <div             
                                            className={ `h-0.5 w-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-300`}
                                            style={{width : `${100}%`}}>

                                        </div>
                                        {PartialSubmission.Questions[currentIndex]?.vote ? (
                                            <span>{PartialSubmission.Questions[currentIndex].vote}</span>
                                        ) : (
                                            <span>0/5</span>
                                        )}
                                       
                                    </div>
                                </div>
                                <button className='btn-small-light'>
                                    <Vote className='size-4'/> <p>Vote</p>
                                </button>
                            </div>
                        )}
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
            <div className="h-[95vh] w-full bg-gray-100 rounded-lg shadow flex flex-col">
                <div className="flex-1 overflow-y-auto p-3 bg-white">
                    {messages.map((item, index) => (
                    <div
                        key={index}
                        className={`mb-2 max-w-xs px-3 py-2 rounded-lg ${
                        item.User === User._id
                            ? "ml-auto bg-purple-200 text-right"
                            : "mr-auto bg-gray-200 text-left"
                        }`}
                    >
                        {item.message}
                    </div>
                    ))}
                </div>

  <form
    className="relative p-3 bg-white border-t border-gray-300"
    onSubmit={handleSubmit}
  >
    <input
      className="w-full text-sm border border-purple-300 text-black outline-none px-3 py-2 rounded-md placeholder-gray-500 focus:border-purple-500"
      type="text"
      value={text}
      onChange={({ target }) => settext(target.value)}
      placeholder="Type a message..."
    />
    <button
      type="submit"
      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-purple-800"
    >
      <Send className="w-5 h-5" />
    </button>
  </form>
</div>

        </div>
        <Modal
           
        >
        </Modal>
    </div>
    
    )
}   
export default EditAssingment