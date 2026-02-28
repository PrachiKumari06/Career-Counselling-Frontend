import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Axios from "../axios/api.axios";
import { useNavigate } from "react-router-dom";

export default function Notification() {
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkMatchingJobs();
  }, []);

  const checkMatchingJobs = async () => {
    try {
      const profileRes = await Axios.get("/profile/career-profile");
      const jobsRes = await Axios.get("/jobs");

      const userSkills =
        profileRes.data.skills?.toLowerCase().split(",").map(s => s.trim()) || [];

      const userInterests =
        profileRes.data.interests?.toLowerCase().split(",").map(s => s.trim()) || [];

      const combined = [...userSkills, ...userInterests];

      const matched = jobsRes.data.filter(job => {
        const jobSkills =
          job.skills_required?.toLowerCase().split(",").map(s => s.trim()) || [];

        return jobSkills.some(skill => combined.includes(skill));
      });

      setMatchingJobs(matched);
      setUnreadCount(matched.length);

    } catch (error) {
      console.log(error);
    }
  };

  const openPopup = () => {
    setShowPopup(true);
    setUnreadCount(0);
  };

  return (
    <>
      {/* Bell */}
      <div className="relative cursor-pointer" onClick={openPopup}>
        <Bell
          size={22}
          className={`text-white ${unreadCount > 0 ? "animate-ring" : ""}`}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl">

            <h2 className="text-lg font-semibold mb-3 text-slate-900">
              Job Notifications
            </h2>

            {matchingJobs.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {matchingJobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => {
                      setShowPopup(false);
                      navigate(`/jobs?highlight=${job.id}`);
                    }}
                    className="p-3 bg-slate-100 rounded cursor-pointer hover:bg-slate-200 transition"
                  >
                    <p className="font-medium text-slate-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600">
                  No jobs matching your profile yet.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 w-full bg-slate-800 text-white py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}