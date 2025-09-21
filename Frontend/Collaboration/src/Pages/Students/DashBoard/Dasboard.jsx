import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../Utility/AxiosInstance';
import { API_PATH } from '../../../Utility/ApiPath';
import AssinmentCard from '../../../Components/Cards/AssinmentCard';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import NoFound from '../../../Components/NotFound/NotFound';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      setIsLoading(true)
      const result = await AxiosInstance.get(API_PATH.ASSIGN.STUDENTASSINGMENTS);
      if (result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (isLoading) {
    return (
      <div className="font-urbanist text-center py-10">
        Loading...
      </div>
    );
  }


  if (data.length === 0) {
    return (
      <div className="font-urbanist">
        <NoFound />
      </div>
    );
  }


  return (
    <div className="font-urbanist grid grid-cols-1 md:grid-cols-5 md:gap-4 pt-1 pb-6 px-4 md:px-0 min-h-screen">
      {data.map((assignment) => (
        <AssinmentCard
          key={assignment?._id}
          tag="Edit"
          imgurl={assignment?.thumbnail || null}
          title={assignment?.title || 'Untitled Resume'}
          dueDate={moment(assignment?.dueDate).format('Do MMM YYYY')}
          lastUpdated={
            assignment?.updatedAt
              ? moment(assignment.updatedAt).format('Do MMM YYYY')
              : 'Unknown'
          }
          onselect={() => navigate(`/CollaborationPannel/${assignment._id}`)}
        />
      ))}
    </div>
  );
};

export default Dashboard;
