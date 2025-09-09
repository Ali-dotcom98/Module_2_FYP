import React from 'react'

const Title = ({ text, color ,status}) => {
     return (
        <div className="relative w-fit mb-2.5">
        <span
            className="absolute bottom-0 left-0 w-full h-2"
            style={{ backgroundColor: color }}
        ></span>
        <h2 className={`relative font-bold ${status ? "text-lg":"text-sm"}`}>{text}</h2>
        </div>
    );
}

export default Title