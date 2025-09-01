import { Lock, Save, Unlock, X } from 'lucide-react'
import React from 'react'
import { useContext } from 'react'
import {UserContext} from '../../../../ContextApi/UserContext'

const ShortAnswers = ({item , removeQuestion, index , UpdateItemInArray, type}) => {
    const {User} = useContext(UserContext);
  return (
    <div className=' border border-dashed px-3 py-2  rounded-md'>
            <div className="col-span-2 mt-3 ">
                <div className='flex items-center justify-between'>
                    <label className="text-sm font-medium text-slate-600">
                        Question 
                    </label>
                    
                    <div className='flex items-center gap-4 font-urbanist font-semibold'>
                        {
                            item?.Lock == true ?(
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
                        <label className="text-xs font-medium text-slate-600">
                            Marks    
                        </label>
                            <input type="number" min="1" disabled={User.status == "Student" ? true : false}   value={item.marks}  onChange={({target})=>UpdateItemInArray(index , "marks", target.value)} className='bg-slate-50 outline-none rounded-md w-12 text-center' />
                    </div>
                </div>
                <textarea
                    placeholder="Write a function that takes an array of integers and returns the maximum and minimum numbers as a tuple or list."
                    className={`form-input resize-none ${type ? "h-16":""}`}
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
                                placeholder="Answer Here"
                                className={`form-input resize-none ${type ? "h-32":""}`}
                                rows={4}
                                value={item.answer  || ""}
                                onChange={({ target }) => UpdateItemInArray(index , "answer", target.value)}
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
                        <button className='flex items-center justify-end text-sm  w-full'>
                            <div className='btn-small-light'>
                                <Save className='size-4'/> Save
                            </div>
                        </button>
                    )
                }
            </div>
    </div>
  )
}

export default ShortAnswers