import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from "@heroicons/react/24/outline";


const BackArrow = ({to = null, label="back"}) => {
    const navigate = useNavigate();


    const handleClick = () => {
        if (to ){
            navigate(to)
        }else {
            navigate(-1)
        }
    }
  return (
   <button onClick={handleClick} 
    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
<ArrowLeftIcon className='w-5 h-5'/>
<span>{label}</span>
   </button>
  )
}

export default BackArrow