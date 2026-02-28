import { Link, useNavigate } from "react-router-dom";
import Axios from "../axios/api.axios.js";
import { useState } from "react";
import toast from "react-hot-toast";
import Notification from "./Notification.jsx";
import {
  Menu,
  X,
  LayoutDashboard,
  ClipboardList,
  Briefcase,
  MessageSquare,
  BookOpen,
  PlusCircle,
  Sparkles,
  LogOut,
  User,
} from "lucide-react"; 
 
export default function Sidebar( { matchingJobs = [], onBellClick }) {      //if { matchingJobs = [], onBellClick } remove bell will not call on click 
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // mobile toggle
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await Axios.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
      {/* 🔹 Mobile Top Navbar */}
     <div className="md:hidden fixed top-0 left-0 w-full bg-slate-900 text-white flex items-center justify-between px-4 py-3 shadow-lg z-50">

  <h2 className="text-lg font-semibold">CareerConnect</h2>

  <div className="flex items-center gap-4">
<Notification/>
    {/* Hamburger */}
    <Menu size={24} onClick={() => setIsOpen(true)} />

  </div>
</div>

      {/* 🔹 Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 🔹 Sidebar */}
      <div
        className={`
fixed inset-y-0 left-0 w-64
          bg-gradient-to-b from-slate-900 to-slate-800 
          text-white p-6 shadow-xl flex flex-col z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close button (mobile only) */}
        <div className="flex justify-between items-center md:hidden mb-6">
          <h2 className="text-xl font-bold">CareerConnect</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Desktop Title */}
        <h2 className="hidden md:block text-2xl font-bold mb-8 tracking-wide">
          CareerConnect
        </h2>

<ul className="space-y-4 mt-4 md:space-y-4 md:mt-2 ">
  <Link
    to="/dashboard"
    onClick={() => setIsOpen(false)}
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
  >
    <LayoutDashboard size={18} />
    Dashboard
  </Link>

  <Link
    to="/assessment"
    onClick={() => setIsOpen(false)}
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
  >
    <ClipboardList size={18} />
    Assessment
  </Link>

  <Link
    to="/jobs"
    onClick={() => setIsOpen(false)}
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
  >
    <Briefcase size={18} />
    Jobs
  </Link>

  <Link
    to="/forum"
    onClick={() => setIsOpen(false)}
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
  >
    <MessageSquare size={18} />
    Forum
  </Link>

  <Link
    to="/resources"
    onClick={() => setIsOpen(false)}
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
  >
    <BookOpen size={18} />
    Resources
  </Link>

  {localStorage.getItem("role") === "counselor" && (
    <Link
      to="/resources/add"
      onClick={() => setIsOpen(false)}
      className="flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition"
    >
      <PlusCircle size={18} />
      Add Resource
    </Link>
  )}

  <Link
    to="/ai-recommendation"
    onClick={() => setIsOpen(false)}
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
  >
    <Sparkles size={18} />
    AI Recommendation
  </Link>

</ul>
{/* Update Profile - Mobile Only */}

        {/* Logout */}
      {/* Bottom Section */}
{/* Bottom Section */}
<div className="mt-auto space-y-3">

  <Link
    to="/onboarding"
    onClick={() => setIsOpen(false)}
    className="md:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 transition font-medium"
  >
    <User size={18} />
    Update Profile
  </Link>

  <div
    onClick={handleLogout}
    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer transition"
  >
    <LogOut size={18} />
    {logoutLoading ? "Logging..." : "Logout"}
  </div>

</div>
      </div>
    </>
  );
}