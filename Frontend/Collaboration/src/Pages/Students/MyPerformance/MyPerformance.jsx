import React, { useEffect, useState } from 'react'
import AxiosInstance from '../../../Utility/AxiosInstance';
import { API_PATH } from '../../../Utility/ApiPath';
import { data } from 'react-router-dom';
import AssinmentCard from '../../../Components/Cards/AssinmentCard';
import moment from 'moment';
import Result from '../../../Components/Cards/Result';
const MyPerformance = () => {
    const [Data, setData] = useState([])
    const [display, setdisplay] = useState("")

    const handleFetchSubmision = async()=>{
        try {
            const response = await AxiosInstance.get(API_PATH.PARTIAL.GET_SUBMIT);
            console.log(response.data);
            
            if(response.data)
            {
                setData(response.data || [])
            }
        } catch (error) {
            console.log(error);
            
            
        }
    }
    const ConfirmID = (ID)=>{
        console.log(ID);
        
    setdisplay(ID);
  }

    useEffect(() => {
        handleFetchSubmision();
    }, [])
    

  return (
    <div>
        <div className="font-urbanist grid grid-cols-1 md:grid-cols-5 md:gap-4 pt-1 pb-6 px-4 md:px-0 min-h-screen">
                {Data?.map((Assingment) => (
                <AssinmentCard
                    tag={"Performance"}
                    ID={Assingment?._id}
                    imgurl={Assingment?.thumbnail || null}
                    title={Assingment?.title || "Untitled Resume"}
                    lastUpdated={
                    Assingment?.updatedAt
                        ? moment(Assingment.updatedAt).format("Do MMM YYYY")
                        : "Unknown"
                    }
                    onselect={(ID)=>ConfirmID(ID)}
                />
                ))}
        </div>
        <div onClick={()=>setdisplay("")}   className={`min-h-screen border rounded-md bg-slate-50 px-5 py-5 absolute w-1/2 top-0 right-0 transform transition-transform duration-500 ease-in-out ${display ? "translate-x-0":"-right-32 translate-x-full"}`}>
                <Result AssingmentID = {display}/>
        </div>
   </div>
  )
}

export default MyPerformance