import React, { useEffect, useRef, useState } from 'react'
import { DefaultContext } from 'react-icons/lib';
import { formatYearMonth } from '../../../Utility/Helper';
import ChallengeHeader from '../Form/Components/ChallengeHeader';
import TitleInput from '../../../Components/Inputs/TitleInput';


const Title = ({ text, color ,status}) => {
    return (
        <div className="relative w-fit mb-2.5">
        <span
            className="absolute bottom-0 left-0 w-full h-2"
            style={{ backgroundColor: color }}
        ></span>
        <h2 className={`relative font-bold ${status ? "text-lg":"text-sm"}`}>{text}</h2>
        </div>
    );
};
const CodeBlock = ({ code }) => (
  <pre className="bg-gray-100 text-sm p-2 rounded-md overflow-x-auto">{code}</pre>
);
const RenderFrom = ({data , containerWidth ,status ,AssingmentDetail}) => {
    console.log("data",data);
    
    const [showAllTests, setShowAllTests] = useState(false);
const displayedTests = showAllTests
  ? (data?.testCases || [])
  : (data?.testCases?.slice(0, 2) || []);


    const DEFAULT_THEME =["#F5F4FF",  "#E0DBFF",  "#C9C2F8", "#6C63FF", "#4B4B5C"];
 const resumeRef = useRef(null);
    const [baseWidth, setBaseWidth] = useState(780);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (resumeRef.current) {
        const actualBaseWidth = resumeRef.current.offsetWidth;
        setBaseWidth(actualBaseWidth);
        setScale(containerWidth / actualBaseWidth);
        }
    }, [containerWidth]);
  return (
    <div
        ref={resumeRef}
        className={`bg-white ${status ?"px-3 ":"p-3"}`}
        style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto", 
        height: "auto",
        }}>
        <div className="flex flex-col bg-white ">
            {
                 <ChallengeHeader
                        data ={AssingmentDetail || ""}
                        DEFAULT_THEME = {DEFAULT_THEME}

                    />
            }
            <div className={`${status ?"px-3":"px-5 py-4"}  space-y-4`}>
                <div>
                    <TitleInput text="Assignment Instructions" color={DEFAULT_THEME[1]} status={status}/>
                    <p className={` font-medium ${status ?"text-md":"text-sm"}`}>
                        {AssingmentDetail?.description  || ""}
                    </p>
                </div>
                <div>
                    {data.Questions.map((item, index) => {
                        const highlightClass =
                            item.obtainedMarks == item.marks
                            ? "bg-green-50 border-green-300"
                            : item.obtainedMarks == 0 ?"bg-red-50 border-red-300" : "bg-yellow-50 border-yellow-300";

                        return (
                            <div
                            key={item._id}
                            className={`flex flex-col my-4 p-4 border rounded-md shadow-sm ${highlightClass}`}
                            >
                            <div className="flex font-semibold text-md items-center justify-between">
                                <h1>
                                Question {index + 1} ({item.type})
                                </h1>
                                <p>
                                Marks: {item?.obtainedMarks ?? 0}/{item?.marks ?? 0}
                                </p>
                            </div>

                            <p className="mt-2">{item.questionText || "No question text provided"}</p>

                            {item.suggestion && (
                                <p className="mt-1 text-sm italic text-gray-700">
                                Suggestion: {item.suggestion}
                                </p>
                            )}

                            {item.type === "short_answer" && (
                                <input
                                type="text"
                                placeholder="Write your answer here..."
                                className="mt-2 border border-gray-200 rounded-md px-3 py-1 w-full"
                                value={item.StudentAnswer || ""}
                                disabled
                                />
                            )}

                            {item.type === "true_false" && (
                                <div className="mt-2 flex gap-4">
                                {item.options?.map((opt, i) => (
                                    <label key={i} className="flex items-center gap-2">
                                    <input
                                        disabled
                                        type="radio"
                                        name={`q-${index}`}
                                        value={opt}
                                        checked={item.StudentAnswer === opt}
                                    />{" "}
                                    {opt}
                                    </label>
                                ))}
                                </div>
                            )}

                            {item.type === "mcq" && (
                                <div className="mt-2 flex flex-col gap-2">
                                {item.options?.map((opt, i) => (
                                    <label key={i} className="flex items-center gap-2">
                                    <input
                                        disabled
                                        type="radio"
                                        name={`q-${index}`}
                                        value={opt}
                                        checked={item.StudentAnswer === opt}
                                    />{" "}
                                    {opt}
                                    </label>
                                ))}
                                </div>
                            )}
                            </div>
                        );
                    })}

                </div>

                
            </div>
            
        </div>
    </div>

      
  )
}

export default RenderFrom