import React, { useEffect, useRef, useState } from 'react'
import { LuArrowLeft, LuDownload, LuSave, LuTrash2 } from 'react-icons/lu'
import TitleInput from '../../Components/Inputs/TitleInput'
import StepProgress from '../../Components/StepProgress'
import Modal from '../../Layouts/Modal'
import { useNavigate, useParams } from 'react-router-dom'
import AxiosInstance from '../../Utility/AxiosInstance'
import { API_PATH } from '../../Utility/ApiPath'
import AssignmentBasicInfoForm from './Form/AssignmentBasicInfoForm'
import AssignmentBodyForm from './Form/AssignmentBodyForm'

const EditAssingments = () => {
    const navigator = useNavigate();
    const resumeRef = useRef();

    const {AssingmentId} = useParams();
    const [currentPage, setcurrentPage] = useState("assignment-body")
    const [errorMsg, seterrorMsg] = useState("")
    const [isLoading, setisLoading] = useState(false)
    const [DeleteModel, setDeleteModel] = useState(false)
    const [baseWidth, setBaseWidth] = useState(800);
    const [Buffer, setBuffer] = useState(false)
    const [progress, setprogress] = useState(0)
    const [DefaultInfo, setDefaultInfo] = useState({
        title : "",
        description : "",
        dueDate : "",
        totalMarks : "",
        difficulty : "",
        questions:[
            {
                type : "",
                questionText :"",
                options : "",
                marks : null ,
                answer : ""
            }
        ],
        sections : 
        [
            {title:"",
            description:"",
            questions : [""]}
        ],
        settings:{
            groupSettings:{
                groupsDetail : [""],
                numberOfGroups : "",
                studentsPerGroup : "",
                assignmentMode : ""
            },
            allowLateSubmission : false,
            visibility : ""
        }  

    })

    const FetchAssingment = async()=>{
        try {
            const result = await AxiosInstance.get(API_PATH.ASSIGN.ASSINGMENTSID(AssingmentId))

            if(result.data){
                const data = result.data
                setDefaultInfo((prev)=>({
                    ...prev , 
                    title : data.title || prev.title,
                    description : data.description || prev.description,
                    dueDate : data.dueDate || prev.dueDate,
                    totalMarks : data.totalMarks || prev.totalMarks,
                    difficulty : data.difficulty || prev.difficulty,
                    questions : data.questions || prev.questions,
                    sections : data.sections || prev.sections,
                    settings: data.settings || prev.settings, 

                }))
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }



    const RenderForm = () => {
  switch (currentPage) {
    case "basic-info":
      return (
        <AssignmentBasicInfoForm
          title={DefaultInfo?.title}
          description={DefaultInfo?.description}
          dueDate={DefaultInfo?.dueDate}
          totalMarks={DefaultInfo?.totalMarks}
          difficulty = {DefaultInfo?.difficulty}
        //   updateSection={(key, value) => updateSection(key, value)}
        />
      );

    case "assignment-body":
      return (
        <AssignmentBodyForm
          questions={DefaultInfo?.questions}
          addQuestion={(newQ) => AddItemInArray("questions", newQ)}
          removeQuestion={(index) => RemoveItemInArray("questions", index)}
          updateQuestion={(index, key, value) =>
            updateArrayItem("questions", index, key, value)
          }
        />
      );

    // case "settings":
    //   return (
    //     <AssignmentSettingsForm
    //       groups={DefaultAssignment?.groups}
    //       studentsPerGroup={DefaultAssignment?.studentsPerGroup}
    //       allowLateSubmission={DefaultAssignment?.allowLateSubmission}
    //       isPublic={DefaultAssignment?.isPublic}
    //       updateSection={(key, value) => updateSection(key, value)}
    //     />
    //   );

    default:
      return null;
  }
};

    const AddItemInArray = (key , value)=>{
        setDefaultInfo((prev)=>(
            {
                ...prev,
                [key]:
                [
                    ...prev[key],
                    value,
                ]
            }
        ))
    }

    const RemoveItemInArray = (section , index)=>{
        setDefaultInfo((prev)=>{
            const updateArray = [...prev[section]]

            updateArray.splice(index , 1);
            return(
            {   ...prev,
                [section]: updateArray
            }
            )
        })
    }

    useEffect(()=>{
        FetchAssingment();
    },[])
  return (
      <div className="container mx-auto font-urbanist">
        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4 mt-4">
        
        <div className="flex items-center gap-4">
            <button
            className="btn-small-light"
            // onClick={gotoHome}
            >
            <LuArrowLeft className="text-[16px]" />
            <span className="hidden md:block">Home</span>
            </button>
            {/* <TitleInput
            title={DefaultChlng.title}
            setTitle={(value) =>
            setDefaultChlng((prevState) => ({
                ...prevState,
                title: value,
            }))
            }
        /> */}

        </div>
        
        <div className="flex items-center gap-4">

            <button
            className="btn-small-light"
            // onClick={()=> setDeleteModel(true)}
            >
            <LuTrash2 className="text-[16px]" />
            <span className="hidden md:block">Delete</span>
            </button>

            <button
            className="btn-small-light "
            // onClick={() => setOpenPreviewModal(true)}
            >
            <LuDownload className="text-[16px]" />
            <span className="hidden md:block ">Preview & Download</span>
            </button>
        </div>
        </div>
        <div className='w-full flex flex-col md:flex-row gap-2 '>
            <div className='flex flex-col md:flex-row w-full gap-2'>
               <div className='border border-red p-2 w-[20vh] space-y-2'>
                    {/* Short Answer */}
                    <button
                        className='border w-full'
                        onClick={() =>
                        AddItemInArray("questions", {
                            type: "short_answer",
                            questionText: "",
                            options: [],
                            marks: "",
                            answer: ""
                        })
                        }
                    >
                        Short Answer
                    </button>

                    {/* Multiple Choice Question */}
                    <button
                        className='border w-full'
                        onClick={() =>
                        AddItemInArray("questions", {
                            type: "mcq",
                            questionText: "",
                            options: ["", ""], // at least 2 options
                            marks: "",
                            answer: ""
                        })
                        }
                    >
                        Multiple Choice
                    </button>

                    {/* True/False */}
                    <button
                        className='border w-full'
                        onClick={() =>
                        AddItemInArray("questions", {
                            type: "true_false",
                            questionText: "",
                            options: ["True", "False"],
                            marks: "",
                            answer: ""
                        })
                        }
                    >
                        True / False
                    </button>

                    {/* Paragraph / Long Answer */}
                    <button
                        className='border w-full'
                        onClick={() =>
                        AddItemInArray("questions", {
                            type: "code",
                            questionText: "",
                            options: [],
                            marks: "",
                            answer: ""
                        })
                        }
                    >
                        Paragraph
                    </button>
                    </div>`


                {/* Form */}
                <div className='w-full '>
                    <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">
                        <StepProgress progress= {10} />
                        
                        { 
                        RenderForm(currentPage)
                        }
                        
                        {/* {errorMsg && (
                        <div className=" flex items-center text-[11px] gap-2 font-medium  justify-center text-amber-600 bg-amber-100 py-0.5 px-2 my-1 rounded ">
                            <LuCircleAlert className="text-md" />
                            {errorMsg}
                        </div>
                        )} */}

                        
                        <div className="flex items-end justify-end  p-5 gap-3">
                        <button
                            // onClick={goBack}
                            disabled={currentPage === "basic-info"}
                            className={`btn-small-light ${currentPage === "basic-info" ? "cursor-none opacity-50" : ""}`}
                        >
                        <LuArrowLeft className="text-[16px]" />

                        Back
                        </button>


                    <button
                        className="btn-small-light flex items-center gap-2 border"
                        // onClick={upLoadChallengeImage}
                        disabled={isLoading}
                    >
                        <LuSave className="text-[16px]" />

                        {isLoading ? "Updating..." : "Save & Exit"}
                    </button>

                        <button
                            className="btn-small flex items-center gap-2"
                            // onClick={validateAndNext}
                            disabled={isLoading}
                        >
                            {currentPage === "examples" ? (
                            <>
                                <LuDownload className="text-[16px]" />
                                Preview & Download
                            </>
                            ) : (
                            <>
                                <LuArrowLeft className="text-[16px] rotate-180" />

                                Next
                            </>
                            )}
                        </button>
                        </div>

                    </div>
                </div>
            </div>
            <div className='border border-red p-2  w-full'>
                <div className="h-[100vh] bg-gray-100 rounded-lg shadow">
                {/* <RenderFrom
                    // data = {DefaultChlng}
                    // containerWidth = {baseWidth}
                /> */}
            </div>
            </div>
        </div>
        <Modal
            // isOpen = {DeleteModel}
            // onClose = {()=> setDeleteModel((prev)=>!prev)}
            title={`DeleteCompetition`}
            type={"Banner"}
        >
            {/* <DeleteCard 
                // DefaultChlng = {DefaultChlng}
                // DeleteChallenge = {DeleteChallenge}
            /> */}

        </Modal>
    </div>
)

}

export default EditAssingments