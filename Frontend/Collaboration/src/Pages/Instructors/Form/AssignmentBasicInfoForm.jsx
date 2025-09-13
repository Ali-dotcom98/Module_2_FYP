import React from 'react'
import Input from '../../../Components/Inputs/Input'
import moment from 'moment'

const AssignmentBasicInfoForm = ({title , description ,dueDate ,difficulty, totalMarks ,UpdateSection}) => {
  return (
     <div className="px-5 pt-5 min-h-[32vw]">
            <h2 className="text-lg  font-semibold text-gray-900">Basic Information</h2>

            <div className="mt-4">

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input
                    value={title || ""}
                    onchange={({ target }) => UpdateSection("title", target.value)}
                    label="Title"
                    placeholder="Max and Min Number"
                    type="text"
                    />

                    <div className='flex flex-col my-2 space-y-1.5 '>
                        <label htmlFor=""  className="font-medium">Difficulty</label>
                        <select value={difficulty} onChange={({target})=>UpdateSection("difficulty",target.value)} className='p-3 bg-slate-50 relative outline-none rounded-md border' name="" id="">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                </div>

                <div className="col-span-2 mt-3 ">
                    <label className="text-xs font-medium text-slate-600">
                    Description
                    </label>
                    <textarea
                        placeholder="Write a function that takes an array of integers and returns the maximum and minimum numbers as a tuple or list."
                        className="form-input resize-none"
                        rows={4}
                        value={description|| ""}
                        onChange={({ target }) => UpdateSection("description", target.value)}
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input
                    value={moment(dueDate).format("YYYY-MM-DD")
}
                    onchange={({ target }) => UpdateSection("dueDate", target.value)}
                    label="Date"
                    placeholder="Max and Min Number"
                    type="Date"
                    />
                     <Input
                    value={totalMarks || ""}
                    onchange={({ target }) => UpdateSection("totalMarks", target.value)}
                    label="Total Marks"
                    placeholder="50"
                    type="text"
                    disabled={true}
                    />

                </div>
            </div>

            {/* <button
            onClick={onNext}
            className="btn-primary mt-4"
            >
            Next
            </button> */}
        </div>
  )
}

export default AssignmentBasicInfoForm