import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AxiosInstance from '../../../Utility/AxiosInstance';
import { LuArrowLeft, LuCircleAlert, LuDownload, LuSave, LuSaveAll, LuTrash2 } from 'react-icons/lu';
import TitleInput from '../../../Components/Inputs/TitleInput';
import StepProgress from '../../../Components/StepProgress';
import Modal from '../../../Layouts/Modal';
import { API_PATH } from '../../../Utility/ApiPath';
import {UserContext} from "../../../ContextApi/UserContext"

import { SocketContext } from '../../../ContextApi/SocketContext';
import DisplayQuestion from '../Components/DisplayQuestion';
import axios from 'axios';
import { Send, Slice, Vote } from 'lucide-react';
import moment from 'moment';

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
    const [typingUser, settypingUser] = useState("")
    const [WhoIsAnswering, setWhoIsAnswering] = useState("")
    const [DisplayAnswer, setDisplayAnswer] = useState(false)
    const [displayTyping, setdisplayTyping] = useState(false)
    const [DisableQuestionbyIndex, setDisableQuestionbyIndex] = useState(null)
    const [tagUser, settagUser] = useState(false)
    
    
    

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
    

    const [SocketGroup, setSocketGroup] = useState("")
    const [voteCount, setvoteCount] = useState(0)
    
    
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

    useEffect(()=>{
        FetchAssingment();
    }, [])

useEffect(() => {
    socket.emit("joinGroup", { assignmentId: AssingmentId, User: User });

    const handleUserJoined = ({ name, groupId , id }) => {
        setSocketGroup(groupId);
        setJoin(name);        
    };

    const handleReceiveMessage = (User, text) => {
        setMessages(prev => [
            ...prev,
            { User: User._id, message: text, timestamp: new Date() },
        ]);
    };

    socket.on("userTyping", (User , Flag)=>{
        settypingUser(User.name)
        setdisplayTyping(Flag)
    })

    socket.on("updateOnlineStatus", (onlineUserIds) => {
        setPartialSubmission(prev => ({
            ...prev,
            Students: prev.Students.map(student => ({
            ...student,
            online: onlineUserIds.includes(student._id)
            }))
        }));
});

    socket.on("Answering", (User , CurrentQuestion ,answer,  Flag )=>{
        setDisplayAnswer(Flag)
        setWhoIsAnswering(User)
        setDisableQuestionbyIndex(CurrentQuestion)
        setPartialSubmission((prev)=>{
            const updateArray = [...prev.Questions]
            const key = "answer"
            updateArray[CurrentQuestion]={
                ...updateArray[CurrentQuestion],
                [key] : answer
            }
            return(
                {
                    ...prev , 
                    Questions: updateArray,
                    SubmissionVote : []
                }
            )
        })

    })

    socket.on("SaveBy", (User , CurrentQuestion)=>{
        setPartialSubmission((prev)=>{
            const updateArray = [...prev.Questions];

            updateArray[CurrentQuestion] ={
                ...updateArray[CurrentQuestion],
                isLocked : true,
                lockedby : User
            }
            return (
                {
                    ...prev ,
                    Questions : updateArray
                }
            )
        })
        handleBlur()
    })
    

    socket.on("UpdateVotes", (User , CurrentQuestion)=>{
        setPartialSubmission((prev)=>{
            const updateArray = [...prev.Questions]

            updateArray[CurrentQuestion].vote  = [...updateArray[CurrentQuestion].vote , User._id]
            return (
                {
                    ...prev,
                    Questions : updateArray
                }
            )
        })
    })

    socket.on("UpdateSubmissionVote", (User , Redirect)=>{
        if(Redirect)
        {
            navigator("/Student")
        }
        setPartialSubmission((prev)=>({
            ...prev,
            SubmissionVote : [...prev.SubmissionVote , User._id]
        }))
    })

    socket.on("ResetVotesArray", ()=>{
    
        setPartialSubmission((prev)=>({
            ...prev,
            SubmissionVote : []
        }))
    })

    socket.on("userJoined", handleUserJoined);
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
        socket.off("userJoined", handleUserJoined);
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("userTyping")
        socket.off("updateOnlineStatus")
        socket.off("Answering")
        socket.off("SaveBy")
        socket.off("UpdateVotes")
        socket.off("UpdateSubmissionVote")
        socket.off("ResetVotesArray")

        
    };
    }, [AssingmentId, User]);

useEffect(() => {
    const totalStudents = PartialSubmission?.Students?.length || 0;

    if (voteCount >= (totalStudents / 2) && totalStudents > 0) {
        setPartialSubmission((prev) => {
            const update = [...prev.Questions];
            update[currentIndex] = {
                ...update[currentIndex],
                answer: "",
                isLocked: false,
                lockedby: null,
                vote: []
            };
            const UpdateSubmission =  {
                ...prev,
                Questions: update
            };
            socket.emit("ResetVotes", SocketGroup);
        
            return UpdateSubmission
        });

        
    }
}, [voteCount, currentIndex, PartialSubmission?.Students?.length]);

useEffect(() => {
    if(PartialSubmission)
    {
        setvoteCount(PartialSubmission.Questions[currentIndex]?.vote?.length)
    }
}, [PartialSubmission , currentIndex])

useEffect(()=>{
    const answers = PartialSubmission.Questions.every((item)=> item.answer.trim() != "")
    if(answers)
    {
        const isSubmissionVoteExist = PartialSubmission.SubmissionVote.length;
        console.log(isSubmissionVoteExist);
        if(isSubmissionVoteExist > 0)
        {
            socket.emit("Reset", SocketGroup, currentIndex, AssingmentId, UpdateSubmission);
        }
        
    }
    
},[])

useEffect(() => {
    if (!errorMsg) return; 

    const timeout = setTimeout(() => {
    seterrorMsg("");
    }, 5000);

    return () => clearTimeout(timeout); 
}, [errorMsg]);


const handleSubmit = (e)=>{
    e.preventDefault();
    if (!text.trim()) return; 

    socket.emit("sendMessage", {
        SocketGroup,
        User: User,
        message: text,
    });
        
    settext("");
    socket.emit("TypingFinish", SocketGroup,User , false)
}

const HandleSave = () => {
    setPartialSubmission((prev) => {
        const updateArray = [...prev.Questions];

        updateArray[currentIndex] = {
            ...updateArray[currentIndex],
            isLocked: true,
            lockedby: User,
        };

        const updatedSubmission = {
            ...prev,
            Questions: updateArray,
        };

        socket.emit("Save", SocketGroup, User, currentIndex, AssingmentId, updatedSubmission);

        return updatedSubmission;
    });
};


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

const updateArrayItem = (index, key, value) => {
    setPartialSubmission((prev) => {
        const updateArray = [...prev.Questions];

        if (key == null) {
        updateArray[index] = value;
        } else {
        updateArray[index] = {
            ...updateArray[index],
            [key]: value,
        };
        }

        const newState = {
        ...prev,
        Questions: updateArray,
        };

        const answerText = updateArray[currentIndex].answer || "";
        // check after update
        if (answerText.trim() === "") {
        socket.emit("Answering", null, SocketGroup, currentIndex, "", false);
        } else {
        socket.emit("Answering", User, SocketGroup, currentIndex,answerText, true);
        }

        return newState;
    });
};



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

const handletext =(e)=>{
    const {name , value} = e.target
    settext(e.target.value)
    socket.emit("Typing", SocketGroup,User, true)
   
}

useEffect(() => {
  if( text.trim() == "@")
    return settagUser(true)
  settagUser(false)
}, [text]);

const handleBlur = () => {
  socket.emit("Typing", SocketGroup, User, false);
};

const CalculateVote = ()=>{
    const Votes = PartialSubmission.Questions[currentIndex].vote.length
    const TotalStudent = PartialSubmission.Students.length
    return Math.floor((Votes/TotalStudent)*100)
}

const MangeVotes = ()=>{
    setPartialSubmission((prev)=>{
        const updateArray = [...prev.Questions]

        updateArray[currentIndex].vote  = [...updateArray[currentIndex].vote , User._id]

        const Updatesubmission =   {
                ...prev,
                Questions : updateArray
            }

        socket.emit("Votes",SocketGroup, User , currentIndex , AssingmentId , Updatesubmission )
        return Updatesubmission
    })
}

const VerifyVote = ()=>{
    const isexit = PartialSubmission.Questions[currentIndex].vote.includes(User._id);
    return isexit
}

const ManageSubmission = ()=>{
    const AnswerAll = PartialSubmission.Questions.every((item)=>item.answer.trim() != "")
    if (AnswerAll == false)
        return seterrorMsg("All Questions Should be Answered")
        setPartialSubmission((prev)=>{
            const updateArray = {
                ...prev ,
                SubmissionVote : [...prev.SubmissionVote , User._id]
            }
        socket.emit("SubmissionVote", SocketGroup , User, AssingmentId, updateArray)
        return updateArray 
    })
    

}   
const VerifySubmission =()=>{
    const isexit = PartialSubmission.SubmissionVote.includes(User._id);
    return isexit
}

    return (
    <div className=" px-5 py-4 font-urbanist flex gap-3 ">
        <div className="hidden md:flex flex-col  items-center justify-between gap-5 bg-white rounded-lg border border-purple-200 py-3 px-4">
        
            <div className="flex flex-col items-center justify-between h-full gap-4">
                <button
                className="btn-small-light"
                onClick={gotoHome}
                >
                <LuArrowLeft className="text-[16px]" />
                </button>
                <div className='flex gap-2 flex-col'>
                    {PartialSubmission.Students.map((item, index) => (
                        <div className='border rounded-full p-1 relative '>                    
                            <div key={index} className='border p-2 flex items-center justify-center rounded-full peer'>{item.name.slice(0, 2)}</div>
                            <div className={`absolute size-3  -translate-y-2 rounded-full ${item.online ? "bg-green-500": "bg-red-500"}`}></div>
                            <div className='bg-purple-200 px-3 py-1 text-sm absolute -translate-y-10 translate-x-14 rounded-lg z-30 opacity-0 peer-hover:opacity-100'>{item.name}</div>
                        </div>
                    ))}

                </div>
            </div>
            
            
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-1">
            <div className="h-[95vh]  bg-white col-span-2 rounded-lg border border-purple-200 overflow-hidden relative">
                <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-300 py-3 px-4  my-3 mx-2">
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
                                updateArrayItem = {updateArrayItem}
                                WhoIsAnswering = {WhoIsAnswering}
                                DisplayAnswer ={DisplayAnswer}
                                DisableQuestionbyIndex ={DisableQuestionbyIndex}
                                HandleSave ={HandleSave}
                            />
                            )}
                    </div>
                    <div className='row-span-1 -translate-y-3 '>
                        {PartialSubmission.Questions[currentIndex]?.isLocked && (
                            <div className='border border-dashed rounded-md border-purple-300 flex items-center justify-between  px-3 gap-3 py-2'>
                                
                                <div className='w-full flex flex-col p-1 '>
                                    <p className="text-sm font-medium text-slate-600">Refinement Votes:</p>
                                    <div className='flex items-center justify-between gap-4'>
                                        <div             
                                            className={ `h-0.5 w-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-300`}
                                            style={{width : `${CalculateVote()}%`}}>

                                        </div>
                                        <div className='flex text-sm font-medium text-slate-600'>
                                            <p>{(PartialSubmission.Questions[currentIndex].vote).length}</p>/
                                            <p>{PartialSubmission.Students.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={MangeVotes} className='btn-small-light' disabled={VerifyVote()}>
                                    <Vote className='size-4'/> <p>Vote</p>
                                </button>
                            </div>
                        )}
                    </div>
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
                                onClick={handleBack}
                                disabled={currentIndex === 0}
                                className={`btn-small-light ${currentIndex === 0 ? "cursor-none opacity-50" : ""}`}
                                >
                                <LuArrowLeft className="text-[16px]" />
                                Back
                            </button>

                            <div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[95vh] w-full bg-gray-100 rounded-lg shadow flex flex-col">
                <div className="flex-1 overflow-y-auto py-3 px-5 bg-white text-sm ">
                    {messages.map((item, index) => (
                    <>
                        
                        <div
                            key={index}
                            className={`relative mb-2 mt-3 max-w-xs px-3 py-2 rounded-lg flex justify-between gap-3 ${
                            item.User === User._id
                                ? "ml-auto bg-purple-100 text-left "
                                : "mr-auto bg-gray-200 text-left"
                            }`}
                        >   
                            {
                                item.User != User._id && (
                                    <div className='bg-white rounded-full size-10 px-3 flex items-center justify-center'>
                                        <p className='text-center'>{User.name.slice(0,2)}</p>
                                    </div>
                                )
                            }
                           <div className='flex flex-col w-full gap-1'>
                             <div className='bg-white w-full px-3 py-2 rounded-md overflow-hidden'>
                                <div className={`size-4 absolute  transform rotate-45 rounded border-t-[16px] border-white border-t-white border-r-[16px]  border-r-transparent ${item.User === User._id ? "-top-2 -right-2 bg-purple-100 ":"-top-2 -left-2 bg-gray-200"}`}>
                                </div>
                                <p className='break-words'>
                                    {item.message}
                                </p>                            
                            </div>
                            <p className='text-xs text-gray-900 text-right italic'>{moment(item.timestamp).fromNow()}</p>
                           </div>

                            
                           
                        </div>
                    </>
                    ))}
                    {displayTyping && (
                        <div className="text-sm text-gray-500 italic px-2 py-1 bg-gray-100 rounded-md w-max">
                            {typingUser} is typing...
                        </div>
                        )}

                </div>

                <form
                    className="relative p-3 bg-white border-t border-gray-300"
                    onSubmit={handleSubmit}
                >
                    <input
                    className="w-full text-sm border border-purple-300 text-black outline-none px-3 py-2 rounded-md placeholder-gray-500 focus:border-purple-500"
                    type="text"
                    value={text}
                    onChange={handletext}
                    onBlur={handleBlur}
                    placeholder="Type a message..."
                    />
                    {
                        tagUser && (
                            <div className='absolute -top-32 w-[63vh] h-32 border overflow-y-scroll rounded px-2 space-y-2 py-4 '>
                                {
                                    PartialSubmission.Students.map((item)=>(
                                        <div className='bg-purple-100 text-md border px-3 py-2 rounded flex items-center gap-2 hover:bg-purple-200' onClick={()=>{settext(item.name) ,settagUser(false)}}>
                                            <div className='bg-white rounded-full size-7 p-4 flex items-center justify-center'>
                                                <p className='text-center'>{item.name.slice(0,2)}</p>
                                            </div>
                                            <div className=''>{item.name}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
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