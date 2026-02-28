import { useEffect, useState } from "react";
import Axios from "../../axios/api.axios";

export default function CounselorRequests() {
  // Store all session requests for counselor
  const [sessions, setSessions] = useState([]);

  // For approval modal
  const [selectedSession, setSelectedSession] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");

  // Fetch sessions on load
  useEffect(() => {
    fetchSessions();
  }, []);

  // Get counselor sessions
  const fetchSessions = async () => {
    try {
      const res = await Axios.get("/session/counselor-sessions");
      setSessions(res.data);
    } catch (error) {
      console.log("Error fetching counselor sessions:", error);
    }
  };

  // Update session status (approve/reject/cancel)
  const updateStatus = async (id, status) => {
    await Axios.put(`/session/update/${id}`, { status });
    fetchSessions();
  };
// If no sessions, show message
const activeSessions = sessions.filter(
  (s) => s.status !== "cancelled" && s.status !== "rejected"
);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Student Session Requests
      </h2>
      {/* no session show message */}
{activeSessions.length === 0 && (
  <p className="text-gray-600">
    No session requests yet. Once students start booking, you'll see them here!
  </p>
)}
      {/* Loop through active session requests */}
{activeSessions.map((s) => {
        const student = s.profiles?.career_profiles?.[0];

        return (
          <div key={s.id} className="bg-white p-4 rounded shadow mb-3">

            {/* Student Details */}
            <p><strong>Name:</strong> {student?.full_name}</p>
            <p><strong>Education:</strong> {student?.education}</p>
            <p><strong>Skills:</strong> {student?.skills}</p>
            <p><strong>Interests:</strong> {student?.interests}</p>

            {/* Session Date */}
            <p className="mt-2">
              <strong>Date:</strong>{" "}
              {new Date(s.session_date).toLocaleString()}
            </p>

            {/* Status with colors */}
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

            {/* Pending → Approve or Reject */}
            {s.status === "pending" && (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setSelectedSession(s.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(s.id, "rejected")}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            )}

            {/* Approved → Allow cancel before time */}
            {s.status === "approved" &&
              new Date(s.session_date) > new Date() && (
                <button
                  onClick={() => updateStatus(s.id, "cancelled")}
                  className="mt-3 px-4 py-2 bg-gray-600 text-white rounded"
                >
                  Cancel Session
                </button>
              )}

            {/* Show meeting link after approval */}
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

      {/* Approval Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">
              Add Meeting Link
            </h2>

            <input
              type="text"
              placeholder="Paste Google Meet / Zoom link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedSession(null);
                  setMeetingLink("");
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!meetingLink) {
                    alert("Please add meeting link");
                    return;
                  }

                  await Axios.put(`/session/update/${selectedSession}`, {
                    status: "approved",
                    meeting_link: meetingLink,
                  });

                  setSelectedSession(null);
                  setMeetingLink("");
                  fetchSessions();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
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