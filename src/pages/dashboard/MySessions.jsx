import { useCallback, useEffect, useState, useRef } from "react";
import Axios from "../../axios/api.axios";
import { User, Calendar, Video, Clock, RotateCcw, History, MessageSquare, Check } from "lucide-react";
import ChatDrawer from "../../component/ChatDrawer";

const DEFAULT_SLOTS = [
  { time: "10:00 AM", hour: 10, minute: 0 },
  { time: "11:30 AM", hour: 11, minute: 30 },
  { time: "02:00 PM", hour: 14, minute: 0 },
  { time: "04:00 PM", hour: 16, minute: 0 },
  { time: "06:00 PM", hour: 18, minute: 0 },
  { time: "07:30 PM", hour: 19, minute: 30 },
];

export default function MySessions() {
  // Store all sessions of logged-in student
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("Upcoming"); //all, pending, approved, rejected, ended
  const [selectedSession, setSelectedSession] = useState(null); //all thress to set reason update 
  const [newDate, setNewDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const inputRef = useRef(null);

  // 1:1 Chat Drawer State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [chatOtherUserName, setChatOtherUserName] = useState("");
  const [chatOtherUserId, setChatOtherUserId] = useState(null);
  const currentUserId = localStorage.getItem("userId");

  // API call to get student's sessions
  const fetchSessions = useCallback(async () => {
    try {
      const res = await Axios.get("/session/my-sessions");
      setSessions(res.data);
    } catch (error) {
      console.log("Error fetching sessions:", error);
    }
  }, []);

  // Fetch sessions once when component loads
  useEffect(() => {
    const timer = setTimeout(fetchSessions, 0);
    return () => clearTimeout(timer);
  }, [fetchSessions]);
  const now = new Date();
  const visibleSessions = sessions.filter(
    (s) => s.status !== "cancelled" && s.status !== "rejected"
  );
  const upcomingSessions = visibleSessions.filter(
    (s) => new Date(s.session_date) >= now
  );
  const endedSessions = visibleSessions.filter(
    (s) => new Date(s.session_date) < now
  );

  const filteredSessions = sessions.filter((s) => {
    if (s.status === "cancelled") return false;

    const isPast = new Date(s.session_date) < now;

    if (filter === "Upcoming" || filter === "all")
      return !isPast && (s.status === "approved" || s.status === "pending");

    if (filter === "pending")
      return s.status === "pending" && !isPast;

    if (filter === "approved")
      return s.status === "approved" && !isPast;

    if (filter === "rejected")
      return s.status === "rejected";

    if (filter === "ended")
      return isPast;

    return true;
  });
  return (
    <div className="mt-10 w-full overflow-hidden">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          My Sessions
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Track your upcoming counseling sessions and join them when approved.
        </p>
      </div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["Upcoming", "pending", "approved", "rejected", "ended"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium capitalize transition
        ${filter === f
                  ? "bg-slate-900 text-white shadow"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-slate-300"
                }`}
            >
              {f === "all" ? "upcoming" : f}
            </button>
          ))}
        </div>
        <div className="flex gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} /> {upcomingSessions.length} upcoming
          </span>
          <span className="inline-flex items-center gap-1">
            <History size={14} /> {endedSessions.length} ended
          </span>
        </div>
      </div>
      {filteredSessions.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
          <p className="font-medium text-slate-800">
            {filter === "ended" ? "No completed sessions yet." : `No ${filter} sessions right now.`}

          </p>
          <p className="mt-1 text-sm">
            Book a session with one of our expert counselors to get personalized career guidance.
          </p>
        </div>
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
    ${isPast
                        ? "bg-red-100 text-red-700"
                        : s.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : s.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : s.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {s.status === "rejected"
                      ? "Session Rejected"
                      : isPast && s.status === "pending"
                        ? "Expired"
                        : isPast && s.status === "approved"
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

              {/* Action Buttons: Join, Chat, Reschedule */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {/* Join Button if approved */}
                {s.status === "approved" && s.meeting_link && (
                  <a
                    href={!isPast ? s.meeting_link : "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
        ${isPast
                        ? "bg-gray-400 cursor-not-allowed "
                        : "bg-slate-700 text-white hover:bg-slate-600"
                      }
      `}
                  >
                    <Video size={16} />
                    {isPast ? "Session Ended" : "Join Session"}
                  </a>
                )}

                {/* 1:1 Realtime Chat Button if approved */}
                {s.status === "approved" && (
                  <button
                    onClick={() => {
                      setChatSessionId(s.id);
                      setChatOtherUserName(counselor?.full_name || "Counselor");
                      setChatOtherUserId(s.counselor_id);
                      setChatOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer shadow-sm"
                  >
                    <MessageSquare size={15} />
                    Chat
                  </button>
                )}

                {s.status === "approved" && !isPast && (
                  <button
                    onClick={() => setSelectedSession(s.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <RotateCcw size={15} />
                    Reschedule
                  </button>
                )}
              </div>
              {/* if session is not approved yet */}
              {s.status === "pending" && !isPast && (
                <p className="text-xs text-yellow-700 bg-yellow-50 px-3 py-2 rounded-md mt-3 inline-flex items-center gap-1">
                  <Clock size={14} />
                  Waiting for counselor approval
                </p>
              )}

              {s.status === "pending" && isPast && (
                <p className="text-xs text-red-700 bg-red-50 px-3 py-2 rounded-md mt-3 inline-flex items-center gap-1">
                  <Clock size={14} />
                  Session expired without confirmation
                </p>
              )}

              {s.status === "rejected" &&
                typeof s.rejection_reason === "string" &&
                s.rejection_reason.trim() !== "" && (
                  <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-3">
                    <p className="font-medium text-red-700">
                      Reason: {s.rejection_reason}
                    </p>
                  </div>
                )}
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
            <div className="relative mb-3">
              <input
                ref={inputRef}
                type="date"
                value={newDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  setNewDate(e.target.value);
                  setSelectedSlot(null);
                }}
                className="w-full border border-slate-600 p-2.5 pr-10 rounded-xl text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
              />
              <Calendar
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
              />
            </div>

            {newDate && (
              <div className="mb-4">
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Select New Slot:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DEFAULT_SLOTS.map((slot) => {
                    const isSelected = selectedSlot?.time === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2 rounded-lg text-xs font-medium border transition ${
                          isSelected
                            ? "bg-blue-600 border-blue-500 text-white shadow-sm"
                            : "bg-slate-700 border-slate-600 text-slate-200 hover:border-slate-400 cursor-pointer"
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <textarea
              placeholder="Reason for reschedule"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border border-slate-600 p-2.5 rounded-xl w-full text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-3"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedSession(null);
                  setNewDate("");
                  setSelectedSlot(null);
                  setReason("");
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!newDate || !selectedSlot}
                onClick={async () => {
                  const [year, month, day] = newDate.split("-").map(Number);
                  const dateObj = new Date(year, month - 1, day, selectedSlot.hour, selectedSlot.minute, 0);
                  const fullDate = dateObj.toISOString();

                  await Axios.put(`/session/reschedule/${selectedSession}`, {
                    session_date: fullDate,
                    reschedule_reason: reason,
                  });

                  setSelectedSession(null);
                  setReason("");
                  setNewDate("");
                  setSelectedSlot(null);
                  fetchSessions();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition cursor-pointer"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 1:1 Realtime Chat Drawer */}
      <ChatDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        sessionId={chatSessionId}
        currentUserId={currentUserId}
        otherUserName={chatOtherUserName}
        otherUserId={chatOtherUserId}
      />

    </div>
  );
}
