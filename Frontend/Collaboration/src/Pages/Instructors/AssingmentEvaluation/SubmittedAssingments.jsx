import React, { useEffect, useState } from 'react'
import AxiosInstance from '../../../Utility/AxiosInstance';
import { API_PATH } from '../../../Utility/ApiPath';
import { data, useNavigate } from 'react-router-dom';
import AssinmentCard from '../../../Components/Cards/AssinmentCard';
import moment from 'moment';
const SubmittedAssingments = () => {
  const Navigate = useNavigate();
    const [Data, setData] = useState([])
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
    

    useEffect(() => {
        handleFetchSubmision();
    }, [])
    

  return (
    <div>
        <div className="font-urbanist grid grid-cols-1 md:grid-cols-5 md:gap-4 pt-1 pb-6 px-4 md:px-0 min-h-screen">
                {Data?.map((Assingment) => (
                <AssinmentCard
                    tag={"Evaluation"}
                    ID={Assingment?._id}
                    imgurl={Assingment?.thumbnailLink || null}
                    title={Assingment?.title || "Untitled Resume"}
                    lastUpdated={
                    Assingment?.dueDate
                        ? moment(Assingment.dueDate).format("Do MMM YYYY")
                        : "Unknown"
                    }
                     onselect={() =>
                      Navigate
                      (
                        `/Instructor/Evaluation/${Assingment?._id}`, 
                        {state: { Assingment},}
                    )
                  }
                />
                ))}
        </div>
   </div>
  )
}

export default SubmittedAssingments