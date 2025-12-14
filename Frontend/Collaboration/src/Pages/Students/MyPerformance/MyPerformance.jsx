import React, { useEffect, useState } from 'react'
import AxiosInstance from '../../../Utility/AxiosInstance';
import { API_PATH } from '../../../Utility/ApiPath';
import { data } from 'react-router-dom';
import AssinmentCard from '../../../Components/Cards/AssinmentCard';
import moment from 'moment';
import Result from '../../../Components/Cards/Result';
import { formatYearMonth } from '../../../Utility/Helper';
import Modal from '../../../Layouts/Modal';
import { LuDownload } from 'react-icons/lu';
import { LucideDownload } from 'lucide-react';
import DefaultResult from "./DefaultResultFormat"
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const MyPerformance = () => {
    const [Data, setData] = useState([])
    const [display, setdisplay] = useState("")
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, settotalPages] = useState(null)
    const [Assingmentdata, setAssingmentdata] = useState({})
    const [AssingmentDetail, setAssingmentDetail] = useState({})
    const [baseWidth, setBaseWidth] = useState(600);
    const printRef = useRef(null);


    const handleFetchSubmision = async(pageNum = page, limit = 10)=>{
        try {
            const response = await AxiosInstance.get(`${API_PATH.PARTIAL.GET_SUBMIT}?page=${pageNum}&limit=${limit}`);
            console.log(response.data);
            
            if(response.data)
            {
                setData(response.data.result || [])
                settotalPages(response.data.totalPages)
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
         window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page])
    
      const handleDownload = useReactToPrint({
      contentRef: printRef,
      documentTitle: `${AssingmentDetail.title}-Result`,
    });


  return (
    <div>
        <div className="font-urbanist grid grid-cols-1 md:grid-cols-5 md:gap-4 pt-1 pb-6 px-4 md:px-0 min-h-screen">
                {Data?.map((Assingment) => (
                <AssinmentCard
                    tag={"Performance"}
                    ID={Assingment?._id}
                    imgurl={Assingment?.thumbnail || null}
                    title={Assingment?.title || "Untitled Resume"}
                    dueDate={formatYearMonth(Assingment?.dueDate)}
                    lastUpdated={
                    Assingment?.updatedAt
                        ? moment(Assingment.updatedAt).format("Do MMM YYYY")
                        : "Unknown"
                    }
                    onselect={(ID)=>{ConfirmID(Assingment._id), setAssingmentDetail(Assingment)}}
                />
                ))}
        </div>
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
        <div onClick={()=>setdisplay("")}   className={`min-h-screen border rounded-md bg-slate-100 px-5 py-5 absolute w-1/2 top-16 right-0 transform transition-transform duration-500 ease-in-out ${display ? "translate-x-0":"-right-32 translate-x-full"}`}>
          <Result AssingmentDetail={AssingmentDetail} setdisplay={setdisplay} AssingmentID={display} setAssingmentdata={setAssingmentdata} openPreviewModal={openPreviewModal} setOpenPreviewModal={setOpenPreviewModal} />
        </div>
        <Modal
              isOpen={openPreviewModal}
              onClose={() => setOpenPreviewModal(false)}
              title={AssingmentDetail.title}
              showActionBtn
              actionBtnText="Download"
              actionBtnIcon={<LucideDownload className="text-[16px]" />}
              type={"Print"}
              onActionClick={handleDownload}
              
              >
              <div ref={printRef} className="print-area w-[98vw] h-[90vh]">
  <DefaultResult
    AssingmentDetail={AssingmentDetail}
    data={Assingmentdata}
    containerWidth={baseWidth}
    status="Medium"
  />
</div>

        </Modal>
   </div>
  )
}

export default MyPerformance