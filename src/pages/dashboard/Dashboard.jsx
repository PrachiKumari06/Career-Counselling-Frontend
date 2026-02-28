import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import { ReactTyped } from "react-typed";
import img from "../../assets/Consulting-pana.svg";
import BookSession from "./BookSession";
import MySessions from "./MySessions.jsx";
import CounselorRequests from "./CounselorRequests.jsx";
import Axios from "../../axios/api.axios.js";
import { Hand } from "lucide-react";
export default function Dashboard() {

const [userName, setUserName] = useState("");
  const role = localStorage.getItem("role");
const navigate=useNavigate()
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch logged in user name
  const fetchUserProfile = async () => {
    try {
      const res = await Axios.get("/profile/career-profile");
      setUserName(res.data.full_name);
    } catch (error) {
      console.log(error);
    }
  };


  return (

    // Main Layout Wrapper
    <div className="flex bg-slate-100 min-h-screen overflow-x-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Content Section */}
      {/* 
        md:ml-64 → Push content right on desktop
        pt-16 → Give space for mobile top navbar
      */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-0">

        {/* Desktop Navbar Only */}
        <div className="hidden md:block">
<Navbar userName={userName}/>
            </div>

        {/* Main Inner Content */}
        <div className="px-4 md:px-6 pt-6 pb-6">

          {/* ================= Welcome Section ================= */}
          {/* Desktop layout remains same.
              Only mobile font sizes adjusted.
              Small image visible only on mobile. */}
          <div className="relative bg-slate-800 text-white p-8 rounded-xl shadow-lg mb-6 md:mb-8 overflow-hidden">

            <div className="max-w-xl">

              {/* Responsive Heading */}
             <div className="mb-3">

  {/* Static Greeting Line */}
  <div className="flex items-center gap-1 text-2xl md:text-3xl font-bold">
    <span>
      Hey {userName || "there"},
    </span>

    <Hand
      size={22}
      className="text-white animate-wave"
    />
  </div>

  {/* Typed Line Below */}
  <h2 className="mt-2 text-lg md:text-xl text-slate-200 font-medium">
    <ReactTyped
      strings={[
        "Welcome to CareerConnect.",
        "Let’s find your perfect career path.",
        "Your future starts here."
      ]}
      typeSpeed={50}
      backSpeed={30}
      loop
    />
  </h2>

</div>

              {/* Responsive Paragraph */}
              <p className="text-slate-200 mt-4 text-sm md:text-base opacity-50">
                Get personalized guidance, book expert counselors,
                and discover opportunities aligned with your strengths.
              </p>

              {/* Button */}
              <button className="mt-6 bg-white text-slate-800 px-6 py-3 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate("/assessment")}
              >
                Start Exploring
              </button>

              {/* Mobile Image (Only visible on mobile) */}
              <div className="mt-6 md:hidden">
                <img
                  src={img}
                  alt="career illustration"
                  className="w-40 mx-auto"
                />
              </div>

            </div>

            {/* Desktop Glow Effect (unchanged) */}
            <div className="absolute right-16 bottom-12 
                            w-72 h-72 
                            bg-indigo-500/15
                            rounded-full 
                            blur-3xl 
                            hidden md:block">
            </div>

            {/* Desktop Image (unchanged) */}
            <img
              src={img}
              alt="career illustration"
              className="absolute right-6 bottom-0 w-59 h-59 hidden md:block"
            />

          </div>

          {/* ================= Role Based Section ================= */}
          {role === "counselor" ? (
            <CounselorRequests />
          ) : (
            <>
  <BookSession />

  <div className="mt-10 md:mt-12">
    <MySessions />
  </div>
</>
          )}
 

        </div>
      </div>
    </div>
  );
}







/*
<h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">
  <ReactTyped
    strings={[
      `Hey ${userName || "there"}, welcome to CareerConnect!`,
      "Let’s find your perfect career path.",
      "Your future starts here."
    ]}
    typeSpeed={50}
    backSpeed={30}
    loop
  />
</h2>
*/