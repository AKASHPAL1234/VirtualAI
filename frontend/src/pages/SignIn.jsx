import { useState } from "react";
import bg from "../assets/image2.jpg";
import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/UserContext";

function SignIn() {
  const [showpassword, setShowpassword] = useState(false);
  const {profile,setProfile}=useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handelSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(
        "https://virtualaibackend-5ara.onrender.com/api/user/singin",
        {  email, password },
        {
          withCredentials: true,
        }
      );
      setProfile(result.data)
      console.log(result);
      setLoading(false);
      alert(result.data.message || "SignIn successful!");
      navigate("/")

    } catch (error) {
      console.log(error);
      setProfile(null)
      setLoading(false);
      setErr(error.response.data.message);      
    }
  };

  return (
    <div
      className="h-screen w-full max-w-screen bg-black bg-cover flex justify-center items-center text-white "
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[80%] h-96 max-w-[400px] bg-[#00000098]  background-blur flex flex-col items-center justify-center gap-2"
        onSubmit={handelSignIn}
      >
        <h1 className="text-white text-2xl my-5 font-semibold">
          SighIn in <span className="text-red-700">VirtualAssistent</span>
        </h1>
        
        <input
          type="email"
          placeholder=" Email"
          className="border border-white w-full outline-none
         p-2 rounded-full txet-bold placeholder-gray-300 bg-transparent  mb-2"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div
          className="border border-white w-full outline-none
         p-2 rounded-full txet-bold placeholder-gray-300 bg-transparent relative"
        >
          <input
            type={showpassword ? "text" : "password"}
            placeholder="Password"
            className=" border-white w-full outline-none
       rounded-full txet-bold placeholder-gray-300 bg-transparent   "
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showpassword ? (
            <IoIosEyeOff
              className=" absolute top-[13px] right-[20px] cursor-pointer"
              onClick={() => setShowpassword(true)}
            />
          ) : (
            <FaEye
              className=" absolute top-[13px] right-[20px] cursor-pointer"
              onClick={() => setShowpassword(false)}
            />
          )}
        </div>

        {err.length > 0 && <p className="text-red-500 ">*{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-56 rounded-full cursor-pointer border border-white mt-2 p-1 text-black 
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-white hover:bg-yellow-100"
    }
  `}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p
          className="text-xl cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create account? <span className="text-blue-400">signUp</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;

