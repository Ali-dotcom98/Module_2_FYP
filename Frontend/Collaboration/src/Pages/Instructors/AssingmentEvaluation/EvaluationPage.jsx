import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AxiosInstance from '../../../Utility/AxiosInstance';
import { LuArrowLeft, LuCircleAlert, LuDownload, LuSave, LuSaveAll, LuTrash2 } from 'react-icons/lu';

import Modal from '../../../Layouts/Modal';
import { API_PATH } from '../../../Utility/ApiPath';
import {UserContext} from "../../../ContextApi/UserContext"

import axios from 'axios';
import { Send, Slice, Vote } from 'lucide-react';
import moment from 'moment';

const EvaluationPage = () => {

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
                vote : []
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
    
    const CreatePartialSubmission   = async(questions , std)=>{
        try {
            const Questions = questions;
            const userGroup = std.find(group =>
            group.some(student => student._id.toString() === User._id)
            );
            const Isexist = await AxiosInstance.get(API_PATH.PARTIAL.SAVE(AssingmentId));
            
            if (!Isexist.data || Isexist.data.length === 0)
                {
                    const result = await AxiosInstance.post(API_PATH.PARTIAL.CREATE , {AssingmentId , Questions , userGroup  })
                    const PartailAssingment = result.data;
                    setPartialSubmission((prev)=>({
                        ...prev,
                        _id : PartailAssingment._id || PartialSubmission._id,
                        status : PartailAssingment.status || PartialSubmission.status,
                        Questions: PartailAssingment.Questions || PartialSubmission.Questions,
                        Students: PartailAssingment.Students || PartialSubmission.Students, 
                        SubmissionVote: PartailAssingment.SubmissionVote || PartialSubmission.SubmissionVote, 

                    }))
                    return ;
                }
            
            setPartialSubmission((prev) => ({
                ...prev,
                _id : Isexist.data._id || PartialSubmission._id,
                status : Isexist.data.status || PartialSubmission.status,
                SubmissionVote: Isexist.data.SubmissionVote ||  Isexist.data.SubmissionVote, 
                Questions: (Isexist.data.Questions || PartialSubmission.Questions).map(q => ({
                    ...q,
                    vote: q.vote || ""  
                })),
                Students: (Isexist.data.Students || PartialSubmission.Students).map(q =>({
                    ...q ,
                    online : q.online || false
                }))     
                }));

            

            

        } catch (error) {
            console.log(error);
            
        }
    }
    return (
    <div className=" px-5 py-4 font-urbanist flex gap-3 ">
        <div className="hidden md:flex flex-col  items-center justify-between gap-5 bg-white rounded-lg border border-purple-200 py-3 px-4">
        
            <div className="flex flex-col items-center justify-between h-full gap-4">
                <button
                className="btn-small-light"
                // onClick={gotoHome}
                >
                <LuArrowLeft className="text-[16px]" />
                </button>
                {/* <div className='flex gap-2 flex-col'>
                    {PartialSubmission.Students.map((item, index) => (
                        <div className='border rounded-full p-1 relative '>                    
                            <div key={index} className='border p-2 flex items-center justify-center rounded-full peer'>{item.name.slice(0, 2)}</div>
                            <div className={`absolute size-3  -translate-y-2 rounded-full ${item.online ? "bg-green-500": "bg-red-500"}`}></div>
                            <div className='bg-purple-200 px-3 py-1 text-sm absolute -translate-y-10 translate-x-14 rounded-lg z-30 opacity-0 peer-hover:opacity-100'>{item.name}</div>
                        </div>
                    ))}

                </div> */}
            </div>
            
            
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-1">
            <div className="h-[95vh]  bg-white col-span-2 rounded-lg border border-purple-200 overflow-hidden relative">
                {/* <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-300 py-3 px-4  my-3 mx-2">
                    <h1>{DefaultInfo.title}</h1>
                    <div>
                        <p>0/{DefaultInfo.questions.length}</p>
                    </div>
                </div>   */}
                    
                <div className='grid grid-rows-4 w-full  h-[90%] px-3 py-4'>
                    {/* <div className='row-span-3'>
                        {DefaultInfo.questions.length > 0 && (
                            <DisplayQuestion
                                item={PartialSubmission.Questions[currentIndex]}
                                index = {currentIndex}
                                updateArrayItem = {updateArrayItem}
                                WhoIsAnswering = {WhoIsAnswering}
                                DisplayAnswer ={DisplayAnswer}
                                DisableQuestionbyIndex ={DisableQuestionbyIndex}
                                HandleSave ={HandleSave}
                            />
                            )}
                    </div> */}
                    
                </div>
        
                
                <div className="absolute bottom-0  w-full">
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
                                // onClick={handleBack}
                                disabled={currentIndex === 0}
                                className={`btn-small-light ${currentIndex === 0 ? "cursor-none opacity-50" : ""}`}
                                >
                                <LuArrowLeft className="text-[16px]" />
                                Back
                            </button>

                            {/* <div>
                                {
                                    currentIndex === DefaultInfo.questions.length - 1
                                    ?(
                                        <>
                                            <button
                                            className="btn-small flex items-center gap-2"
                                            onClick={ManageSubmission}
                                            disabled={VerifySubmission()}
                                            >   
                                                <LuSaveAll className="text-[16px] rotate-180"/>
                                                Submit
                                                <div className='flex text-sm font-medium '>
                                                    <p>{(PartialSubmission.SubmissionVote.length)}</p>/
                                                    <p>{PartialSubmission.Students.length}</p>
                                                </div>
                                            </button>
                                        </>
                                        
                                    )
                                    :(
                                        <>
                                            <button
                                            className="btn-small flex items-center gap-2"
                                            onClick={handleNext}
                                            disabled={currentIndex === DefaultInfo.questions.length - 1}
                                            
                                            >   
                                            <LuArrowLeft className="text-[16px] rotate-180" />
                                            Next
                                            </button>
                                        </>
                                    )
                                }
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[95vh] w-full bg-gray-100 rounded-lg shadow flex flex-col">
               

            
            </div>

        </div>
        <Modal
           
        >
        </Modal>
    </div>
    
    )
}   
export default EvaluationPage