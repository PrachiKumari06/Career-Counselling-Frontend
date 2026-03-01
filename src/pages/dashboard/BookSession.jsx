import React from "react";
import CounselorCard from "../../component/CounselorCard";
import Axios from "../../axios/api.axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

export default function BookSession() {
    const [counselors, setCounselors] = useState([]);
      const [search, setSearch] = useState("");
     useEffect(() => {
      fetchCounselors();
    }, []);
    
      const fetchCounselors = async () => {
        try {
          const res = await Axios.get("/profile/match-counselors");
          setCounselors(res.data);
        } catch (error) {
          console.log(error);
        }
      };
     
    const filteredCounselors = counselors.filter((c) => {
      const profile = c.career_profiles?.[0];
      if (!profile) return false;
    
      const text = (
        profile.full_name +
        profile.skills +
        profile.education +
        profile.bio+
  String(profile.experience)
      ).toLowerCase();
    
      return text.includes(search.toLowerCase());
    });
    // to onclick on book session button
    const [selectedCounselor, setSelectedCounselor] = useState(null);
const [sessionDate, setSessionDate] = useState(null);
const handleBookSession = async () => {
  if (!sessionDate) {
    toast.error("Please select date and time");
    return;
  }

  try {
    await Axios.post("/session/book", {
      counselor_id: selectedCounselor,
session_date: sessionDate?.toISOString(),
    });

    toast.success("Session booked successfully!");
    setSelectedCounselor(null);
    setSessionDate("");

  } catch (error) {
    toast.error(error.response?.data?.error || "Something went wrong");
  }
};
  return (
    <>
{/* Section Header */}
{/* Section Header */}
<div className="mb-6">

  {/* Mobile Version */}
  <div className="flex items-center gap-3 md:hidden">
    <h2 className="text-lg font-semibold text-slate-800 whitespace-nowrap">
      Book a Session
    </h2>
    <div className="flex-1 h-[1px] bg-slate-300"></div>
  </div>

  {/* Desktop Version (unchanged layout) */}
  <div className="hidden md:flex items-center justify-between">
    <h2 className="text-xl font-semibold text-slate-800">
      Book a Session
    </h2>

    <input
      type="text"
      placeholder="Search by skill or specialization..."
      onChange={(e) => setSearch(e.target.value)}
      className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 transition"
    />
  </div>

  {/* Mobile Search */}
  <div className="mt-4 md:hidden">
    <input
      type="text"
      placeholder="Search by skill or specialization..."
      onChange={(e) => setSearch(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 transition"
    />
  </div>

</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCounselors.map((c) => (
          <CounselorCard key={c.id} counselor={c} onBook={setSelectedCounselor} />
        ))}
      </div>
      {/* when click on book session button, show modal or form to set session date */}
      {selectedCounselor && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
    <div className="bg-slate-800 border border-slate-300 p-6 rounded-xl w-96">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Select Date & Time
      </h2>

     <div className="relative mb-4">
  <Calendar className="absolute left-3 top-3 text-white" size={18} />

  <DatePicker
    selected={sessionDate}
    onChange={(date) => setSessionDate(date)}
    showTimeSelect
    timeIntervals={30}
    dateFormat="dd/MM/yyyy h:mm aa"
    placeholderText="Select date and time"
    className="w-full pl-10 border p-2 rounded text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer"
  />
</div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setSelectedCounselor(null)}
          className="px-4 py-2 border  bg-slate-700 hover:bg-slate-600 text-white hover:translate-x-1 rounded cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleBookSession}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white hover:translate-x-1 rounded border cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}
