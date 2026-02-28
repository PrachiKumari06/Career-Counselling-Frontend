import { useState } from "react";
import Axios from "../../axios/api.axios";
import toast from "react-hot-toast";
import {useNavigate  } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
 const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Axios.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error sending email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl w-80 flex flex-col gap-4"
      >
        <h2 className="text-white text-center text-lg">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-md text-slate-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
          required
        />

        <button
          type="submit"
          className="p-3 bg-slate-600 text-white rounded-lg border border-slate-500 hover:bg-slate-500 transition-colors duration-300 cursor-pointer"
        >
          Send Reset Link
        </button>
        <p 
        className="text-sm text-slate-400 text-center cursor-pointer hover:text-slate-300 underline transition-colors duration-300 cursor-pointer"
        onClick={() => navigate("/")}>
            Go to Login
            </p>
      </form>
    </div>
  );
}