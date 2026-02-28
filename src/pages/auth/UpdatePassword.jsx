import { useState } from "react";
import Axios from "../../axios/api.axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UpdatePassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Extract token from URL hash
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.substring(1));
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      await Axios.post("/auth/update-password", {
        password,
        access_token,
        refresh_token,
      });

      toast.success("Password updated successfully!");
      navigate("/");

    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      <form
        onSubmit={handleUpdate}
        className="w-96 bg-slate-800 border border-slate-700 
                   shadow-2xl rounded-2xl p-8 
                   flex flex-col gap-5 
                   transition-transform duration-300 hover:scale-[1.02]"
      >
        <h2 className="text-white text-2xl font-semibold text-center">
          Set New Password
        </h2>

        <p className="text-sm text-slate-400 text-center">
          Please enter your new password below.
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 rounded-md bg-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-slate-500"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="p-3 rounded-md bg-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-slate-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="p-3 bg-slate-700 hover:bg-slate-600 
                     text-white transition duration-200 
                     rounded-lg font-semibold 
                     hover:-translate-y-1 hover:shadow-xl 
                     shadow-md cursor-pointer disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <p
          onClick={() => navigate("/")}
          className="text-sm text-center text-gray-400 
                     cursor-pointer hover:text-white"
        >
          Back to Login
        </p>
      </form>
    </div>
  );
}