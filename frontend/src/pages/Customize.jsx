import React, { useRef, useState } from "react";
import Card from "../component/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image4.png";
import image4 from "../assets/image5.png";
import image5 from "../assets/image6.jpeg";
import image6 from "../assets/image7.jpeg";
import ironman from "../assets/ironman.jfif";
import { LuImagePlus } from "react-icons/lu";
import { useAuth } from "../Context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


function Customize() {
  const {
    frontendImage,
    setBackendImage,
    setFrontendImage,
    setSelectedImage,
    selectedImage,
  } = useAuth();
  const navigate = useNavigate();

  const inputImage = useRef();
  const handelImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setSelectedImage("input");
  };

  return (
    <div className="w-full h-screen
     bg-gradient-to-t from-black
      to-blue-900 border flex items-center justify-center flex-col relative">
        <Link to="/">
        <FaArrowLeft className=" absolute top-2 cursor-pointer left-2 text-2xl text-white flex justify-start" />
        </Link>
      <h1 className="text-white text-3xl  my-2 mb-4">
        Select your <span className="text-red-700"> Assistent Name</span>
      </h1>
      <div className=" w-[90%] h-[100%] max-w-[70%]  flex items-center justify-center flex-wrap gap-2">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={ironman} />
        <div
          className={`w-[80px] h-[100px] lg:h-[200px] lg:w-[150px]
           border-blue-300 rounded-2xl flex justify-center 
           items-center hover:shadow-2xl hover:shadow-red-700
            cursor-pointer   hover:border-4 hover:border-white ${
              selectedImage == "input"
                ? "border-4 border-white shadow-2xl shadow-red-700"
                : null
            }`}
          onClick={() => {
            inputImage.current.click();
          }}
        >
          {!frontendImage && (
            <LuImagePlus className=" text-white w-[50px] h-[70px]" />
          )}
          {frontendImage && (
            <img
              src={frontendImage}
              className="h-full object-cover rounded-2xl"
            ></img>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handelImage}
        />
      </div>
      {selectedImage && (
        <div className="flex ">
          <button
            className=" text-black w-56 rounded-full 
            cursor-pointer border border-white mb-4 p-1 
             bg-white"
            onClick={() => {
              navigate("/cust2");
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Customize;
