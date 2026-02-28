import { useEffect, useState } from "react";
import Axios from "../../axios/api.axios";
import Sidebar from "../../component/Sidebar";
import {toast} from "react-hot-toast";
import { useLocation } from "react-router-dom";

export default function Jobs() {

  // ==============================
  // STATE MANAGEMENT
  // ==============================

  // All jobs from database
  const [jobs, setJobs] = useState([]);

  // Search filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // Track which jobs user already applied to
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Store resume file per job (jobId => file)
  const [resumeFiles, setResumeFiles] = useState({});

  // Loading state
  const [loading, setLoading] = useState(true);

// to show the card highlighted when notification one will click 
const locationHook = useLocation();
const queryParams = new URLSearchParams(locationHook.search);
const highlightId = queryParams.get("highlight");
  // ==============================
  // FETCH DATA ON LOAD
  // ==============================

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);


  // ==============================
  // FETCH ALL JOBS
  // ==============================

  const fetchJobs = async () => {
    try {
      const res = await Axios.get("/jobs");
      setJobs(res.data);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };


  // ==============================
  // FETCH APPLIED JOBS
  // So Apply button remains disabled after refresh
  // ==============================

  const fetchAppliedJobs = async () => {
    try {
      const res = await Axios.get("/jobs/my-applications");

      // Extract job IDs
      const appliedJobIds = res.data.map((app) => app.jobs.id);

      setAppliedJobs(appliedJobIds);

    } catch (error) {
      console.log("Error fetching applied jobs:", error);
    }
  };


  // ==============================
  // APPLY TO JOB
  // ==============================

  const apply = async (jobId) => {

    // Get resume selected for this specific job
    const resumeFile = resumeFiles[jobId];

    if (!resumeFile) {
      toast.error("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("job_id", jobId);
    formData.append("resume", resumeFile);

    try {
      await Axios.post("/jobs/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Applied successfully");

      // Add job to applied list
      setAppliedJobs((prev) => [...prev, jobId]);

      // Remove resume from state (clean UI)
      setResumeFiles((prev) => {
        const updated = { ...prev };
        delete updated[jobId];
        return updated;
      });

    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to apply");
    }
  };


  // ==============================
  // FILTER JOBS BASED ON SEARCH
  // ==============================

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      job.location.toLowerCase().includes(location.toLowerCase())
  );


  // ==============================
  // UI
  // ==============================

  return (
<div className="flex bg-slate-100 min-h-screen overflow-x-hidden">
        <Sidebar />

<div className="flex-1 md:ml-64 pt-16 md:pt-6 px-4 md:px-6 pb-6">
      {/* ==============================
    HEADER + SEARCH SECTION
============================== */}
<div className="mb-6">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    {/* Left: Title */}
    <h2 className="text-2xl font-semibold">
      Job Opportunities
    </h2>

    {/* Right: Search Inputs */}
    <div className="flex flex-col sm:flex-row gap-4 md:justify-end">

      <input
        type="text"
        placeholder="Search by title"
        className="px-4 py-2 border rounded w-full sm:w-56"
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        className="px-4 py-2 border rounded w-full sm:w-44"
        onChange={(e) => setLocation(e.target.value)}
      />

    </div>
  </div>
</div>

        {/* ==============================
            LOADING STATE
        ============================== */}
        {loading && (
          <p className="text-gray-600">Loading jobs...</p>
        )}

        {/* ==============================
            EMPTY STATE
        ============================== */}
        {!loading && filteredJobs.length === 0 && (
          <p className="text-gray-500">No jobs found.</p>
        )}

        {/* ==============================
            JOB CARDS
        ============================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredJobs.map((job) => (

         <div      
  key={job.id}
  className={`bg-white p-5 rounded-xl shadow-md transition hover:shadow-lg
    ${highlightId === job.id ? "ring-2 ring-blue-500" : ""}`}
          >

              {/* Job Info */}
              <h3 className="text-lg font-semibold">
                {job.title}
              </h3>

              <p className="text-gray-600">
                {job.company}
              </p>

              <p className="text-sm text-gray-500">
                {job.location}
              </p>

              <p className="text-sm mt-2">
                {job.type}
              </p>

              <p className="text-sm">
                {job.salary}
              </p>

              {/* ==============================
                  RESUME UPLOAD (PER JOB)
              ============================== */}
              <input
                key={appliedJobs.includes(job.id) ? "applied" : job.id}
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setResumeFiles((prev) => ({
                    ...prev,
                    [job.id]: e.target.files[0],
                  }))
                }
className="mt-3 text-sm w-full"
              />

              {/* Show selected file name */}
              {resumeFiles[job.id] && (
                <p className="text-sm text-green-600 mt-1">
                  {resumeFiles[job.id].name}
                </p>
              )}

              {/* ==============================
                  APPLY BUTTON
              ============================== */}
              <button
                onClick={() => apply(job.id)}
                disabled={appliedJobs.includes(job.id)}
                className={`mt-4 w-full py-2 rounded cursor-pointer ${
                  appliedJobs.includes(job.id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
              >
                {appliedJobs.includes(job.id)
                  ? "Applied"
                  : "Apply"}
              </button>

            </div>

          ))}
        </div>
      </div>
    </div>
  );
}