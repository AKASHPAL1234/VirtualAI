import axios from "axios";
import React from "react";
import { useState } from "react";
import { useAuth } from "../Context/UserContext";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Customize2() {
  const {
    selectedImage,
    backendImage,
    setSelectedImage,
    setBackendImage,
    setFrontendImage,
    setProfile,
    profile
  } = useAuth();
  const navigate=useNavigate()
  const [assistentname, setAssistentname] = useState(
    profile?.assistentname || ""
  );
  const [loading,setLoading]=useState(false)

  const handelupdate = async () => {
    try {
      setLoading(true)
      let formData = new FormData();
      formData.append("assistentname", assistentname);
      if (backendImage) {
        formData.append("assistentimage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        "http://localhost:8000/api/cur/update",
        formData,
        { withCredentials: true }
      );
      console.log(result.data)
      setProfile(result.data)
      setLoading(false)
      navigate("/")
      
      
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <div
        className="w-full h-screen
     bg-gradient-to-t from-black
      to-blue-900 border flex items-center justify-center flex-col relative"
      >
        <Link to="/cust">
        <FaArrowLeft className=" absolute top-2 cursor-pointer left-2 text-2xl text-white flex justify-start" />
        </Link>
        <h1 className="text-white text-3xl  my-2 mb-4">
          Enter your <span className="text-red-700"> Assistent Name</span>
        </h1>
        <input
          type="text"
          placeholder="eg:Sky_AI"
          className="border border-white w-full max-w-[500px] outline-none
         p-3 rounded-full txet-bold placeholder-gray-300 bg-transparent  mb-2 text-white"
         required onChange={(e)=>{setAssistentname(e.target.value)}}
         value={assistentname}
        />
        {
          assistentname && <button
          className=" text-black w-56 rounded-full 
            cursor-pointer border border-white mb-4 p-2 my-2
             bg-white" onClick={handelupdate}
        >
          {!loading?"Create your assistent":"Loading..."}
          
        </button>
        }
        
      </div>
    </>
  );
}

export default Customize2;
