import { useEffect, useState } from "react";
import Axios from "../../axios/api.axios";

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
{activeSessions.map((s) => {
            const counselor = s.profiles?.career_profiles?.[0];

        return (
          <div key={s.id} className="bg-white p-6 rounded-xl shadow-md mb-6">

            {/* Counselor Name */}
            {counselor?.full_name && (
              <p>
                <strong>Counselor:</strong> {counselor.full_name}
              </p>
            )}

            {/* Session Date */}
            <p>
              <strong>Date:</strong>{" "}
              {new Date(s.session_date).toLocaleString()}
            </p>

            {/* Session Status with color */}
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  s.status === "approved"
                    ? "text-green-600 font-semibold"
                    : s.status === "pending"
                    ? "text-yellow-600 font-semibold"
                    : s.status === "rejected"
                    ? "text-red-600 font-semibold"
                    : "text-gray-600 font-semibold"
                }
              >
                {s.status}
              </span>
            </p>

            {/* Show meeting link only if approved */}
            {s.status === "approved" && s.meeting_link && (
              <p className="mt-2">
                <strong>Meeting Link:</strong>{" "}
                <a
                  href={s.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Join Session
                </a>
              </p>
            )}

        
          </div>
        );
      })}
    </div>
  );
}