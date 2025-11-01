import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/Business team.json.json";

const Animation = () => {
  return (
    <>
        <Lottie 
        animationData={animationData}
        style={{ height: 530, width: 530 }} 
      />
    </>
  );
};

export default Animation;
