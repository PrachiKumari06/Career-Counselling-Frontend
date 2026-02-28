import { useEffect, useState } from "react";
import Axios from "../../axios/api.axios";
import Sidebar from "../../component/Sidebar";

export default function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await Axios.get("/resources");
      setResources(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredResources = resources
    .filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(r =>
      typeFilter === "all" ? true : r.type === typeFilter
    )
    .filter(r =>
      categoryFilter === "all" ? true : r.category === categoryFilter
    );

  return (
   <div className="flex bg-slate-100 min-h-screen overflow-x-hidden">
  <Sidebar />

<div className="flex-1 p-4 pt-20 md:pt-6 md:p-6 md:ml-64">
            <h2 className="text-2xl font-semibold mb-6 ">
          Resource Library
        </h2>

        {/* Filters */}
<div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              <input
            type="text"
            placeholder="Search resources..."
className="px-4 py-2 border rounded w-full md:w-96"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-3 py-2 border rounded"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="template">Template</option>
            <option value="pdf">PDF</option>
          </select>

          <select
            className="px-3 py-2 border rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Resume">Resume</option>
            <option value="Interview">Interview</option>
            <option value="Job Search">Job Search</option>
            <option value="Career Planning">Career Planning</option>
          </select>
        </div>

        {/* Resource Cards */}
        {filteredResources.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              No resources found
            </h3>
          </div>
        ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredResources.map((r) => (
              <div
                key={r.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {r.title}
                </h3>

                <p className="text-sm text-gray-500 mb-3">
                  {r.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {r.type}
                  </span>

                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {r.category}
                  </span>
                </div>

                <a
                  href={r.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
                >
                  View Resource
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}