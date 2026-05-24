import {useState} from 'react'
import toast from 'react-hot-toast';
import Axios from "../../axios/api.axios.js"
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
const [formData, setFormData] = useState({
  email:"",
  password:""
})
const {email,password}=formData;

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await Axios.post("/auth/login", formData);

    toast.success("Login successful!");

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("userId", response.data.userId);  // <-- ADD THIS

    if (!response.data.hasProfile) {
   navigate("/onboarding");
} else {
   navigate("/dashboard");
}

  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    toast.error("Login failed: " + (error.response?.data?.error || error.message));
  }
};
return (
<div
  className="
    min-h-screen
    flex
    items-center
    justify-center
    px-4
   bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
  "
>



    {/* Login Card */}
    <form
      onSubmit={handleSubmit}
      className="
        relative z-10
        w-full max-w-md
        bg-white/10
        backdrop-blur-xl
        border border-white/10
        rounded-3xl
        shadow-[0_8px_32px_rgba(0,0,0,0.35)]
        p-8
        flex flex-col gap-4
      "
    >
      {/* Logo / Title */}
      <div className="text-center mb-2">
        <h1 className="text-4xl font-bold text-white tracking-wide">
          CareerConnect
        </h1>

        <p className="text-slate-300 mt-2 text-sm">
          Your personalized career guidance platform
        </p>
      </div>

      {/* Welcome */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold text-white">
          Welcome Back
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Login to continue your career journey
        </p>
      </div>

      {/* Email */}
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        className="
          w-full
          p-3
          rounded-xl
          bg-white/10
          border border-white/10
          text-white
          placeholder:text-slate-400
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        className="
          w-full
          p-3
          rounded-xl
          bg-white/10
          border border-white/10
          text-white
          placeholder:text-slate-400
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

      {/* Login Button */}
      <button
        type="submit"
        className="
          mt-2
          p-3
          rounded-xl
          bg-slate-900 hover:bg-slate-600
          text-white
          font-semibold
          hover:scale-[1.02]
          transition
          cursor-pointer
        "
      >
        Login
      </button>

      {/* Forgot Password */}
      <p
        onClick={() => navigate("/forgot-password")}
        className="
          text-center
          text-sm
          text-slate-300
          cursor-pointer
          hover:text-white
          hover:underline
        "
      >
        Forgot Password?
      </p>

      {/* Sign Up */}
      <p className="text-center text-sm text-slate-300">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="
            text-blue-400
            hover:text-blue-300
            cursor-pointer
            font-medium
          "
        >
          Sign up
        </span>
      </p>
      <button
  type="button"
  onClick={() => navigate("/")}
  className="
    mt-2
    flex
    items-center
    justify-center
    gap-2
    text-sm
    text-slate-400
    hover:text-white
    transition
    cursor-pointer
  "
>
  <ArrowLeft size={16} />
  Back to Home
</button>
    </form>
  </div>
);



}
