import { useEffect, useState } from "react";
import Axios from "../../axios/api.axios";
import { User, Calendar, Video,Clock } from "lucide-react";


export default function MySessions() {
  // Store all sessions of logged-in student
  const [sessions, setSessions] = useState([]);

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
const activeSessions = sessions.filter(
  (s) => s.status !== "cancelled" && s.status !== "rejected"
);
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
 
{activeSessions.length === 0 && (
 <p className="text-gray-600">
Book a session with one of our expert counselors to get personalized career guidance. 
Your sessions will appear here once booked.
</p>
)}

      {/* Loop through all sessions */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {activeSessions.map((s) => {
                const counselor = s.profiles?.career_profiles?.[0];

        return (
         <div key={s.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-200">
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
          s.status === "approved"
            ? "bg-green-100 text-green-700"
            : s.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-700"
        }`}
    >
      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
    </span>

    {s.status === "approved" && (
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
      href={s.meeting_link}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-600 transition"
    >
    <Video size={16} />
                  Join Session
                </a>
              )}
  {/* if session is not appreved yet */}
  {s.status === "pending" && (
<p className="text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded-md mt-3 inline-flex items-center gap-1">  <Clock size={14} />
  Waiting for counselor approval
</p>)}

</div>
        );
      })}

</div>

    </div>
  );
}