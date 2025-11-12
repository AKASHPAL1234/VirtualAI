import { useEffect } from "react";
import { useState } from "react";

import { createContext } from "react";
import axios from "axios";
import { useContext } from "react";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  
  const [profile, setProfile] = useState();
  const [gemniresponse, setGemniresponse] = useState();
   const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);


    
   const getGeminiResponse= async(command)=>{
      try {
        const result=await axios.post("https://virtualaibackend-5ara.onrender.com/api/cur/asktoassistent",{command},{
          withCredentials:true
        })
        
        console.log(result.data)
        return result.data
        
      } catch (error) {
        console.log(error)
        
      }

    }

  useEffect(() => {
    const fetchprofile = async () => {
      try {
       
        
          const { data } = await axios.get(
          "http://localhost:8000/api/cur/current",
          {
            withCredentials: true,
          }
        );

        console.log("User profile:", data);
        setProfile(data);
      
        

        
      } catch (error) {
        console.error("Failed to fetch profile:", error);
       
      }
    };

 

  
    fetchprofile();
    
  }, []);
  return (
    <AuthContext.Provider value={{ profile,setProfile,frontendImage,setBackendImage,backendImage,setFrontendImage,selectedImage, setSelectedImage,getGeminiResponse }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
// export default AuthProvider

