import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATH } from "../../Utility/ApiPath";
import AxiosInstance from "../../Utility/AxiosInstance";
import { LucideCirclePlus } from "lucide-react";
import moment from "moment";

import Modal from "../../Layouts/Modal";
import CreateAssinmentForm from "./Form/CreateAssinmentForm";
import AssinmentCard from "../../Components/Cards/AssinmentCard";

const CreateAssingment = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);


  const [allAssingment, setallAssingment] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  console.log(page, allAssingment ,totalPages);
  

  const fetchAllAssignments = async (pageNum = 1, limit = 9) => {
    try {
      const response = await AxiosInstance.get(
        `${API_PATH.ASSIGN.ASSINGMENTS}?page=${pageNum}&limit=${limit}`
      );
      console.log(response);
      
      setallAssingment(response.data.data);
      setTotalPages(response.data.totalPages);
      setPage(response.data.page);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAllAssignments(page, 9);
  }, [page]);

  return (
    <div className="relative">
      <div className="h-[110vh] font-urbanist grid grid-cols-1 md:grid-cols-5 md:gap-4 pt-1 pb-6 px-4 md:px-0 min-h-screen ">
        <div
          className="h-[300px] flex flex-col gap-5 items-center justify-center border-2 border-dashed border-purple-300 rounded-md cursor-pointer"
          onClick={() => setOpenCreateModal(true)}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-purple-200/60 rounded-full">
            <LucideCirclePlus className="text-xl text-purple-500" />
          </div>
          <h3 className="font-medium text-gray-800">Add New Assingment</h3>
        </div>

        {allAssingment?.map((challenge) => (
          <AssinmentCard
            tag={"Edit"}
            key={challenge?._id}
            imgurl={challenge?.thumbnail || null}
            title={challenge?.title || "Untitled Resume"}
            dueDate ={challenge?.dueDate || null}
            lastUpdated={
              challenge?.updatedAt
                ? moment(challenge.updatedAt).format("Do MMM YYYY")
                : "Unknown"
            }
            onselect={() => navigate(`/EditAssingments/${challenge._id}`)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 py-4 font-urbanist ">
        <button
          className="btn-small-light disabled:opacity-50"
          onClick={() => setPage((prev)=>prev-1)}
          disabled={page === 1}
        >
          Prev
        </button>
        {
          [...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1; 
            return (
              <div
                key={index}
                onClick={() => setPage(pageNumber)}
                className={`min-w-8 flex items-center border px-3 rounded-md cursor-pointer ${
                  page === pageNumber ? "bg-purple-500 text-white" : ""
                }`}
              >
                {pageNumber}
              </div>
            );
          })
        }

        <button
          className="btn-small-light disabled:opacity-50"
          onClick={() => setPage((prev)=>prev+1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={openCreateModal}
        title={"Add Assingment"}
        onClose={() => setOpenCreateModal(false)}
        type="Banner"
      >
        <CreateAssinmentForm />
      </Modal>
    </div>
  );
};

export default CreateAssingment;
