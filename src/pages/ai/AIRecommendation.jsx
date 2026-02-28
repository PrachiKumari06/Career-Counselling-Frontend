import { useState, useEffect } from "react";
import Axios from "../../axios/api.axios";
import Sidebar from "../../component/Sidebar";

export default function AIRecommendation() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await Axios.post("/ai/recommendation");
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data);
      setLoading(false);
    }
  };
useEffect(() => {
  handleGenerate();
}, []);

const handleRegenerate = async () => {
  await Axios.post("/ai/regenerate");
  handleGenerate();
};
  return (
   <div className="flex bg-slate-100 min-h-screen overflow-x-hidden">
  <Sidebar />

  <div className="flex-1 md:ml-64 pt-16 md:pt-6 px-4 md:px-6 pb-10">
    <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          AI Career Recommendation
        </h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">

  <button
    onClick={handleGenerate}
    className="
      w-full sm:w-auto
      px-6 py-2 
      bg-slate-800 
      text-white 
      rounded-lg 
      hover:bg-slate-700 
      transition
    "
  >
    {loading ? "Analyzing..." : "Generate Recommendation"}
  </button>

  <button
    onClick={handleRegenerate}
    className="
      w-full sm:w-auto
      px-6 py-2 
      border 
      rounded-lg 
      hover:bg-slate-800 
      hover:text-white 
      transition
    "
  >
    Regenerate
  </button>

</div>
        {data?.career_paths && (
          <div className="mt-8 space-y-6">
            {data.career_paths.map((career, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {career.title}
                </h3>

                <p className="text-gray-600 mb-2">
                  {career.why_match}
                </p>

                <p className="text-sm text-green-600 font-medium mb-3">
                  Salary: {career.salary_range_india}
                </p>

                <div className="mb-3">
                  <strong>Required Skills:</strong>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {career.required_skills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() =>
                    setExpanded(expanded === index ? null : index)
                  }
                  className="px-4 py-1 bg-slate-800 text-white rounded text-sm hover:bg-slate-700 cursor-pointer  "
                >
                  {expanded === index
                    ? "Hide Roadmap"
                    : "View Roadmap"}
                </button>

                {expanded === index && (
                  <div className="mt-4 space-y-3">
                    {career.roadmap.map((step, i) => (
                      <div
                        key={i}
                        className="border-l-4 border-slate-700 pl-4"
                      >
                        <strong>{step.step}</strong>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}