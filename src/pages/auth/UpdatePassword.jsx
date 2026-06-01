import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../supabase/supabaseClient";

export default function UpdatePassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
  const prepareSession = async () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const errorCode = hashParams.get("error_code");

    if (errorCode === "otp_expired") {
      toast.error("Reset link expired. Please request a new one.");
      navigate("/forgot-password");
      return;
    }

    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        toast.error("Reset link expired or invalid");
        navigate("/forgot-password");
        return;
      }
    }

    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      toast.error("Reset link expired or invalid");
      navigate("/forgot-password");
      return;
    }

    setReady(true);
  };

  prepareSession();
}, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      await supabase.auth.signOut();

      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Verifying reset link...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <form
        onSubmit={handleUpdate}
        className="w-96 bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl p-8 flex flex-col gap-5 transition-transform duration-300 hover:scale-[1.02]"
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
          className="p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="p-3 bg-slate-700 hover:bg-slate-600 text-white transition duration-200 rounded-lg font-semibold hover:-translate-y-1 hover:shadow-xl shadow-md cursor-pointer disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-center text-gray-400 cursor-pointer hover:text-white"
        >
          Back to Login
        </p>
      </form>
    </div>
  );
}