import React, { useEffect, useState } from "react";
import AxiosInstance from "../../Utility/AxiosInstance";
import { API_PATH } from "../../Utility/ApiPath";
import { CheckCircle2, X, XCircle } from "lucide-react";
import moment from "moment";

const Result = ({
  setdisplay,
  AssingmentDetail,
  AssingmentID,
  setAssingmentdata,
  openPreviewModal,
  setOpenPreviewModal,
}) => {
  const [data, setData] = useState(null);
  const [Instructor, setInstructor] = useState({})
  console.log("Instructor",AssingmentDetail);
  

  const FetchResultData = async () => {
    try {
      const response = await AxiosInstance.get(API_PATH.ASSIGN.RESULT(AssingmentID));
      if (response.data) {
        setData(response.data);
        setAssingmentdata(response.data);
        
      }
    } catch (error) {
      console.error(error);
    }
  };
  const FetchInstructor = async () => {
    try {
      const response = await AxiosInstance.get(API_PATH.ASSIGN.INSTRUCTOR(AssingmentDetail?.Instructor));
      console.log(response.data);
      
      if (response.data) {
        setInstructor(response.data)
      }
    } catch (error) {
      console.error(error);
    }
  };




  useEffect(() => {
    FetchResultData();
    if(AssingmentDetail!=null)
    {
      FetchInstructor();
    }
  }, [AssingmentID]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-400 animate-pulse">Loading result...</p>
      </div>
    );
  }

  return (
    <>
      {/* Assignment Info Card */}
      <div className="flex items-center justify-end pb-3 "><X className="cursor-pointer" onClick={()=>setdisplay("")}/></div>
      <div className="font-urbanist max-w-xl mx-auto bg-white border  rounded-2xl shadow-md p-6 mb-6 ">
        <div className="flex items-center justify-between mb-3"> 
          <h2 className="text-2xl font-bold text-gray-800 truncate pr-3">
            {AssingmentDetail?.title}
          </h2>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              AssingmentDetail?.difficulty?.toLowerCase() === "hard"
                ? "bg-red-100 text-red-700"
                : AssingmentDetail?.difficulty?.toLowerCase() === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {AssingmentDetail?.difficulty}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-3">{AssingmentDetail?.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
          <div>
            <p className="text-gray-500">Instructor</p>
            <p className="font-medium text-gray-800">{Instructor?.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Due Date</p>
            <p className="font-medium text-gray-800">
              {moment(AssingmentDetail?.dueDate).format("Do MMM YYYY")}
            </p>
          </div>
          <div className="flex gap-2">
            <p className="text-gray-500">Total Marks</p>
            <p className=" text-gray-800 font-semibold">{AssingmentDetail?.totalMarks}</p>
          </div>
        </div>
      </div>

      {/* Assignment Result Card */}
      <div className="font-urbanist max-w-xl mx-auto bg-white border rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Assignment Result</h2>
            <p className="text-sm text-gray-500">Your performance overview</p>
          </div>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              data.isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {data.isPassed ? "Passed" : "Not Passed"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-300">
            <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">{data.status}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-300">
            <p className="text-xs uppercase tracking-wide text-gray-500">Obtained Marks</p>
            <p className="text-lg font-semibold text-gray-800">{data.obtainedMarks}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Students</h3>
          <button
            onClick={() => {setOpenPreviewModal(true) ,setdisplay("")}}
            className="text-sm text-indigo-600 hover:underline"
          >
            View Detail
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.Students?.map((student) => (
            <div
              key={student._id}
              className="px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm text-indigo-700"
            >
              {student.name}{" "}
              <span className="text-xs text-gray-500">({student.status})</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Result;
