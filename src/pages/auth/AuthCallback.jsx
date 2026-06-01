import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "../../axios/api.axios.js";
import { supabase } from "../../supabase/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          toast.error("Google login failed");
          navigate("/login");
          return;
        }

        const mode = new URLSearchParams(window.location.search).get("mode");

       const response = await Axios.post("/auth/google", {
  access_token: data.session.access_token,
  mode,
});

if (mode === "signup") {
  toast.success("Signup successful! Please login.");

  await supabase.auth.signOut();

  navigate("/login");
  return;
}

localStorage.setItem("token", response.data.token);
localStorage.setItem("role", response.data.role);
localStorage.setItem("userId", response.data.userId);

toast.success("Google login successful!");

if (!response.data.hasProfile) {
  navigate("/onboarding");
} else {
  navigate("/dashboard");
}
      } catch (error) {
        toast.error(error.response?.data?.error || "Google login failed");

        await supabase.auth.signOut();

        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
    <div className="animate-rise-in text-center">
      <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-slate-500 border-t-blue-400 animate-spin" />
      <h2 className="text-xl font-semibold">Signing you in...</h2>
      <p className="text-slate-400 text-sm mt-2">
        Please wait while we verify your Google account.
      </p>
    </div>
  </div>
);
}