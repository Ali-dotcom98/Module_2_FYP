import React, { useContext } from 'react'
import {UserContext} from  "../../../ContextApi/UserContext"
const Dasboard = () => {
    const {User} = useContext(UserContext)
    const data = 5
  return (
    <>
        <div>Recent</div>
        <div className='grid grid-cols-5 gap-4 h-screen'>
            {
            [... Array(data)].map((_, index)=>(
                <div className='bg-purple-100 h-[45vh]'>{index}</div>
            ))
        }
        </div>

    </>
)
}

export default Dasboard