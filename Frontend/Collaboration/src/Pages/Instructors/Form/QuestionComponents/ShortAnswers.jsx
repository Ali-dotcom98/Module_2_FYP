import { X } from 'lucide-react'
import React from 'react'

const ShortAnswers = ({item , removeQuestion, index}) => {
  return (
    <div className=' border border-dashed px-3 py-1 mt-3 rounded-md'>
            <div className="col-span-2 mt-3 ">
                <div className='flex items-center justify-between'>
                    <label className="text-sm font-medium text-slate-600">
                        Question 
                    </label>
                    <div className='flex gap-2 items-center'>
                        <label className="text-xs font-medium text-slate-600">
                            Marks    
                        </label>
                            <input type="number" min="1" value={item.marks} className='bg-slate-50 outline-none rounded-md w-12 text-center' />
                    </div>
                </div>
                <textarea
                    placeholder="Write a function that takes an array of integers and returns the maximum and minimum numbers as a tuple or list."
                    className="form-input resize-none"
                    rows={4}
                    value={item.questionText|| ""}
                    onChange={({ target }) => updateSection("questionText", target.value)}
                />
                <button onClick={()=>removeQuestion(index)} className='flex items-center justify-end text-sm  w-full'>
                    <div className='text-red-500'>
                        <X className='size-4'/>
                    </div>
                </button>
            </div>
    </div>
  )
}

export default ShortAnswers