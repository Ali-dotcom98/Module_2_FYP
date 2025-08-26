import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATH } from '../../Utility/ApiPath'
import AxiosInstance from "../../Utility/AxiosInstance";

import { LucideCirclePlus } from "lucide-react";
import moment from "moment"

import Modal from "../../Layouts/Modal";
import CreateAssinmentForm from "./Form/CreateAssinmentForm";
import AssinmentCard from "../../Components/Cards/AssinmentCard";

const CreateAssingment = () => {
const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [AllChallenge, setAllChallenge] = useState(null)
    const fetchAllResumes = async () => {
    try {
        const response = await AxiosInstance.get(API_PATH.ASSIGN.ASSINGMENTS); 
        setAllChallenge(response.data);
    } catch (error) {
        console.error("Error fetching resumes:", error);
    }
    };

  useEffect(() => {
    fetchAllResumes();
  }, []);
  return (
    <div>Form";
        <div className="font-urbanist grid grid-cols-1 md:grid-cols-5 md:gap-4 pt-1 pb-6 px-4 md:px-0 min-h-screen">
            <div
            className="h-[300px] flex flex-col gap-5 items-center justify-center border-2 border-dashed border-purple-300 rounded-md cursor-pointer "
            onClick={() => setOpenCreateModal(true)}
            >
            <div className="w-12 h-12 flex items-center justify-center bg-purple-200/60 rounded-full">
                <LucideCirclePlus className="text-xl text-purple-500" />
            </div>
            <h3 className="font-medium text-gray-800">Add New Compettion</h3>
            </div>
            {AllChallenge?.map((Challenge) => (
            <AssinmentCard
                key={Challenge?._id}
                imgurl={Challenge?.thumbnailLink || null}
                title={Challenge?.title || "Untitled Resume"}
                lastUpdated={
                Challenge?.updatedAt
                    ? moment(Challenge.updatedAt).format("Do MMM YYYY")
                    : "Unknown"
                }
                onSelect={() => navigate(`/EditAssingments/${Challenge._id}` )}
            />
            ))}
        </div>

        <Modal
        isOpen={openCreateModal}
        title={"Add Competiton"}
        onClose={() => setOpenCreateModal(false)}
        
        type= "Banner"
        >
            <CreateAssinmentForm/>
        </Modal>


    </div>
  )
}

export default CreateAssingment