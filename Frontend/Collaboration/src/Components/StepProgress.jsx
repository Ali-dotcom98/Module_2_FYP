import React from 'react'

const StepProgress = ({progress ,status}) => {
  return (
    <div             
    className={ `h-0.5 bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-300`}
    style={{width : `${progress}%`}}></div>
  )
}

export default StepProgress