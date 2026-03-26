import { useEffect, useState,useRef } from "react";
import Axios from "../../axios/api.axios";
import { User, Calendar, Video,Clock } from "lucide-react";


export default function MySessions() {
  // Store all sessions of logged-in student
  const [sessions, setSessions] = useState([]);
const [filter, setFilter] = useState("all");
const [selectedSession, setSelectedSession] = useState(null); //all thress to set reason update 
const [newDate, setNewDate] = useState("");
const [reason, setReason] = useState("");
const inputRef = useRef(null);
  // Fetch sessions once when component loads
  useEffect(() => {
    fetchSessions();
  }, []);

  // API call to get student's sessions
  const fetchSessions = async () => {
    try {
      const res = await Axios.get("/session/my-sessions");
      setSessions(res.data);
    } catch (error) {
      console.log("Error fetching sessions:", error);
    }
  };
const filteredSessions = sessions.filter((s) => {
  if (s.status === "cancelled" || s.status === "rejected") return false;

  const isPast = new Date(s.session_date) < new Date();

  if (filter === "all") return true;
  if (filter === "pending") return s.status === "pending";
  if (filter === "approved") return s.status === "approved" && !isPast;
  if (filter === "ended") return isPast;

  return true;
});
  return (
<div className="mt-10">
    {/* Section Header */}
<div className="mb-6">
  <h2 className="text-xl font-semibold text-slate-800">
    My Sessions
  </h2>
  <p className="text-sm text-gray-500 mt-1">
    Track your upcoming counseling sessions and join them when approved.
  </p>
</div>
 <div className="flex gap-2 mb-4">
  {["all", "pending", "approved", "ended"].map((f) => (
    <button
      key={f}
      onClick={() => setFilter(f)}
      className={`px-3 py-1 rounded text-sm capitalize
        ${
          filter === f
            ? "bg-slate-800 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
    >
      {f}
    </button>
  ))}
</div>
{filteredSessions.length === 0 && (
 <p className="text-gray-600">
Book a session with one of our expert counselors to get personalized career guidance. 
Your sessions will appear here once booked.
</p>
)}



      {/* Loop through all sessions */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredSessions.map((s) => {
                const counselor = s.profiles?.career_profiles?.[0];
            const isPast = new Date(s.session_date) < new Date(); //to disable the past session (23 march)    

        return (
          
<div
  key={s.id}
  className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 transition duration-200
    ${isPast ? "opacity-90 bg-gray-50" : "hover:shadow-lg hover:-translate-y-1"}
  `}
> 

 {/* Top Row */}
   <div className="flex justify-between items-start mb-3">

  <div className="flex items-center gap-2 text-gray-800">
    <User size={18} />
    <span>
      <span className="font-semibold">Counselor:</span>{" "}
      {counselor?.full_name}
    </span>
  </div>

  <div className="flex gap-2">

   <span
  className={`text-xs px-3 py-1 rounded-full font-semibold
    ${
      isPast
        ? "bg-red-100 text-red-700"
        : s.status === "approved"
        ? "bg-green-100 text-green-700"
        : s.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-700"
    }`}
>
  {isPast
    ? "Session Ended"
    : s.status.charAt(0).toUpperCase() + s.status.slice(1)}
</span>

    {s.status === "approved" && !isPast && (
      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
        Upcoming
      </span>
    )}

  </div>

</div>

  {/* Date */}
   <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Calendar size={16} />
                <span>
                  <span className="font-semibold text-gray-700">Date:</span>{" "}
                  {new Date(s.session_date).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

  {/* Join Button if approved */}
  {s.status === "approved" && s.meeting_link && (
  <a
    href={!isPast ? s.meeting_link : "#"}
    target="_blank"
    rel="noreferrer"
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
      ${
        isPast
          ? "bg-gray-400 cursor-not-allowed "
          : "bg-slate-700 text-white hover:bg-slate-600"
      }
    `}
  >
    <Video size={16} />
    {isPast ? "Session Ended" : "Join Session"}
  </a>
)}
{s.rejection_reason && (
  <p className="text-red-600 text-sm mt-2">
    Rejected: {s.rejection_reason}
  </p>
)}
{s.status === "approved" && !isPast && (
  <button
    onClick={() => setSelectedSession(s.id)}
    className="ml-3 px-3 py-2 border rounded text-sm"
  >
    Reschedule
  </button>
)}
  {/* if session is not appreved yet */}
  {s.status === "pending" && (
<p className="text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded-md mt-3 inline-flex items-center gap-1">  <Clock size={14} />
  Waiting for counselor approval
</p>)}
{/* ----------------------------------------reson of date to reschedule ---------------------------------------------- */}

</div>

        );
      })}

</div>
{selectedSession && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center gap-5">
<div className="bg-slate-800 border border-slate-300 p-6 rounded-xl w-[90%] max-w-md text-white shadow-xl">
<h3 className="mb-4 text-lg font-semibold text-white">
  Select Date & Time
</h3>
     <div className="relative mb-4">
  <input
    ref={inputRef}
    type="datetime-local"
    value={newDate}
    min={new Date().toISOString().slice(0,16)}
    onChange={(e) => setNewDate(e.target.value)}
    className="w-full border p-2 pr-10 rounded text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer"
  />

  <Calendar
    size={18}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-white cursor-pointer"
    onClick={() => inputRef.current?.showPicker()}
  />

   
</div>
  
 <textarea
  placeholder="Reason for reschedule"
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  className="border p-2 rounded w-full text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer "
/>
     <div className="flex justify-end gap-3 mt-4">
  <button
    onClick={() => setSelectedSession(null)}
    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
  >
    Cancel
  </button>

  <button
    onClick={async () => {
      await Axios.put(`/session/reschedule/${selectedSession}`, {
  session_date: newDate,
  reschedule_reason: reason,
});
    

      setSelectedSession(null);
      setReason("");
      setNewDate("");
      fetchSessions();
    }}
    className={`px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded
  ${
    !newDate
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-500"
  }
`}
disabled={!newDate}
  >
    Confirm
  </button>
</div>

    </div>
  </div>
)}

    </div>
  );
}