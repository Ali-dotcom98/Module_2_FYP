import { Indent, Lock, Save, Unlock, X } from 'lucide-react'
import React, { useState } from 'react'
import { useContext } from 'react'
import {UserContext} from '../../../../ContextApi/UserContext'
import Model from "../../../../Layouts/Modal"

const ShortAnswers = ({item , removeQuestion, index , UpdateItemInArray,updateArrayItem, type , WhoIsAnswering  , DisplayAnswer, DisableQuestionbyIndex , updateArrayItemInstructor  , HandleSave}) => {
    const {User} = useContext(UserContext);
    console.log(index);
    
    const [ConfirmSave, setConfirmSave] = useState(false)
    
    // console.log("WhoIsAnswering",WhoIsAnswering);
    // console.log("item",item);

    const handleRatingChange = (value) => {
    let marks = 0;

    if (value === "Excellent") 
        marks = item.marks;
    else if (value === "Good") 
        marks = Math.round(item.marks * 0.75);
    else if (value === "Average") 
        marks = Math.round(item.marks * 0.5);
    else if (value === "Poor") 
        marks = Math.round(item.marks * 0);

    else marks = item.marks || 0; 
    console.log("marks",marks);
    
    updateArrayItemInstructor(index, "rating", value)
    updateArrayItemInstructor(index, "obtainedMarks", marks)
  };
    
    
  return (
    <>
        <div className=' border border-dashed border-purple-300 px-3 py-2  rounded-md '>
            <div className="col-span-2 mt-3 ">
                <div className='flex items-center justify-between'>
                    <label className="w-fit text-[12px] font-medium text-white bg-[#6c63ff] px-3 py-0.5 rounded mt-1">
                        Question {index+1}
                    </label>
                    
                    <div className='flex items-center gap-4 font-urbanist font-semibold'>
                        
                        <div>
                            {
                                User.status == 'Student' && (
                                    <div>
                                        {
                                        item?.isLocked == true ?(
                                            <div className=' text-sm flex items-center justify-center gap-1  rounded-xl px-3 py-0.5 bg-red-100 text-red-900'>
                                                <Lock className='size-4'/><p>Close for editing</p>
                                            </div>
                                        ):
                                        (
                                            <div className=' text-sm flex items-center justify-center gap-1  rounded-xl px-3 py-0.5 bg-green-100 text-green-900'>
                                                <Unlock className='size-4'/>Open for editing
                                            </div>
                                        )
                                    }
                                    </div>
                                    
                                )
                            }
                        </div>
                        <label className="text-xs font-medium text-slate-600">
                            Marks    
                        </label>
                            <input type="number" min="1" disabled={User.status == "Student" ? true : false}   value={item.marks}  onChange={({target})=>UpdateItemInArray(index , "marks", target.value)} className='bg-slate-50 outline-none rounded-md w-12 text-center' />
                    </div>
                </div>
                <textarea
                    placeholder="Write a function that takes an array of integers and returns the maximum and minimum numbers as a tuple or list."
                    className={`form-input border-slate-300 resize-none ${type ? "h-16":""}`}
                    rows={4}
                    disabled={User.status == "Student" ? true : false} 
                    value={item.questionText|| ""}
                    onChange={({ target }) => UpdateItemInArray(index , "questionText", target.value)}
                />
                {
                    type && (
                        <>
                            <div className='flex items-center justify-between'>
                                <label className="text-sm font-medium text-slate-600">
                                    Answer 
                                </label>
                            </div>
                            <textarea
                                placeholder={WhoIsAnswering && DisableQuestionbyIndex===index ? `${WhoIsAnswering?.name} is answering ...  ` : "Answer Here"}
                                disabled={
                                    item.isLocked 
                                    || (WhoIsAnswering && WhoIsAnswering?._id !== User._id && DisableQuestionbyIndex === index) 
                                }
                                className={`w-full text-sm  outline-none border   px-2.5 py-3 rounded-md mt-2 placeholder:text-gray-500 focus-within:border-purple-300 resize-none ${type ? "h-32":""}  ${ WhoIsAnswering && WhoIsAnswering?._id !== User._id && DisableQuestionbyIndex == index ?"border-slate-300 bg-slate-100 text-gray-400 font-medium italic":"border-slate-300  bg-white text-black"}`}
                                rows={4}
                                value={item.answer}
                                onChange={({ target }) => updateArrayItem(index , "answer", target.value)}s
                            />
                        </>
                    )
                }
                {
                    !type  && (
                        <button onClick={()=>removeQuestion(index)} className='flex items-center justify-end text-sm  w-full'>
                            <div className='text-red-500'>
                                <X className='size-4'/>
                            </div>
                        </button>
                    )
                }
                {
                    type  && (
                        <div className='flex items-center justify-between w-full'>
                            {
                                DisplayAnswer  && DisableQuestionbyIndex == index && !item.isLocked &&   (
                                    <div className='w-full'>
                                        {
                                            WhoIsAnswering && <p className="w-fit text-sm text-gray-500 italic px-2 py-1 bg-gray-100 rounded-md">{WhoIsAnswering.name} is Typing ....</p>

                                        }
                                    </div>
                                )
                            }
                            {
                                User.status == "Student" && item.isLocked && (
                                    <p className="w-full">
                                        <div className='w-fit flex  text-sm text-gray-500 italic px-2 py-1 bg-gray-100 rounded-md space-x-1'>
                                            <h1>Save By </h1>
                                            <p> {item.lockedby.name}</p>
                                        </div>
                                    </p>

                                )
                            }

                        <div className="flex items-center justify-end text-sm w-full">
                            {
                                User.status == "Student" && (
                                    <button
                                        disabled={item.isLocked || WhoIsAnswering && WhoIsAnswering != User._id  && DisableQuestionbyIndex == index}
                                        onClick={() => setConfirmSave(true)}
                                        className={`btn-small-light w-fit flex items-center gap-1
                                        ${item.isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <Save className="size-4" /> Save
                                    </button>
                                )
                            }
                            {
                                User.status == "Instructor" && (
                                    <div className='w-full flex items-center justify-center gap-3'>
                                       
                                        <label className="btn-small-light mt-2">
                                            Rating
                                        </label>

                                        <select
                                            value={item.rating || ""}
                                            onChange={(e) => handleRatingChange(e.target.value )}
                                            className='w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-2 rounded-md mt-2 placeholder:text-gray-500 focus-within:border-purple-300'
                                        >
                                            <option value="">Select rating</option>
                                            <option value="Excellent">🌟 Excellent</option>
                                            <option value="Good">👍 Good</option>
                                            <option value="Average">👌 Average</option>
                                            <option value="Poor">👎 Poor</option>

                                        </select>
                                         <div>
                                            <input  value={item?.obtainedMarks }  className='bg-slate-100 outline-none rounded-md py-2 mt-2  w-16 text-center' type="number" min={0} name="" id="" />
                                        </div>


                                    </div>
                                )
                            }
                        </div>

                        </div>
                    )
                }
            </div>
        </div>
        <Model
            isOpen={ConfirmSave}
            onClose={() => setConfirmSave(false)}
            title ={"Confirm Save"}
            type={"small"}
            >
            <div className="p-4 font-urbanist h-full">
                <h2 className="text-lg font-semibold mb-2">Save Assingment Progress</h2>
                <p className="text-sm text-gray-700 mb-4 space-y-2">
                Are you sure you want to save this answer?<br/>
                Once saved, it cannot be rewritten unless others vote to unlock it.
                </p>

                <div className="flex justify-end space-x-3 translate-y-0  sm:translate-y-3">
                <button
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                    onClick={() => setConfirmSave(false)}
                >
                    Cancel
                </button>
                <button
                    className=" px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                   onClick={() => (setConfirmSave(false), HandleSave())}
                >
                    Save Answer
                </button>
                </div>
            </div>
        </Model>

    </>
  )
}

export default ShortAnswers