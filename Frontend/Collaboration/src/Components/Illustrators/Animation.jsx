import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/Business team.json.json";

const Animation = () => {
  return (
    <>
        <Lottie 
        animationData={animationData}
        style={{ height: 580, width: 580 }} 
      />
    </>
  );
};

export default Animation;
