import React from "react";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick,
  type
}) => {
  if (!isOpen) return null;
  console.log(title);
  

  return (
    <div className="font-urbanist fixed inset-0 z-50 flex justify-center items-center w-full h-full round bg-black/40">
        <div className={`relative bg-white  flex flex-col   shadow-lg rounded-lg  ${type == "Banner" ? "w-[39vw] h-[50vh] overflow-hiddn": type=="Confirmation"?"w-[45vw] h-[60vh] overflow-hiddn" : type ==="Groups" ?"w-[60vw] h-[95vh] overflow-y-scroll": type === "small"?"w-[60vw]  md:w-[45vw] lg:w-[39vw] sm:h-[43vh] overflow-hiddn" : type == "Print" ? "w-[45vw] h-[95vh] overflow-x-hidden": "w-[95vw] h-[105vh] overflow-hidden"} `}>

        
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 ">
            <h3 className="md:text-lg font-medium text-gray-900">{title}</h3>
            {showActionBtn && (
              <button
                className="btn-small-light -translate-x-10 flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
                onClick={onActionClick}
              >
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}
          </div>
        )}

       
        <button
          onClick={onClose}
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l12 12M13 1L1 13"
            />
          </svg>
        </button>

        <div className="flex-1 py-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
