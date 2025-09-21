import React, { useEffect, useRef, useState } from 'react'
import { LuArrowLeft, LuCheck, LuCircleAlert, LuDownload, LuFileText, LuList, LuPen, LuSave, LuTrash2 } from 'react-icons/lu'
import TitleInput from '../../Components/Inputs/TitleInput'
import StepProgress from '../../Components/StepProgress'
import Modal from '../../Layouts/Modal'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AxiosInstance from '../../Utility/AxiosInstance'
import { API_PATH } from '../../Utility/ApiPath'
import AssignmentBasicInfoForm from './Form/AssignmentBasicInfoForm'
import AssignmentBodyForm from './Form/AssignmentBodyForm'
import Settings from './Form/Settings'
import RenderFrom from './Form/RenderForm'
import { LucideEdit, Rewind } from 'lucide-react'
import { captureElementAsImage, dataURLtoFile, fixTailwindColors } from '../../Utility/Helper'
import DeleteCard from '../../Components/Cards/DeleteCard'

const EditAssingments = () => {
    const navigator = useNavigate();
    const resumeRef = useRef(); 
    const {AssingmentId} = useParams();
    const [currentPage, setcurrentPage] = useState("basic-info")
    const [errorMsg, seterrorMsg] = useState("")
    const [isLoading, setisLoading] = useState(false)
    const [DeleteModel, setDeleteModel] = useState(false)
    const [baseWidth, setBaseWidth] = useState(600);
    const [Buffer, setBuffer] = useState(false)
    const [progress, setprogress] = useState(0)
    const [DefaultInfo, setDefaultInfo] = useState({
        title : "",
        description : "",
        dueDate : "",
        totalMarks : "",
        difficulty : "",
        thumbnail : "",
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

    console.log("DefaultInfo",DefaultInfo);
    
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
                    settings: {
                        ...prev.settings,              
                        ...data.settings,             
                        groupSettings: {
                            ...prev.settings.groupSettings,       
                            ...(data.settings?.groupSettings || {})
                        }
                    }


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
                UpdateSection = {(key,value)=>UpdateSection(null ,null,  key , value)}
            />
            );

        case "assignment-body":
        return (
            <AssignmentBodyForm
            questions={DefaultInfo?.questions}
            addQuestion={(newQ) => AddItemInArray("questions", newQ)}
            removeQuestion={(index) => RemoveItemInArray("questions", index)}
            UpdateItemInArray={(index, key, value) =>
                UpdateItemInArray("questions", index, key, value)
            }
            AddItemInNestedArray= {(index, key, value)=>AddItemInNestedArray("questions",index, key , value)}
            UpdateItemInNestedArray = {(index, subindex , key , value)=>UpdateItemInNestedArray("questions",index , subindex ,key ,value)}
            />
        );

        case "settings":
            return (
            <Settings
            
            allowLateSubmission={DefaultInfo?.settings?.allowLateSubmission}
            visibility={DefaultInfo?.settings?.visibility}
            groupsDetail={DefaultInfo?.settings?.groupSettings?.groupsDetail}
            studentsPerGroup={DefaultInfo?.settings?.groupSettings?.studentsPerGroup}
            assignmentMode={DefaultInfo?.settings?.groupSettings?.assignmentMode}
            numberOfGroups={DefaultInfo?.settings?.groupSettings?.numberOfGroups}
            UpdateSection={(subsection ,key, value ) => UpdateSection("settings", subsection , key, value)}
            />
            );

        default:
        return null;
  }
};

    const gotoHome = ()=>{
        navigator("/Instructor/CreateAssingment")
    }
    const UpdateSection = (section , subsection, key , value)=>
    {
        if(!section)
        {
            setDefaultInfo((prev)=>({
                ...prev,
                [key]: value
            }))
        }  
        if(section && !subsection)
        {
            setDefaultInfo((prev)=>({
                ...prev,
                [section]:
                {
                    ...prev[section],
                    [key]: value
                }
            }))
        }
        if(section && subsection)
        {
            setDefaultInfo((prev)=>({
                ...prev,
                [section]:{
                    ...prev[section],
                    [subsection]:
                    {
                        ...prev[section][subsection],
                        [key] : value
                    }
                }
            }))
        }
    }
    const UpdateItemInArray = (section , index , key , value)=>{
        setDefaultInfo((prev)=>{
            const updateArray = [...prev[section]]
            updateArray[index]={
                ...updateArray[index],
                [key]:value
            }
            return(
                {
                    ...prev,
                    [section]: updateArray
                }
            )
        })
    }

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

    const AddItemInNestedArray= (section , index ,key , value)=>{
        setDefaultInfo((prev)=>{
            const updateArray = [...prev[section]]
            updateArray[index]={
                ...updateArray[index],
                [key]: [...updateArray[index][key], value]
            }
            return (
                {
                    ...prev,
                    [section]: updateArray
                }
            )
        })
    }
    const UpdateItemInNestedArray= (section , index, subindex ,key , value)=>{
            setDefaultInfo((prev) => {
            const updateArray = [...prev[section]];
            updateArray[index] = {
            ...updateArray[index],
            [key]: updateArray[index][key].map((item, idx) =>
                idx === subindex ? value : item
            ),
            };
            return {
            ...prev,
            [section]: updateArray,
            };
        });
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
    const goBack = ()=>{
        const Pages = [
            "basic-info",
            "assignment-body",
            "settings"
        ]
        const index = Pages.indexOf(currentPage);
        setcurrentPage(Pages[index-1]);
         const percent = Math.round(((index-1) / (Pages.length - 1)) * 100);
        setprogress(percent)
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    const Next = ()=>{
        const Pages = [
            "basic-info",
            "assignment-body",
            "settings"
        ]
        const index = Pages.indexOf(currentPage);
        setcurrentPage(Pages[index+1]);
        const percent = Math.round(((index+1) / (Pages.length - 1)) * 100);
        setprogress(percent)
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    const validateAndNext = (e) => {
    const errors = [];

    switch (currentPage) {
        case "basic-info": {
            const { title, description, dueDate, difficulty } = DefaultInfo;

            if (!title.trim()) errors.push("Title is required.");
            
            if (!description.trim()) 
                errors.push("Description is required.");
            
            if (!dueDate.trim()) 
                errors.push("Due date is required.");
            
            if (new Date(dueDate) < new Date()) 
                errors.push("Due date must be in the future.");
        
            
            if (!difficulty.trim()) 
                errors.push("Difficulty level is required.");

            break;
            }


        case "assignment-body": {
            DefaultInfo.questions.forEach(({ type, questionText, options , marks , answer} ,Mainindex) => {
                if (!questionText.trim( )) errors.push(`Question text is required for question ${Mainindex + 1}.`);
                if (!marks) errors.push(`Marks are required for question ${Mainindex + 1}.`);
                if (type === "mcq") {   
                options.forEach((item, index) => {
                    if (!item?.trim()) {
                    errors.push(`Option ${index + 1} is required for question ${Mainindex + 1}.`);
                    }
                });
                }
                if(type == "true_false")
                {
                    if(!answer.trim())
                     errors.push(`Answer Required for True / False`);

                }

            });

            break;
            }


        case "test-cases": {
            DefaultChlng.testCases.forEach(({ input, expectedOutput }, index) => {
                if (!input) errors.push(`Input is required for Test Case ${index + 1}.`);
                if (!expectedOutput.trim()) errors.push(`Expected Output is required for Test Case ${index + 1}.`);
            });
            break;
        }

        case "examples": {
             if (DefaultChlng.examples.length === 0) {
                errors.push("At least one Example is required.");
            }
            DefaultChlng.examples.forEach(({ input, output }, index) => {
                if (!input.trim()) errors.push(`Input is required for Example ${index + 1}.`);
                if (!output.trim()) errors.push(`Output is required for Example ${index + 1}.`);
            });
            break;
        }
    }

    if (errors.length > 0) {
        seterrorMsg(errors[0]); 
    } else {
        seterrorMsg("");
        Next();
    }
};

    useEffect(()=>{
        FetchAssingment();
    },[])

    useEffect(() => {
    window.scrollTo(0, 0);
    }, []);

    useEffect(()=>{
        const TotalMarks = DefaultInfo.questions.reduce((count,item)=>{
            return count = count+ (Number(item.marks) || 0)
        },0)
        console.log("TotalMarks",TotalMarks);
        

        setDefaultInfo((prev)=>(
            {
                ...prev,
                totalMarks : TotalMarks,
            }
        ))
        
    },[DefaultInfo.questions])

    const upLoadAssingmentImage = async () => {
    try {
        console.log("Here");
        
        setisLoading(true);
        fixTailwindColors(resumeRef.current);

        const imageDataUrl = await captureElementAsImage(resumeRef.current);

        // Convert base64 to File
        const thumbnailFile = dataURLtoFile (

            imageDataUrl,
            `Assingment-${AssingmentId}.png`
        );
        

        const ThumbnailForStudent = null;
        
        

        const formData = new FormData();
        // if (ThumbnailForStudent) formData.append("profileImage", profileImageFile);
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

        const uploadResponse = await AxiosInstance.put(
            API_PATH.ASSIGN.UPLOAD_THUMBNAIL(AssingmentId),
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        const { thumbnail } = uploadResponse.data;
        console.log("thumbnailLink", thumbnail);
        
        
        await updateAssingmentDetails (thumbnail)
        gotoHome();


    } catch (error) {
        console.error("Error uploading images:", error);
        
    } finally {
        setisLoading(false);
    }
};

    const updateAssingmentDetails = async (thumbnail) => {
    try {
        setisLoading(true);
        const response = await AxiosInstance.put(
            API_PATH.ASSIGN.UPDATE(AssingmentId),
            {
                ...DefaultInfo,
                thumbnail : thumbnail
            }
        );
        
       
    } catch (err) {
        console.error("Error capturing image:", err);
    } finally {
        setisLoading(false);
    }
};  
    const HandleDelete = async()=>{
        const result = await AxiosInstance.delete(API_PATH.ASSIGN.DELETE(AssingmentId));
        if(result)
        {
            navigator("/Instructor/CreateAssingment")
        }
    }

  return (
    <div className="container mx-auto font-urbanist">
        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4 mt-4">
        
        <div className="flex items-center gap-4">
            <button
            className="btn-small-light"
            onClick={gotoHome}
            >
            <LuArrowLeft className="text-[16px]" />
            <span className="hidden md:block">Home</span>
            </button>
            <TitleInput
            title={DefaultInfo.title}
            setTitle={(value) =>
            setDefaultInfo((prevState) => ({
                ...prevState,
                title: value,
            }))
            }
        />

        </div>
        
        <div className="flex items-center gap-4">

            <button
            className="btn-small-light"
            onClick={()=> setDeleteModel(true)}
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
                <div className='text-xs space-y-5 flex flex-row md:flex-col   w-full  p-2 md:w-[20vh] py-3 border border-purple-100 rounded-md md:h-[83vh] items-center justify-center md:justify-start '>
                    {/* Short Answer */}
                    <h1 className='text-sm font-medium text-center mt-3 hidden md:block'>Types</h1>
                    <button
                        className=' w-full'
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
                        <div className="relative   flex items-center justify-center">
                            <div className=' p-2 rounded-md  text-purple-800 bg-purple-600/15 border border-purple-200 hover:border-purple-400'>
                                <LuPen className="peer text-[16px] " />
                            <p className="absolute w-full border top-0 bg-purple-200 rounded-md px-1 py-0.5 font-medium translate-x-8 ml-2 opacity-0 peer-hover:opacity-100 transition">
                                Short Answer
                            </p>
                            </div>
                        </div>

                    </button>

                    {/* Multiple Choice Question */}
                    <button
                        className=' w-full'
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
                        <div className="relative   flex items-center justify-center">
                            <div className=' p-2 rounded-md  text-purple-800 bg-purple-600/15 border border-purple-200 hover:border-purple-400'>
                                <LuList className="peer text-[16px] " />
                            <p className="absolute z-50 w-full border top-0 bg-purple-200 rounded-md px-1 py-0.5 font-medium translate-x-8 ml-2 opacity-0 peer-hover:opacity-100 transition">
                                MCQs
                            </p>
                            </div>
                        </div>
                        
                    </button>

                    {/* True/False */}
                    <button
                        className=' w-full'
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
                        <div className="relative   flex items-center justify-center">
                            <div className=' p-2 rounded-md  text-purple-800 bg-purple-600/15 border border-purple-200 hover:border-purple-400'>
                                <LuCheck className="peer text-[16px] " />
                            <p className="absolute z-50 w-full border top-0 bg-purple-200 rounded-md px-1 py-0.5 font-medium translate-x-8 ml-2 opacity-0 peer-hover:opacity-100 transition">
                                True / False
                            </p>
                            </div>
                        </div>
                        
                    </button>

                    {/* Paragraph / Long Answer */}
                    <button
                        className=' w-full'
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
                        <div className="relative   flex items-center justify-center">
                            <div className=' p-2 rounded-md  text-purple-800 bg-purple-600/15 border border-purple-200 hover:border-purple-400'>
                                <LuFileText className="peer text-[16px] " />
                            <p className="absolute w-full border top-0 bg-purple-200 rounded-md px-1 py-0.5 font-medium translate-x-8 ml-2 opacity-0 peer-hover:opacity-100 transition">
                                Paragraph
                            </p>
                            </div>
                        </div>
                       
                    </button>
                    </div>`
                {/* Form */}
                <div className='w-full '>
                    <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">
                        <StepProgress progress= {progress} />
                        { 
                        RenderForm(currentPage)
                        }
                    
                        {errorMsg && (
                        <div className=" flex items-center text-[11px] gap-2 font-medium  justify-center text-amber-600 bg-amber-100 py-0.5 px-2 my-1 rounded ">
                            <LuCircleAlert className="text-md" />
                            {errorMsg}
                        </div>
                        )} 

                        
                        <div className="flex items-end justify-end  p-5 gap-3">
                        <button
                            onClick={goBack}
                            disabled={currentPage === "basic-info"}
                            className={`btn-small-light ${currentPage === "basic-info" ? "cursor-none opacity-50" : ""}`}
                        >
                        <LuArrowLeft className="text-[16px]" />

                        Back
                        </button>


                    <button
                        className="btn-small-light flex items-center gap-2 border"
                        onClick={upLoadAssingmentImage}
                        disabled={isLoading}
                    >
                        <LuSave className="text-[16px]" />

                        {isLoading ? "Updating..." : "Save & Exit"}
                    </button>

                        {
                            currentPage != "settings" && (
                                 <button
                            className="btn-small-light flex items-center gap-2 border"
                            onClick={validateAndNext}
                            disabled={isLoading}
                        >
                            {currentPage === "settings" ? (
                            <>
                                <LuDownload className="text-[16px]" />
                                Preview & Save
                            </>
                            ) : (
                            <>
                                <LuArrowLeft className="text-[16px] rotate-180" />
                                Next
                            </>
                            )}
                        </button>
                            )
                        }
                       
                        </div>

                    </div>
                </div>
            </div>
            <div ref={resumeRef} className=' border border-purple-100 rounded-md  w-[47%]'>
                <div  className="rounded-lg h-[100vh]">
                        <RenderFrom
                            data = {DefaultInfo}
                            containerWidth = {baseWidth}
                            status={"Medium"}
                        />
                </div>
            </div>
        </div>
        <Modal
            isOpen = {DeleteModel}
            onClose = {()=> setDeleteModel((prev)=>!prev)}
            title={`Delete Assingment`}
            type={"small"}
        >
            <DeleteCard 
                AssingmentInfo = {DefaultInfo}
                HandleDelete = {HandleDelete}
            />

        </Modal>
    </div>
)

}

export default EditAssingments