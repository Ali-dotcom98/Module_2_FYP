import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import AxiosInstance from "../../../Utility/AxiosInstance"
import { LuArrowLeft, LuCircleAlert, LuDownload, LuSave, LuSaveAll, LuTrash2 , LuCommand, LuMessageCircle } from 'react-icons/lu';

import Modal from '../../../Layouts/Modal';
import { API_PATH } from '../../../Utility/ApiPath';
import {UserContext} from "../../../ContextApi/UserContext"

import axios from 'axios';
import { Loader2, Send, Slice, Sparkles, Vote } from 'lucide-react';
import moment from 'moment';
import DisplayQuestion from '../../Students/Components/DisplayQuestion';
import { FaComment, FaCommentAlt } from 'react-icons/fa';
import TitleInput from '../../../Components/Inputs/TitleInput';
import Ask from "../../../assets/Ask.svg"
import RenderFrom from './RenderSubmission';


const EvaluationPage = () => {
    const location = useLocation();
    const navigator = useNavigate();
    const AssingementRef = useRef(null);

    const { AssingmentTitle , AssingmentDetail} = location.state || {};

    console.log("AssingmentDetail",AssingmentDetail);
    

    const {SubmissionID } = useParams();
    const {User} = useContext(UserContext)


    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorMsg, seterrorMsg] = useState("")
    const [isLoading, setisLoading] = useState(false)
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const [baseWidth, setBaseWidth] = useState(600);
    


    const [aiMessages, setAiMessages] = useState([]);
    const [aiInput, setAiInput] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);

    const [showQuestionSuggestions, setShowQuestionSuggestions] = useState(false);
    const [filteredQuestions, setFilteredQuestions] = useState([]);

    const [mentionQuery, setMentionQuery] = useState("");

    
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
        navigator("/Instructor/Evaluation")
    }
const HandleSave = async () => {
    try {
        setisLoading(true);
        await AxiosInstance.put(
            API_PATH.PARTIAL.SAVE_BY_INSTRUCTOR(SubmissionID),
        { PartialSubmission }
        );
        console.log("Saving done, navigating...");
        gotoHome();
        
    } catch (error) {
        console.error("Save failed:", error);
    } finally {
        setisLoading(false);
    }
};

const handleAskAI = async () => {
    if (!aiInput.trim()) return;

    const userMessage = { role: "user", content: aiInput };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput("");
    setIsAiLoading(true);

    try {
        const response = await AxiosInstance.post("/ask", { question: userMessage.content });
        const aiResponse = response?.data?.answer ?? "No answer received.";
        setAiMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
    } catch (error) {
        console.error("AI request failed:", error);
        setAiMessages(prev => [...prev, { role: "ai", content: "Something went wrong. Try again." }]);
    } finally {
        setIsAiLoading(false);
    }
};

const handleInputChange = (e) => {
    const value = e.target.value;
    setAiInput(value);

    const atIndex = value.lastIndexOf("@");
    console.log(atIndex);
    
    if (atIndex !== -1) {
        const query = value.slice(atIndex + 1).toLowerCase();
        console.log("query",query);
        
        setMentionQuery(query);
        const questions = PartialSubmission.Questions.map((q) => q.questionText);
        const matches = questions.filter((q) =>
            q.toLowerCase()
        );
        console.log("matches", matches);
        
        setFilteredQuestions(matches);
        setShowQuestionSuggestions(matches.length > 0);
    } else {
        setShowQuestionSuggestions(false);
        setFilteredQuestions([]);
        setMentionQuery("");
    }
};


const Hello = () => {
  if (!AssingementRef.current) return;

  const element = AssingementRef.current; 
  const opt = {
    margin:       [10, 10, 10, 10],     // top, left, bottom, right in px
    filename:     `${AssingmentTitle || "Assignment"}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },         // higher = sharper
    jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};



    return (
    <div className="container mx-auto font-urbanist">
        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4 mt-4">
        
            <div className="flex items-center gap-4">
                <button
                className="btn-small-light"
                onClick={gotoHome}
                >
                <LuArrowLeft className="text-[16px]" />
                <span className="hidden md:block">Home</span>
                </button>
            </div>
            
            <div className="flex items-center gap-4">

                <button
                className="btn-small-light "
                onClick={() => setOpenPreviewModal(true)}
                >
                <LuDownload className="text-[16px]" />
                <span className="hidden md:block ">Preview & Download</span>
                </button>
            </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
            <div className="h-[95vh]  bg-white col-span-3 rounded-lg border border-purple-200  relative">
                <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-300 py-3 px-4  my-3 mx-2">
                    <h1>{AssingmentTitle}</h1>
                    
                </div>  
                    
                <div className='grid grid-rows-4 w-full  overflow-y-scroll px-3 py-4 md:gap-2 '>
                    <div className='row-span-3'>
                        {PartialSubmission.Questions.length > 0 && (
                            <DisplayQuestion
                                mode={"Evaluation"}
                                item={PartialSubmission.Questions[currentIndex]}
                                index = {currentIndex}
                                updateArrayItemInstructor = {updateArrayItemInstructor}
                                handleSave ={handleSave}
                            />
                            )}
                    </div>
                    <div className='row-span-1 -translate-y-3 '>
                        <div className='border border-dashed rounded-md border-purple-300 mt-3 flex items-center justify-between  px-3 gap-3  py-1'>
                            <div className='flex w-full  items-center gap-2 justify-center p-1 '>
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
    
                                    className={`btn-small-light flex items-center gap-2 ${currentIndex === PartialSubmission.Questions.length - 1 ? "cursor-none opacity-50" : ""}`}
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
            <div className="h-[95vh] w-full col-span-2  rounded-lg shadow flex flex-col relative">
                <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-300 py-3 px-4  my-3 mx-2">
                    <p ><Sparkles className='text-[16px] text-[#6c63ff]'/></p>
                    <h1 className="w-fit text-[12px] font-medium text-white bg-[#6c63ff] px-3 py-0.5 rounded mt-1">
                        AI Assistant
                    </h1>
                </div>

                <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
                    {aiMessages.length === 0 && !isAiLoading && (
                        <div className="flex flex-col items-center justify-center mt-10 gap-3 text-center text-gray-400">
                            <img src={Ask} className="size-56" alt="Ask AI" />
                            <p className="text-lg font-medium text-[#6c63ff]">No messages yet.</p>
                            <p className="text-sm text-gray-500">Ask me anything and I’ll help you out!</p>
                        </div>
                    )}


                 {aiMessages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} px-2`}
                    >
                        <div
                        className={`relative p-4 max-w-[75%] break-words
                            rounded-xl shadow-md
                            transition-all duration-300 ease-in-out
                            ${
                            msg.role === "user"
                                ? "bg-[#6c63ff] text-white rounded-br-none"   
                                : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200" // AI bubble
                            }`}
                        >
                      
                        {msg.role === "assistant" && (
                            <span className="absolute -top-4 left-2 text-xs text-gray-400">AI</span>
                        )}
                        {msg.content}
                        </div>
                    </div>
                    ))}
                    {isAiLoading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-xl bg-gray-100 text-gray-600 self-start flex items-center gap-2 border border-gray-200">
                        <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                        <span>Generating</span>
                        <span className="dot-anim text-2xl leading-none -mt-1">.</span>
                        <span className="dot-anim text-2xl leading-none -mt-1">.</span>
                        <span className="dot-anim text-2xl leading-none -mt-1">.</span>
                        </div>
                    </div>
                    )}



                </div>


                <div className="p-3 border-t  border-purple-200 flex gap-2">
                    <input
                        type="text"
                        className="flex-1 p-2 border border-purple-400 focus:outline-none rounded-md relative"
                        placeholder="Ask a question..."
                        value={aiInput}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                    />

                    <button
                        className="btn-small-light"
                        onClick={handleAskAI}
                        disabled={isAiLoading}
                    >
                        Send
                    </button>

                    {showQuestionSuggestions && (
                    <div className="absolute bottom-[50px] left-3 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto w-[calc(100%-2rem)]">
                        <div className="flex justify-between items-center px-2 py-1 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Suggestions</span>
                        <button
                            className="text-xs text-gray-500 hover:text-gray-700"
                            onClick={() => setShowQuestionSuggestions(false)}
                        >
                            ✕ Close
                        </button>
                        </div>

                        {filteredQuestions.length === 0 ? (
                        <div className="p-2 text-gray-500 text-sm italic">
                            No suggestions found
                        </div>
                        ) : (
                        filteredQuestions.map((q, idx) => (
                            <div
                            key={idx}
                            role="button"
                            tabIndex={0}
                            className="p-2 hover:bg-purple-100 cursor-pointer text-sm"
                            onClick={() => {
                                const atIndex = aiInput.lastIndexOf("@");
                                const newValue = aiInput.slice(0, atIndex) + q + " ";
                                setAiInput(newValue);
                                setShowQuestionSuggestions(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                const atIndex = aiInput.lastIndexOf("@");
                                const newValue = aiInput.slice(0, atIndex) + q + " ";
                                setAiInput(newValue);
                                setShowQuestionSuggestions(false);
                                }
                            }}
                            >
                            {q}
                            </div>
                        ))
                        )}
                    </div>
                    )}
                </div>
            </div>

        </div>
        <Modal
            isOpen={openPreviewModal}
            onClose={() => setOpenPreviewModal(false)}
            title={AssingmentDetail?.title}
            showActionBtn
            actionBtnText="Download"
            actionBtnIcon={<LuDownload className="text-[16px]" />}
            type={"Print"}
            
            >
            <div ref={AssingementRef}  className="w-[98vw] h-[90vh]" >
                <RenderFrom
                    AssingmentDetail={AssingmentDetail}
                    data = {PartialSubmission}
                    containerWidth = {baseWidth}
                    status={"Medium"}
                />
        </div>
    </Modal>
    </div>
    
    )
}   
export default EvaluationPage