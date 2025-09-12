import React, { useEffect, useState } from 'react'
import AxiosInstance from '../../../Utility/AxiosInstance';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { API_PATH } from '../../../Utility/ApiPath';
import AssinmentCard from '../../../Components/Cards/AssinmentCard';
import moment from 'moment';
import GroupCard from '../../../Components/Cards/GroupCard';

const StudentsAssingments = () => {
    const [Data, setData]= useState([])
    console.log(Data);
    
    const Navigator = useNavigate();
    const location = useLocation();
    const { Assingment } = location.state || {};
    console.log(Assingment);
    
    const {id} = useParams();
        const handleFetchSubmision = async()=>{
            try {
                const response = await AxiosInstance.get(API_PATH.PARTIAL.GET_ASSINGMENT_SUBMISSION(id));
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
                <AssinmentCard
                        tag={"Evaluation"}
                        ID={Assingment?._id}
                        imgurl={Assingment?.thumbnail || null}
                        title={Assingment?.title || "Untitled Resume"}
                        lastUpdated={
                        Assingment?.updatedAt
                            ? moment(Assingment?.updatedAt).format("Do MMM YYYY")
                            : "Unknown"
                        }
                    />
               {
                    Data.map((item,index)=>{
                        return(
                            <GroupCard
                                
                                ID={item?._id}
                                imgurl={item?.thumbnail || null}
                                title={`Group-${index+1}`}
                                group={item.Students}
                                status={item.status}
                                lastUpdated={
                                item?.updatedAt
                                    ? moment(item?.updatedAt).format("Do MMM YYYY")
                                    : "Unknown"
                                }
                                onselect = {()=> 
                                    Navigator(`/EvaluationPanel/${item?._id}`,
                                        { state : { AssingmentTitle  : Assingment?.title }} 
                                )}
                            />
                        )
                    })
                }
        </div>
    </div>
  )
}

export default StudentsAssingments