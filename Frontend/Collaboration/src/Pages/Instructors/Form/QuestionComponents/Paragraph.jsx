import { X } from "lucide-react";
import React from "react";

const Paragraph = ({ item, updateSection , index ,removeQuestion , UpdateItemInArray}) => {
  return (
    <div className="border border-dashed px-3 py-1 mt-3 rounded-md">
      <div className="col-span-2 mt-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-600">
            Question
          </label>
          <div className="flex gap-2 items-center">
            <label className="text-xs font-medium text-slate-600">Marks</label>
            <input
              type="number"
              min="1"
              value={item.marks}
              className="bg-slate-50 outline-none rounded-md w-12 text-center"
              onChange={({ target }) => UpdateItemInArray(index,"marks", target.value)}
            />
          </div>
        </div>

        {/* Question Text */}
        <textarea
          placeholder="Write your long-answer / paragraph question here..."
          className="form-input resize-none mt-2 w-full"
          rows={3}
          value={item.questionText || ""}
          onChange={({ target }) => UpdateItemInArray(index,"questionText", target.value)}
        />

        {/* Answer (Paragraph Input) */}
        <textarea
          placeholder="Expected answer (optional)"
          className="form-input resize-none mt-2 w-full"
          rows={5}
          value={item.answer || ""}
          onChange={({ target }) => UpdateItemInArray(index,"answer", target.value)}
        />
      </div>
      <button onClick={()=>removeQuestion(index)} className='flex items-center justify-end text-sm  w-full'>
                    <div className='text-red-500'>
                        <X className='size-4'/>
                    </div>
                </button>
    </div>
  );
};

export default Paragraph;
