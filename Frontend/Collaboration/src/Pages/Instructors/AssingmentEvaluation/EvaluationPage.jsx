import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import AxiosInstance from '../../../Utility/AxiosInstance';
import { LuArrowLeft, LuCircleAlert, LuDownload, LuSave, LuSaveAll, LuTrash2 , LuCommand, LuMessageCircle } from 'react-icons/lu';

import Modal from '../../../Layouts/Modal';
import { API_PATH } from '../../../Utility/ApiPath';
import {UserContext} from "../../../ContextApi/UserContext"

import axios from 'axios';
import { Send, Slice, Vote } from 'lucide-react';
import moment from 'moment';
import DisplayQuestion from '../../Students/Components/DisplayQuestion';
import { FaComment, FaCommentAlt } from 'react-icons/fa';
import TitleInput from '../../../Components/Inputs/TitleInput';

const EvaluationPage = () => {
    const location = useLocation();
    const navigator = useNavigate();

    const { AssingmentTitle } = location.state || {};

    const {SubmissionID } = useParams();
    const {User} = useContext(UserContext)

    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorMsg, seterrorMsg] = useState("")
    const [isLoading, setisLoading] = useState(false)


    const [progress, setprogress] = useState(0)
    const [Join, setJoin] = useState("")
    const [messages, setMessages] = useState([]);
    const [text, settext] = useState("")
    const [typingUser, settypingUser] = useState("")
    const [WhoIsAnswering, setWhoIsAnswering] = useState("")
    const [DisplayAnswer, setDisplayAnswer] = useState(false)
    const [displayTyping, setdisplayTyping] = useState(false)
    const [DisableQuestionbyIndex, setDisableQuestionbyIndex] = useState(null)
    const [tagUser, settagUser] = useState(false)
    
    const [PartialSubmission, setPartialSubmission] = useState({
        _id: "",
        Questions: [
            {
                type : "",
                questionText :"",
                options : "",
                marks : null ,
                answer : "",
                isLocked : false,
                lockedby : "",
                vote : [],
                obtainedMarks: 0,
                suggestion: "",
                rating:""
            }
        ],
        Students: [
            {
            name: "",
            status: "",
            online : false,
            }
        ],
        status: "",
        obtainedMarks:  0 ,
        feedback: "",
        isPassed:  false,
        SubmissionVote: [],
        });
    console.log("PartialSubmission", PartialSubmission);
    
    const FetchPartialSubmissions = async()=>{
        try {
            const response = await AxiosInstance.get(API_PATH.PARTIAL.GET_STUDENTS_SUBMISSION(SubmissionID));
        
            
            if (response.data)
                {
                    const PartailAssingment = response.data; 
                    setPartialSubmission((prev)=>({
                        ...prev,
                        _id : PartailAssingment?._id || PartialSubmission._id,
                        status : PartailAssingment?.status || PartialSubmission.status,
                        Questions: PartailAssingment?.Questions || PartialSubmission.Questions,
                        Students: PartailAssingment?.Students || PartialSubmission.Students, 
                        SubmissionVote: PartailAssingment?.SubmissionVote || PartialSubmission.SubmissionVote, 
                        obtainedMarks:  PartailAssingment?.obtainedMarks || PartialSubmission.obtainedMarks ,
                        feedback: PartailAssingment?.feedback || PartialSubmission.feedback ,
                        isPassed:  PartailAssingment?.isPassed || PartialSubmission.isPassed ,
                    }))
                    return ;
                }
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>{
        FetchPartialSubmissions();
    },[])

    const handleNext = ()=>{
        if(currentIndex < PartialSubmission.Questions.length)
        {
            setCurrentIndex((prev)=>prev+1)
        }
    }
    const handleBack = ()=>{
        if(currentIndex > 0 )
        {
                setCurrentIndex((prev)=>prev-1)
        }
    }

    

    const handleSave = (currentIndex , key , val)=>{
        setPartialSubmission((prev)=>{
            const update = [...prev.Questions]
            update[currentIndex]={
                ...update[currentIndex],
                [key] : val
            }
            
            return{
                ...prev,
                Questions : update
            }
        })
    }

    const updateArrayItemInstructor = (index, key, value) => {
    setPartialSubmission((prev) => {
        const updateArray = [...prev.Questions];

        updateArray[index] = {
            ...updateArray[index],
            [key]: value,
        };

        return {
        ...prev,
        Questions: updateArray,
        };
    });
};

 const gotoHome = ()=>{
        navigator("/Instructor/CreateAssingment")
    }
const HandleSave = async () => {
    try {
        setisLoading(true);
        await AxiosInstance.put(
            API_PATH.PARTIAL.SAVE_BY_INSTRUCTOR(SubmissionID),
        { PartialSubmission }
        );
        console.log("Saving done, navigating...");
        
    } catch (error) {
        console.error("Save failed:", error);
    } finally {
        setisLoading(false);
    }
};


    return (
    <div className="container mx-auto font-urbanist">
        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4 mt-4">
        
            <div className="flex items-center gap-4">
                <button
                className="btn-small-light"
                // onClick={gotoHome}
                >
                <LuArrowLeft className="text-[16px]" />
                <span className="hidden md:block">Home</span>
                </button>
            </div>
            
            <div className="flex items-center gap-4">

                <button
                className="btn-small-light "
                // onClick={() => setOpenPreviewModal(true)}
                >
                <LuDownload className="text-[16px]" />
                <span className="hidden md:block ">Preview & Download</span>
                </button>
            </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
            <div className="h-[95vh]  bg-white col-span-3 rounded-lg border border-purple-200 overflow-hidden relative">
                <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-300 py-3 px-4  my-3 mx-2">
                    <h1>{AssingmentTitle}</h1>
                    
                </div>  
                    
                <div className='grid grid-rows-4 w-full  h-[90%] px-3 py-4 md:gap-2'>
                    <div className='row-span-3'>
                        {PartialSubmission.Questions.length > 0 && (
                            <DisplayQuestion
                                item={PartialSubmission.Questions[currentIndex]}
                                index = {currentIndex}
                                updateArrayItemInstructor = {updateArrayItemInstructor}
                                handleSave ={handleSave}
                            />
                            )}
                    </div>
                    <div className='row-span-1 -translate-y-3 '>
                        <div className='border border-dashed rounded-md border-purple-300 flex items-center justify-between  px-3 gap-3  py-1'>
                            <div className='flex w-full  items-center gap-2 justify-center p-1'>
                                <label className="btn-small-light">
                                    <LuMessageCircle className="text-[16px]" />
                                    Suggestion
                                    
                                </label>
                                <input onChange={({target})=>handleSave(currentIndex, "suggestion",target.value)} value={PartialSubmission.Questions[currentIndex]?.suggestion || ""}
                                        placeholder='Comment here' className='placeholder:italic  placeholder:font-medium w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-2.5 rounded-md mt-2 placeholder:text-gray-500 focus-within:border-purple-300' type="text"  />
                                
                            </div>
                            
                        </div>
                    </div>
                    
                </div>
        
                
                <div className="absolute bottom-0   w-full">
                    <div className={`${errorMsg ? "flex items-center justify-between w-full":"" }`}>
                        {
                            errorMsg && (
                                <div className="w-full ml-3 h-fit flex items-center text-[11px] gap-2 font-medium  justify-center text-amber-600 bg-amber-100 py-0.5 px-2 my-1 rounded ">
                                <LuCircleAlert className="text-md" />
                                {errorMsg}
                            </div>
                            )
                        }
                       
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
                                    className="btn-small-light flex items-center gap-2 border"
                                    onClick={HandleSave}
                                    disabled={isLoading}
                                >
                                    <LuSave className="text-[16px]" />
            
                                    {isLoading ? "Updating..." : "Save & Exit"}
                            </button>

                            <div>
                                <button
    
                                    className={`btn-small flex items-center gap-2 ${currentIndex === PartialSubmission.Questions.length - 1 ? "cursor-none opacity-50" : ""}`}
                                    onClick={handleNext}
                                    disabled={currentIndex === PartialSubmission.Questions.length - 1}
                                    
                                    >   
                                    <LuArrowLeft className="text-[16px] rotate-180" />
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[95vh] w-full col-span-2 bg-gray-100 rounded-lg shadow flex flex-col">

            </div>

        </div>
        <Modal
           
        >
        </Modal>
    </div>
    
    )
}   
export default EvaluationPage