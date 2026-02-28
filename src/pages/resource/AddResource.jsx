import { useState } from "react";
import Axios from "../../axios/api.axios";
import Sidebar from "../../component/Sidebar";
import { useNavigate,Link } from "react-router-dom";
import {toast} from "react-hot-toast";


export default function AddResource() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "article",
    category: "Resume",
    file_url: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Axios.post("/resources/create", form);

      toast.success("Resource added successfully");
      navigate("/resources");

    } catch (err) {
      toast.error(err.response?.data);
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

<div className="flex-1 p-4 pt-20 md:pt-6 md:p-6 md:ml-64 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">
          Add Resource
        </h2>

        <form
          onSubmit={handleSubmit}
className="bg-white p-4 md:p-6 rounded-xl shadow space-y-4"        >
          <input
            type="text"
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
            rows="4"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />

          <select
            className="w-full border px-3 py-2 rounded"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="template">Template</option>
            <option value="pdf">PDF</option>
          </select>

          <select
            className="w-full border px-3 py-2 rounded"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="Resume">Resume</option>
            <option value="Interview">Interview</option>
            <option value="Job Search">Job Search</option>
            <option value="Career Planning">Career Planning</option>
          </select>

          <input
            type="text"
            placeholder="Paste Resource Link (URL)"
            className="w-full border px-3 py-2 rounded"
            value={form.file_url}
            onChange={(e) =>
              setForm({ ...form, file_url: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 cursor-pointer"
          >
            Add Resource
          </button>
         <Link
  to="/dashboard"
  className="
    md:hidden
    block
    w-full
    text-center
    py-2
    bg-slate-700
    hover:bg-slate-600
    text-white
    rounded
    transition
  "
>
  Skip for now
</Link>
        </form>
      </div>
    </div>
  );
}