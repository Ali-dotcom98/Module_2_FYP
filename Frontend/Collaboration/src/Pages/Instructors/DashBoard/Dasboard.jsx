import React, { useEffect, useState } from "react";

import { API_PATH } from "../../../Utility/ApiPath";
import AxiosInstance from "../../../Utility/AxiosInstance";
import { formatYearMonth } from "../../../Utility/Helper"; // your custom formatter
import { LucideCirclePlus, Table } from "lucide-react";
import AssinmentCard from "../../../Components/Cards/AssinmentCard";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import BarChart from "../../../Components/Cards/AssingmentChart";
import Table1 from "../../../Components/Table1"

const Dashboard = () => {
    const [data, setData] = useState([]);
    const navigator = useNavigate();

    const [allAssingment, setallAssingment] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAllAssignments = async (pageNum = 1, limit = 9) => {
        try {
        const response = await AxiosInstance.get(
            `${API_PATH.ASSIGN.ASSINGMENTS}?page=${pageNum}&limit=${limit}`
        );
        setallAssingment(response.data.data);
        setTotalPages(response.data.totalPages);
        setPage(response.data.page);
        } catch (error) {
        console.error("Error fetching assignments:", error);
        }
    };

useEffect(() => {
    fetchAllAssignments(page, 3);
}, [page]);


    useEffect(() => {
    const fetchStats = async () => {
        try {
        const res = await AxiosInstance.get(API_PATH.ASSIGN.STATS);
        const formatted = res.data.map((item) => ({
            ...item,
            date: moment(item._id).format("Do MMM"),
        }));
        setData(formatted);
        } catch (error) {
        console.error("Error fetching stats", error);
        }
    };
    fetchStats();
    }, []);

    return (
        <>
            <div className=" font-urbanist mb-2">
                <p className='w-fit text-[12px] font-medium text-white bg-[#6c63ff] px-3 py-0.5 rounded mt-1'>
                    Recently Created 
                </p>
            </div>
            <div className=" font-urbanist flex border p-4 rounded-md mt-3">
                <div className="flex gap-4 ">
                    {allAssingment?.map((challenge) => (
                        <div className="w-[33vh]">
                            <AssinmentCard
                                tag={"Edit"}
                                key={challenge?._id}
                                imgurl={challenge?.thumbnail || null}
                                title={challenge?.title || "Untitled Resume"}
                                lastUpdated={
                                challenge?.updatedAt
                                    ? moment(challenge.updatedAt).format("Do MMM YYYY")
                                    : "Unknown"
                                }
                                onselect={() => navigator(`/EditAssingments/${challenge._id}`)}
                            />
                        </div>
                    ))}
                </div>
                <div className="relative w-1/3 h-[40vh] border  ml-5 p-3 translate-y-10">
                    <div className=" font-urbanist mb-2 absolute -top-10 left-0">
                        <p className='w-fit text-[12px] font-medium text-white bg-[#6c63ff] px-3 py-0.5 rounded mt-1'>
                            {new Date(Date.now()).getFullYear()}
                        </p>
                    </div>
                    
                    <BarChart data={data}/>
                </div>
            </div>
            
            <div className="mt-7">
                <div className=" font-urbanist ">
                    <p className='w-fit text-[12px] font-medium text-white bg-[#6c63ff] px-3 py-0.5 rounded mt-1'>
                        Assignments Overview
                    </p>
                </div>
                <Table1 tableData={allAssingment}/>
            </div>
        </>
    );
};

export default Dashboard;
