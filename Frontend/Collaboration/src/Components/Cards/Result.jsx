import React, { useEffect, useState } from "react";
import AxiosInstance from "../../Utility/AxiosInstance";
import { API_PATH } from "../../Utility/ApiPath";
import { CheckCircle2, XCircle, Star } from "lucide-react";

const Result = ({ AssingmentID }) => {
  const [data, setData] = useState({});
  console.log(data);
  

  const FetchResultData = async () => {
    try {
      const response = await AxiosInstance.get(API_PATH.ASSIGN.RESULT(AssingmentID));
      if (response.data) setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    FetchResultData();
  }, [AssingmentID]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-400 animate-pulse">Loading result...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-10 bg-purple-50 space-y-10 font-urbanist border rounded-lg">
      
      <header className="text-center">
        <h1 className="text-3xl font-bold text-violet-600">Assignment Result</h1>
        <p className="text-gray-500 mt-1">Your performance overview</p>
      </header>

 
      <section className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-semibold text-gray-700 capitalize">{data.status}</p>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Obtained Marks</p>
          <p className="font-semibold text-gray-700">{data.obtainedMarks}</p>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col items-center">
          <p className="text-sm text-gray-500">Passed</p>
          {data.isPassed ? (
            <CheckCircle2 className="text-green-500 mt-1" size={22} />
          ) : (
            <XCircle className="text-red-500 mt-1" size={22} />
          )}
        </div>
      </section>

     
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Questions</h2>
        <div className="space-y-4">
          {data.Questions?.map((q, i) => (
            <div key={q._id} className="bg-white p-4 border rounded-xl shadow-sm">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium text-gray-800 flex items-center gap-4">
                  <h1 className="text-lg">{i + 1}.</h1><p> {q.questionText}</p>
                </h3>
                <span className="text-sm text-gray-800">{q.marks} marks</span>
              </div>
              <p className="text-gray-700 text-sm">
                <span className="font-medium flex gap-3"><h1>Your Answer:</h1><p>{q.answer || "—"}</p></span> 
              </p>
              <p className="text-sm text-gray-700 flex gap-3">
                <span className="font-medium">Obtained:</span>{" "}
                <span className="text-green-600">{q.obtainedMarks}</span>
              </p>
            <div className="flex w-full items-center border justify-between p-2 mt-3 rounded-lg">
                 <div className="flex items-center text-sm  text-gray-500">
                <Star size={14} className="text-yellow-400 mr-1" />
                {q.rating}
              </div>
              {q.suggestion && (
                <p className="text-sm text-gray-500 italic">💡 {q.suggestion}</p>
              )}
            </div>
            </div>
          ))}
        </div>
      </section>

      {/* Students */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Students</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.Students?.map((student) => (
            <div
              key={student._id}
              className="bg-white border rounded-xl shadow-sm p-3 text-center hover:shadow-md transition"
            >
              <p className="font-medium text-gray-800">{student.name}</p>
              <p className="text-xs text-gray-500">{student.status}</p>
            </div>
          ))}
        </div>
      </section>

     
    </div>
  );
};

export default Result;
