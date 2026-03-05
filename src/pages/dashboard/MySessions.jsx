import { useEffect, useState } from "react";
import Axios from "../../axios/api.axios";
import { User, Calendar, Video } from "lucide-react";


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
    <div>
{/* Section Header */}
<div className="mb-4">

  {/* Mobile Header */}
  <div className="flex items-center gap-3 md:hidden">
    <h2 className="text-lg font-semibold text-slate-800 whitespace-nowrap">
      My Sessions
    </h2>
    <div className="flex-1 h-[1px] bg-slate-300"></div>
  </div>

  {/* Desktop Header (unchanged) */}
  <h2 className="hidden md:block text-xl font-semibold text-slate-800">
    My Sessions
  </h2>

</div>
{activeSessions.length === 0 && (
  <p className="text-gray-600">
Plz book a session with our expert counselors to get personalized career guidance. Your sessions will appear here once booked!
  </p>
)}

      {/* Loop through all sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {activeSessions.map((s) => {
                const counselor = s.profiles?.career_profiles?.[0];

        return (
         <div key={s.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">

  {/* Top Row */}
   <div className="flex justify-between items-center mb-3">

                <div className="flex items-center gap-2 text-gray-800">
                  <User size={18} />
                  <span>
                    <span className="font-semibold">Counselor:</span>{" "}
                    {counselor?.full_name}
                  </span>
                </div>

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
                  {s.status}
                </span>

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

  {/* Join Button */}
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

</div>
        );
      })}

</div>

    </div>
  );
}