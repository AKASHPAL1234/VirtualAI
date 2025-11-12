import React from "react";
import { useAuth } from "../Context/UserContext";

function Card({ image }) {
  const { selectedImage, setSelectedImage ,setBackendImage,setFrontendImage} = useAuth();

  return (
    <div
      className={` w-[80px] h-[100px] lg:h-[200px] lg:w-[150px]  border-blue-300 rounded-full 
      flex justify-center items-center hover:shadow-2xl
       hover:shadow-red-700 cursor-pointer  `}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null)
        setFrontendImage(null)
        
      }}
    >
      <img
        src={image}
        alt=""
        className={`h-full w-full object-cover  border-blue-300 rounded-2xl  hover:border-4 hover:border-white ${
         selectedImage == image
           ? "border-4 border-white shadow-2xl shadow-red-700"
           : null
       }`}
      />
    </div>
  );
}

export default Card;
