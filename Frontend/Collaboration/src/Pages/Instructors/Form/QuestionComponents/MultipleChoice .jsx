import { X } from "lucide-react";
import React from "react";

const MultipleChoice = ({ item, updateSection   , index,removeQuestion , UpdateItemInArray ,AddItemInNestedArray, UpdateItemInNestedArray}) => {
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
              onChange={({ target }) => UpdateItemInArray( index, "marks", target.value)}
            />
          </div>
        </div>

        {/* Question Text */}
        <textarea
          placeholder="Write your MCQ question here..."
          className="form-input resize-none mt-2 w-full"
          rows={3}
          value={item.questionText || ""}
          onChange={({ target }) => UpdateItemInArray(index,"questionText", target.value)}
        />

        {/* Options */}
        <div className="mt-3 space-y-2">
          {item?.options?.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                name={`mcq_${item.id}`}
                checked={item.answer == (idx)}
                onChange={() => UpdateItemInArray(index , "answer", idx)}
              />
              <input
                type="text"
                className={`border px-2 py-1 rounded-md w-full ${item.answer == (idx) ? "bg-purple-100":""}`}
                value={opt}
                placeholder={`Option ${idx + 1}`}
                onChange={({ target }) => {
                  UpdateItemInNestedArray(index , idx,"options", target.value);
                }}
              />
            </div>
          ))}

          <div className="flex items-center justify-between">
            <button
            className="text-xs text-start text-blue-500  w-full"
            onClick={()=>AddItemInNestedArray(index, "options" , "")}
          >
            + Add Option
          </button>
          <button onClick={()=>removeQuestion(index)} className='flex items-center justify-end text-sm  w-full'>
                <div className='text-red-500'>
                    <X className='size-4'/>
                </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoice;
