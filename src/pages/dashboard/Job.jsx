import { useEffect, useState } from "react";
import Axios from "../../axios/api.axios";
import Sidebar from "../../component/Sidebar";
import {toast} from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Briefcase, IndianRupee, CalendarDays,Upload,MapPin,Check,ArrowBigRightDash } from "lucide-react";

export default function Jobs() {
// All jobs from database
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState("all"); 
const [selectedJob, setSelectedJob] = useState(null);  //model 
  // Search filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  // Track which jobs user already applied to
  const [appliedJobs, setAppliedJobs] = useState([]);
  // Store resume file per job (jobId => file)
  const [resumeFiles, setResumeFiles] = useState({});
const [uploadMode, setUploadMode] = useState({});
  // Loading state
  const [loading, setLoading] = useState(true);

// to show the card highlighted when notification one will click 
const locationHook = useLocation();
const queryParams = new URLSearchParams(locationHook.search);
const highlightId = queryParams.get("highlight");
 
// fetch data
useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

//fetch all jobs
  const fetchJobs = async () => {
    try {
      const res = await Axios.get("/jobs/recommended");
      setJobs(res.data);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

//FETCH APPLIED JOBS----> So Apply button remains disabled after refresh
  const fetchAppliedJobs = async () => {
  try {
    const res = await Axios.get("/jobs/my-applications");

    const appliedIds = [];
    const resumeMap = {};

    res.data.forEach((app) => {
      appliedIds.push(app.jobs.id);
      resumeMap[app.jobs.id] = app.resume_url;
    });

    setAppliedJobs(appliedIds);   // ✅ IMPORTANT
    setResumeFiles(resumeMap);    // ✅ for preview

  } catch (error) {
    console.log("Error fetching applied jobs:", error);
  }
};
//apply to job
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
console.log(resumeFiles[jobId]);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to apply");
    }
  };
//filter job based on search
  const filteredJobs = jobs.filter((job) => {
  const isExpired = new Date(job.expiry_date) < new Date();
  const isApplied = appliedJobs.includes(job.id);

  // TAB FILTER
  if (tab === "active" && isExpired) return false;
  if (tab === "closed" && !isExpired) return false;
  if (tab === "applied" && !isApplied) return false;

  // SEARCH FILTER
  if (
    !job.title.toLowerCase().includes(search.toLowerCase()) ||
    !job.location.toLowerCase().includes(location.toLowerCase())
  ) {
    return false;
  }

  return true;
});
const getDaysAgo = (date) => {
  const diff = new Date() - new Date(date);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
const getDaysLeft = (date) => {
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
  return (
<div className="flex bg-slate-100 min-h-screen overflow-x-hidden">
        <Sidebar />

<div className="flex-1 md:ml-64 pt-16 md:pt-6 px-4 md:px-6 pb-6">
      {/* HEADER + SEARCH SECTION*/}
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
<div className="flex gap-4 mb-6 text-sm font-medium">
  {["all", "active", "closed", "applied"].map((t) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      className={`px-3 py-1 rounded capitalize ${
        tab === t
          ? "bg-slate-800 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {t}
    </button>
  ))}
</div>

        {/* LOADING STATE*/}
        {loading && (
          <p className="text-gray-600">Loading jobs...</p>
        )}

        {/*EMPTY STATE*/}
        {!loading && filteredJobs.length === 0 && (
          <p className="text-gray-500">No jobs found.</p>
        )}

        {/*JOB CARDS*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const isExpired = new Date(job.expiry_date) < new Date();
return (
         <div      
  key={job.id}
  className={`relative bg-white p-5 rounded-xl shadow-md transition hover:shadow-lg
    ${highlightId === job.id ? "ring-2 ring-blue-500" : ""}`}
          >

              {/* Job Info */}
          <div className="flex justify-between items-start">

  {/* LEFT: Title */}
  <h3 className="text-lg font-semibold">
    {job.title}
  </h3>
{job.matchPercent >= 70 && (
  <span className="absolute -top-3 right-1 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full shadow border border-purple-200">
    Highly Matched
  </span>
)}

{job.matchPercent >= 40 && job.matchPercent < 70 && (
  <span className="absolute -top-3 right-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full shadow border border-blue-200">
    Matched
  </span>
)}
  {/* RIGHT: Badges */}
  <div className="flex flex-col items-end gap-1">

   
    {/* EXPIRY */}
    {isExpired ? (
      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
        Expired
      </span>
    ) : (
      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
        Expires in {getDaysLeft(job.expiry_date)} days
      </span>
    )}

  </div>
</div>
  
              <p className="text-gray-600">
                {job.company}
              </p>


             {/* TYPE + SALARY + EXPIRY (ONE ROW) */}
<div className="flex items-center justify-between mt-2 text-sm text-gray-600">

  {/* LEFT SIDE */}
  <div className="flex items-center gap-2 flex-wrap">

    <span className="flex items-center gap-1">
      <Briefcase size={14} />
      {job.type}
    </span>

    <span>•</span>

    <span className="flex items-center gap-1">
      <IndianRupee size={14} />
      {job.salary}
    </span>

    <span>•</span>

    <span className="flex items-center gap-1 "><MapPin size={14}/>{job.location}</span>

  </div>

 
</div>
<p
  onClick={() => setSelectedJob(job)}
  className="mt-2 text-sm text-gray-600 line-clamp-2 cursor-pointer hover:underline"
>
  {job.description}
</p>
              {/*RESUME UPLOAD (PER JOB)*/}
{/* ===== APPLY FLOW SECTION ===== */}

{/* 1. Upload (after clicking Apply) */}
{/* ===== APPLY FLOW SECTION ===== */}

{!isExpired && uploadMode[job.id] && !appliedJobs.includes(job.id) && (
  <div className="mt-3 space-y-2">

    {/* Upload Resume */}
    <label className="flex items-center justify-between border rounded px-3 py-2 cursor-pointer hover:bg-gray-50">

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Upload size={16} />
        <span>
          {resumeFiles[job.id]?.name || "Upload Resume"}
        </span>
      </div>

      <span className="text-xs text-slate-900 hover:underline">
        Browse
      </span>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setResumeFiles((prev) => ({
            ...prev,
            [job.id]: e.target.files[0],
          }))
        }
        className="hidden"
      />
    </label>

    {/* Submit button ALWAYS visible */}
    <button
      onClick={() => apply(job.id)}
      className="mt-2 w-full py-2 rounded bg-slate-800 hover:bg-slate-700 text-white"
    >
      Submit Application
    </button>

  </div>
)}

{/* 3. Applied state */}
{appliedJobs.includes(job.id) && (
  <div className="mt-3 flex items-center justify-between">

    {/* LEFT: Applied button */}
    <span className="flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded-full font-medium">
  <Check size={14} />
  Applied
</span>
    {/* RIGHT: View Resume button */}
    <button
  onClick={() => {
    const file = resumeFiles[job.id];
    if (typeof file === "string") {
      window.open(file, "_blank");
    }
  }}
  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-slate-500 text-slate-700 rounded-full hover:bg-slate-50"
>
  View Resume
  <ArrowBigRightDash size={14} />
</button>

  </div>
)}
              {/* Show selected file name */}
             {resumeFiles[job.id] && !appliedJobs.includes(job.id) && (
  <p className="text-sm text-green-600 mt-1">
    {resumeFiles[job.id].name}
  </p>
)}
              {/*APPLY BUTTON*/}
        {/* ===== APPLY BUTTON LOGIC ===== */}

{/* Apply button (default state) */}
{!uploadMode[job.id] && !appliedJobs.includes(job.id) && !isExpired && (
  <button
    onClick={() =>
      setUploadMode((prev) => ({ ...prev, [job.id]: true }))
    }
    className="mt-4 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-sm"
  >
    Apply
  </button>
)}

{/* Closed state */}
{isExpired && (
  <span className="mt-4 inline-block px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded-full">
    Application Closed
  </span>
)}

            </div>

)})}
        </div>
      </div>

    {/* modal ------------------------------------ */}
     {selectedJob && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className=" bg-white  w-full  max-w-lg  mx-3  sm:mx-auto  rounded-xl  p-5  shadow-lg  relative max-h-[90vh]  overflow-y-auto">
      {/* Close */}
      <button
        onClick={() => setSelectedJob(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-xl font-semibold">
        {selectedJob.title}
      </h2>

      {/* Company */}
      <p className="text-gray-600 mt-1">
        {selectedJob.company} • {selectedJob.location}
      </p>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-700 leading-relaxed">
        {selectedJob.description}
      </p>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedJob.skills_required?.split(",").map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-gray-100 rounded"
          >
            {skill.trim()}
          </span>
        ))}
      </div>

      {/* ✅ Company Culture (NOW INSIDE) */}
      {selectedJob.company_culture && (
        <div className="mt-5">

          <h3 className="text-sm font-semibold text-gray-800">
            Company Culture
          </h3>

<ul className="mt-2 text-sm text-gray-600 space-y-2 list-disc pl-5">
              {selectedJob.company_culture.split("\n").map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>

        </div>
      )}

    </div>

  </div>
)}
    </div>

    
  );
}