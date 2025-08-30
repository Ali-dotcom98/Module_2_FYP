import React from 'react'
import AxiosInstance from '../../../Utility/AxiosInstance'
import { API_PATH } from '../../../Utility/ApiPath'
import { useState } from 'react'
import { useEffect } from 'react'
import AssinmentCard from '../../../Components/Cards/AssinmentCard'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const Dasboard = () => {
  const [data, setdata] = useState([])
  const navigate = useNavigate();

  const fetchAssingment = async()=>{
    const result = await AxiosInstance.get(API_PATH.ASSIGN.STUDENTASSINGMENTS);
    if(result.data){
      setdata(result.data);
    }
  }

  useEffect(()=>{
    fetchAssingment();
  },[])
  return (
      <div className="font-urbanist grid grid-cols-1 md:grid-cols-5 md:gap-4 pt-1 pb-6 px-4 md:px-0 min-h-screen">
            {data?.map((Assingment) => (
            <AssinmentCard
                key={Assingment?._id}
                imgurl={Assingment?.thumbnailLink || null}
                title={Assingment?.title || "Untitled Resume"}
                lastUpdated={
                Assingment?.updatedAt
                    ? moment(Assingment.updatedAt).format("Do MMM YYYY")
                    : "Unknown"
                }
                onSelect={() => navigate(`/CollaborationPannel/${Assingment._id}` )}
            />
            ))}
        </div>
  )
}

export default Dasboard