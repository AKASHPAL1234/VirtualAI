import React, { use, useRef, useState } from "react";
import { useAuth } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import userimg from "../assets/user.gif";
import aiimg from "../assets/ai.gif";
import { RxHamburgerMenu } from "react-icons/rx";

function Home() {
  const { profile, setProfile, getGeminiResponse } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState();
  const [usertext, setUsertext] = useState("");
  const [aitext, setAitext] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); 
  const issepeakingRef = useRef(false);
  const isrecognitionRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const handellogout = async () => {
    try {
      const result = await axios.get("https://virtualaibackend-5ara.onrender.com/api/user/logout", {
        withCredentials: true,
      });
      setProfile(null);
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const startRecogonition = () => {
   

   
    try {
      recognitionRef.current?.start();
      setListing(true);
    } catch (error) {
      if (!error.message.includes("start")) {
        console.error("Recogonition error:", error);
      }
    }
       
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterence = new SpeechSynthesisUtterance(text);

    // utterence.lang='hi-IN';
    // const voice=window.speechSynthesis.getVoices()
    // const hindiVoice=voice.find(v=>v.lang==='hi-In')
    // if(hindiVoice){
    //   utterence.voice=hindiVoice
    // }

    issepeakingRef.current = true;
    startRecogonition();
    utterence.onend = () => {
      setAitext("");
      
      issepeakingRef.current = false;
      setTimeout(() => {
        startRecogonition()
      }, 800);
    };
    synth.cancel();
    synth.speak(utterence);
  };

  const handelcommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "facebook_open") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.facebook.com/search?q=${query}`, "_blank");
    }

    if (type === "instagram_open") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.instagram.com/search?q=${query}`, "_blank");
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }

    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }

    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new speechRecognition();
    (recognition.continuous = true), (recognition.lang = "en-US");

    recognitionRef.current = recognition;

    const safeRecognition = () => {
      if (!issepeakingRef.current && !isrecognitionRef.current) {
        try {
          recognition.start();
          console.log("Recognition start:");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.log("start error:", error);
          }
        }
      }
    };
    recognition.onstart = () => {
      console.log("Recogonition started");
      isrecognitionRef.current = true;
      setListing(true);
    };

    recognition.onend = () => {
      console.log("Recogonition end");
      isrecognitionRef.current = false;
      setListing(false);

      if (!issepeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recogonition error :", event.error);
      isrecognitionRef.current = false;
      setListing(false);
      if (event.error != "aborted" && !issepeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard " + transcript);
      if (
        transcript.toLowerCase().includes(profile.assistentname.toLowerCase())
      ) {
        setAitext("");
        setUsertext(transcript);
        recognition.stop();
        isrecognitionRef.current = false;
        setListing(false);
        const data = await getGeminiResponse(transcript);
        console.log(data);
        handelcommand(data);
        setAitext(data.response);
        setUsertext("");
      }
    };

    const fallback = setInterval(() => {
      if (!issepeakingRef.current && !isrecognitionRef.current) {
        safeRecognition();
      }
    }, 10000);
    safeRecognition();

    return () => {
      recognition.stop();
      setListing(false);
      isrecognitionRef.current = false;
      clearInterval(fallback);
    };
  }, []);

  return (
      <div
      className="w-full h-screen bg-gradient-to-t from-black to-blue-900 border 
      flex flex-col items-center justify-center relative"
    >
      {/* Hamburger Menu Button - visible only on small screens */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-4 right-4 text-white text-3xl lg:hidden"
      >
        <RxHamburgerMenu />
      </button>

      {/* Sidebar (History + Buttons) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black/90 text-white z-20 
  flex flex-col items-center p-0 transition-transform duration-300 
  ${menuOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0 
  lg:h-[350px] lg:w-[300px] lg:bg-transparent lg:p-2 lg:absolute lg:top-[170px] lg:right-[15px]`}
      >
        {/* Close Button (for mobile only) */}
        <button
          onClick={() => setMenuOpen(false)}
          className="text-white text-2xl self-end lg:hidden"
        >
          ✖
        </button>

         <button
          onClick={() => {
            navigate("/cust");
            setMenuOpen(false);
          }}
          className="w-full rounded-full border border-white   p-2 bg-white text-black hover:bg-gray-200"
        >
          Go To Customize
        </button>

         <button
          onClick={() => {
            handellogout();
            setMenuOpen(false);
          }}
          className="w-full rounded-full border border-white mt-3 mb-2 p-2 bg-white text-black hover:bg-gray-200"
        >
          Logout
        </button>

        {/* History Box */}
        <div
          className="overflow-y-auto w-full flex flex-col gap-2 text-sm 
          max-h-[60vh] p-2 bg-gray-800/50 rounded-lg lg:bg-transparent"
        >
          {profile?.history?.length > 0 ? (
            profile.history.map((his, i) => (
              <p key={i} className="text-white border-b border-gray-600 pb-1">
                {his}
              </p>
            ))
          ) : (
            <p className="text-gray-400">No history yet</p>
          )}
        </div>

        {/* Buttons */}
       

       
      </div>

      {/* Profile Image */}
      <div className="h-[300px] w-[200px] rounded-2xl shadow-2xl">
        <img
          src={profile?.assistentimage}
          alt="Assistant"
          className="object-cover h-full w-full rounded-2xl"
        />
      </div>

      {/* Name */}
      <h1 className="text-3xl text-white mt-3">I'm {profile?.assistentname}</h1>

      {/* Avatar (User or AI Image) */}
      {!aitext && <img src={userimg} className="w-[200px]" alt="User" />}
      {aitext && <img src={aiimg} className="w-[200px]" alt="AI" />}

      {/* Text Message */}
      <h1 className="text-white text-xl text-center px-3 mt-2">
        {usertext ? usertext : aitext ? aitext : ""}
      </h1>

      {/* Overlay background when mobile menu open */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-10 lg:hidden"
        ></div>
      )}
    </div>
  );
}

export default Home;




// <div
//       className="w-full h-screen
//      bg-gradient-to-t from-black
//       to-blue-900 border flex items-center justify-center flex-col relative"
//     >
//       <div className="  h-[350px] absolute w-[300px] top-[170px] right-[15px] text-white  truncate flex-col scroll-auto overflow-y-auto p-2 rounded-lg  hidden lg:block">
        
//         {profile.history?.map((his) => (
//           <p className="text-white">{his}</p>
         
          
// ))}
      
//       </div>
      

//       <button
//         className=" text-black w-56 rounded-full 
//             cursor-pointer border border-white mb-4 p-2 my-2
//              bg-white absolute right-[4px] top-[30px]  hidden lg:block "
//         onClick={() => {
//           navigate("/cust");
//         }}
//       >
//         Go To Custmozie
//       </button>
//       <button
//         className=" text-black w-56 rounded-full 
//             cursor-pointer border border-white mb-4 p-2 my-2
//              bg-white absolute right-1 top-[100px] hidden lg:block"
//         onClick={handellogout}
//       >
//         Logout
//       </button>
//       <div className=" h-[300px] w-[200px] rounded-4xl shadow-2xl   ">
//         <img
//           src={profile?.assistentimage}
//           alt=""
//           className="object-cover h-full w-full rounded-2xl"
//         />
//       </div>

//       <h1 className="text-3xl text-white flex justify-center mt-3">
//         I'm {profile?.assistentname}
//       </h1>
//       {!aitext && <img src={userimg} className="w-[200px]" />}
//       {aitext && <img src={aiimg} className="w-[200px]" />}
//       <h1 className="text-white text-xl">
//         {usertext ? usertext : aitext ? aitext : null}
//       </h1>

//     </div>
