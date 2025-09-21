import { Lock, Save, Unlock, X } from "lucide-react";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../../ContextApi/UserContext";
import Model from "../../../../Layouts/Modal";

const TrueFalse = ({
  item,
  removeQuestion,
  index,
  UpdateItemInArray,
  updateArrayItem,
  type,
  WhoIsAnswering,
  DisplayAnswer,
  DisableQuestionbyIndex,
  updateArrayItemInstructor,
  HandleSave,
}) => {
  const { User } = useContext(UserContext);
  const [ConfirmSave, setConfirmSave] = useState(false);

  // ✅ Evaluate marks based on rating
  const handleRatingChange = (value) => {
    let marks = 0;
    if (value === "Excellent") marks = item.marks;
    else if (value === "Good") marks = Math.round(item.marks * 0.75);
    else if (value === "Average") marks = Math.round(item.marks * 0.5);
    else if (value === "Poor") marks = 0;
    else marks = item.marks || 0;

    updateArrayItemInstructor(index, "rating", value);
    updateArrayItemInstructor(index, "obtainedMarks", marks);
  };

  const handleChange = (value) => {
    if (User.status === "Instructor") {
      UpdateItemInArray(index, "answer", value);
    } else {
      updateArrayItem(index, "answer", value);
    }
  };

  return (
    <div className="border border-dashed px-3 py-1 mt-3 rounded-md">
      {/* Header */}
      <div className="flex items-center justify-between mt-3">
        <label className="w-fit text-[12px] font-medium text-white bg-[#6c63ff] px-3 py-0.5 rounded">
          Question {index + 1}
        </label>
        <div className="flex items-center gap-4 font-semibold">
          {/* Lock Status */}
          {User.status === "Student" &&
            (item?.isLocked ? (
              <div className="text-sm flex items-center gap-1 rounded-xl px-3 py-0.5 bg-red-100 text-red-900">
                <Lock className="size-4" />
                <p>Closed for editing</p>
              </div>
            ) : (
              <div className="text-sm flex items-center gap-1 rounded-xl px-3 py-0.5 bg-green-100 text-green-900">
                <Unlock className="size-4" />
                <p>Open for editing</p>
              </div>
            ))}
          {/* Marks */}
          <label className="text-xs text-slate-600">Marks</label>
          <input
            type="number"
            min="1"
            disabled={User.status === "Student"}
            value={item.marks || ""}
            onChange={(e) => UpdateItemInArray(index, "marks", e.target.value)}
            className="bg-slate-50 outline-none rounded-md w-12 text-center"
          />
        </div>
      </div>

      {/* Question Text */}
      <textarea
        placeholder="Write your True/False question here..."
        className="form-input resize-none mt-2 w-full"
        disabled={User.status === "Student"}
        rows={3}
        value={item.questionText || ""}
        onChange={(e) => UpdateItemInArray(index, "questionText", e.target.value)}
      />

   
      <div className="flex gap-4 mt-3">
        {["True", "False"].map((value) => (
          <label key={value} className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              className="accent-purple-600"
              name={`true_false_${item.id || index}`}
              checked={item.answer === value}
              disabled={
                (User.status === "Student" && item.isLocked) ||
                (WhoIsAnswering &&
                  WhoIsAnswering?._id !== User._id &&
                  DisableQuestionbyIndex === index)
              }
              onChange={() => handleChange(value)}
            />
            <span
              className={`font-semibold ${
                item.answer === value ? "text-purple-600" : "text-slate-600"
              }`}
            >
              {value}
            </span>
          </label>
        ))}

        
        {!type && (
          <button
            onClick={() => removeQuestion(index)}
            className="flex items-center justify-end text-sm w-full"
          >
            <div className="text-red-500">
              <X className="size-4" />
            </div>
          </button>
        )}
      </div>

  
      {type && (
        <div className="flex flex-col mt-3">
          {DisplayAnswer &&
            DisableQuestionbyIndex === index &&
            !item.isLocked &&
            WhoIsAnswering && (
              <p className="w-fit text-sm text-gray-500 italic px-2 py-1 bg-gray-100 rounded-md">
                {WhoIsAnswering.name} is Typing ....
              </p>
            )}

          {User.status === "Student" && item.isLocked && (
            <div className="w-fit flex text-sm text-gray-500 italic px-2 py-1 bg-gray-100 rounded-md space-x-1">
              <h1>Saved By</h1>
              <p>{item.lockedby.name}</p>
            </div>
          )}

          <div className="flex items-center justify-end text-sm w-full mt-2 gap-3">
            {User.status === "Student" && (
              <button
                disabled={
                  item.isLocked ||
                  (WhoIsAnswering &&
                    WhoIsAnswering !== User._id &&
                    DisableQuestionbyIndex === index)
                }
                onClick={() => setConfirmSave(true)}
                className={`btn-small-light w-fit flex items-center gap-1 ${
                  item.isLocked ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Save className="size-4" /> Save
              </button>
            )}

            {User.status === "Instructor" && (
              <div className="flex items-center gap-3">
                <label className="text-sm">Rating:</label>
                <select
                  value={item.rating || ""}
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-2 rounded-md placeholder:text-gray-500 focus-within:border-purple-300"
                >
                  <option value="">Select rating</option>
                  <option value="Excellent">🌟 Excellent</option>
                  
                  <option value="Poor">👎 Poor</option>
                </select>
                <input
                  value={item?.obtainedMarks || 0}
                  readOnly
                  className="bg-slate-100 outline-none rounded-md py-2 w-16 text-center"
                  type="number"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      <Model
        isOpen={ConfirmSave}
        onClose={() => setConfirmSave(false)}
        title="Confirm Save"
        type="Banner"
      >
        <div className="p-4 font-urbanist">
          <h2 className="text-lg font-semibold mb-2">Save Assignment Progress</h2>
          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to save this answer? Once saved, it cannot be
            rewritten unless others vote to unlock it.
          </p>

          <div className="flex justify-end space-x-3 border-t pt-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={() => setConfirmSave(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                setConfirmSave(false);
                HandleSave();
              }}
            >
              Save Answer
            </button>
          </div>
        </div>
      </Model>
    </div>
  );
};

export default TrueFalse;
