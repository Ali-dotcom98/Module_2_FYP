import { Code } from "lucide-react"
import { formatYearMonth } from "../../../../Utility/Helper"
import LOGO from "../../assests/LOGO.svg"
import CustomTitle from "./CustomTitle"
import Title from "./Title"
const ChallengeHeader = ({data , DEFAULT_THEME}) => {    
  return (
    <div className="relative py-5 border-b-2 grid grid-cols-7 h-40 mb-3 border-b-[#C9C2F8] ">
    <svg
    className="absolute top-6 z-20"
    width="260"
    height="128"
    viewBox="0 0 260 128"
    xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="30%" stopColor="#C9C2F8" />
            <stop offset="70%" stopColor="#E0DBFF" />
            <stop offset="100%" stopColor="#F5F4FF" />
        </linearGradient>
    </defs>
    


    <polygon points="0,0 140,0 220,80 0,80" fill="#6C63FF" opacity="0.60" />
    
    <polygon points="0,10 110,10 190,90 0,90" fill="#8B7EFF" opacity="0.30" />

    <polygon points="0,25 85,25 165,105 0,105" fill="#C9C2F8" opacity="0.65" />
    
    <polygon points="0,40 65,40 145,120 0,120" fill="#E0DBFF" opacity="0.5" />
    
    <foreignObject x="20" y="50" width="240" height="100">
        
    </foreignObject>
</svg>
        <div className={`col-span-7 border-2 border-[#E0DBFF] h-28  translate-y-3`}>
            <div className='w-full grid grid-cols-7'>
                
                <div className='col-span-2 '>
                    
                </div>
                <div className='col-span-5 flex  justify-between  h-40 pr-5 w-full'>
                    <div className='py-4 pl-5 w-full'>
                        
                        <div className="flex flex-col capitalize  items-end">
                            <div className=" flex items-center gap-2 text-gray-900 font-bold text-start  w-full">
                                <Code/>
                                <h1 className=" font-bold ">Code Ascend</h1>
                            </div>
                            <div className="flex items-center justify-between w-full ">
                                <CustomTitle text={data.title} color={DEFAULT_THEME[1]} status={"Medium"} />
                                <p className="flex font-bold text-sm gap-2">
                                    <Title text={`Total Marks:`} color={DEFAULT_THEME[1]} />
                                    {data.totalMarks}
                                </p>
                            </div>
                            <div className="flex gap-4 items-center justify-between  w-full">
                                <p className="flex font-bold text-sm gap-2">
                                    <Title text={`Due Date: `} color={DEFAULT_THEME[1]} />
                                    {
                                        formatYearMonth(data.dueDate)
                                    }
                                </p>
                                <p className="flex font-bold text-sm gap-2">
                                    <Title text={`Difficulty: `} color={DEFAULT_THEME[1]} />  
                                    {data.difficulty}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    
    </div>
  )
}

export default ChallengeHeader