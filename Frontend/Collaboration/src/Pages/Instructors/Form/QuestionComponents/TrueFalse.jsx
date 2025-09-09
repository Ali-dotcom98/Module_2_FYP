import { X } from 'lucide-react'
import React from 'react'

const TrueFalse = ({ item, updateSection , index  , removeQuestion, UpdateItemInArray}) => {
  return (
    <div className='border border-dashed px-3 py-1 mt-3 rounded-md'>
      <div className="col-span-2 mt-3">
        <div className='flex items-center justify-between'>
          <label className="text-sm font-medium text-slate-600">
            True False
          </label>
          <div className='flex gap-2 items-center'>
            <label className="text-xs font-medium text-slate-600">
              Marks
            </label>
            <input
              type="number"
              min="1"
              value={item.marks}
              className='bg-slate-50 outline-none rounded-md w-12 text-center'
              onChange={({ target }) =>
                UpdateItemInArray(index, "marks", target.value)
              }
            />
          </div>
        </div>

        {/* Question Text */}
        <textarea
          placeholder="Write your True/False question here..."
          className="form-input resize-none mt-2 w-full"
          rows={3}
          value={item.questionText || ""}
          onChange={({ target }) => UpdateItemInArray(index ,"questionText", target.value)}
        />

        {/* True/False Options */}
        <div className="flex gap-4 mt-3">
          <label className={`flex items-center gap-1 text-sm `}>
            <input
              type="radio"
              name={`true_false_${item.id}`}
              checked={item.answer === "True" ? true : false}
              onChange={() => UpdateItemInArray(index,"answer", "True")}
            />
            <div className={`font-semibold ${item.answer === "True" ? "text-purple-600":"text-slate-600"}`}>
              True
            </div>
          
          </label>

          <label className="flex items-center gap-1 text-sm text-slate-600">
            <input
              type="radio"
              name={`true_false_${item.id}`}
              checked={item.answer === "False"}
              onChange={() => UpdateItemInArray(index ,"answer", "False")}
            />
            <div className={`font-semibold ${item.answer === "False" ? "text-purple-600":"text-slate-600"}`}>
               False
              </div>
           
          </label>
           <button onClick={()=>removeQuestion(index)} className='flex items-center justify-end text-sm  w-full'>
                <div className='text-red-500'>
                    <X className='size-4'/>
                </div>
            </button>
        </div>
      </div>
    </div>
  )
}

export default TrueFalse
