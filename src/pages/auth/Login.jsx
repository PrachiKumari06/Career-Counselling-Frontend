import {useState} from 'react'
import toast from 'react-hot-toast';
import Axios from "../../axios/api.axios.js"
import { useNavigate } from "react-router-dom";


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
<div className="min-h-screen flex items-center justify-center 
                bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">      
      <form
      onSubmit={handleSubmit}
      className="w-80 bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl p-8 rounded-xl shadow-lg text-slate-900 flex flex-col gap-4 transition-transform duration-300 hover:scale-[1.02]"
    >
      <h2 className="text-white text-xl font-semibold text-center">
        Login
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        className="p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        className="p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="p-3 bg-slate-700 hover:bg-slate-600 text-white  transition duration-200 rounded-lg font-semibold hover:-translate-y-1 hover:shadow-xl shadow-md cursor-pointer"
      >
        Login
      </button>
<p
  onClick={() => navigate("/forgot-password")}
  className="text-sm  text-slate-300 cursor-pointer hover:underline text-center"
>
  Forgot Password?
</p>
      <p className="text-sm text-center text-gray-300">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/signup")} className="underline hover:text-white cursor-pointer">
          Sign up
        </span>
      </p>
    </form>
  </div>
);

}
