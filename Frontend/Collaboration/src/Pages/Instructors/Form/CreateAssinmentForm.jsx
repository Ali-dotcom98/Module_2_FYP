import React, { useState } from 'react'
import Input from "../../../Components/Inputs/Input"

import { useNavigate } from 'react-router-dom'
import AxiosInstance from '../../../Utility/AxiosInstance'
import { API_PATH } from '../../../Utility/ApiPath'

const CreateAssinmentForm = () => {
  const [Title, setTitle] = useState("")
  const [error, seterror] = useState("")
  const navigate = useNavigate();

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (!Title) {
      seterror("Please enter a challenge title");
      return;
    }
    seterror("")
    const response = await AxiosInstance.post(API_PATH.ASSIGN.CREATE, { title: Title })
    if (response.data?._id) {
      navigate(`/EditAssingments/${response.data?._id}`);
    }
  }

  return (
    <div className="font-urbanist w-[90vw] md:w-[39vw] px-6 flex flex-col justify-center ">
      <h3 className="text-lg font-semibold text-black">Create New Assingments</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Give your competition a title to get started. You can edit all details later.
      </p>

      <form onSubmit={handleCreateChallenge}>
        <Input
          value={Title}
          onchange={(e) => setTitle(e.target.value)}
          label="Problem Title"
          placeholder="e.g., Palindrome Checker"
          type="text"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type="submit" className="btn-primary">
          Create Challenge
        </button>
      </form>
    </div>
  )
}

export default CreateAssinmentForm
