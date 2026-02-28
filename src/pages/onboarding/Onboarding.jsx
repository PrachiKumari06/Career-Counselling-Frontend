import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Axios from "../../axios/api.axios.js"
import { Link, useNavigate } from "react-router-dom";

export default function Onboarding() {
const [originalName, setOriginalName] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    education: "",
    skills: "",
    experience: "",
    interests: "",
    bio: ""
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await Axios.get("/profile/career-profile");
      if (response.data) {
        setFormData(response.data);
        setOriginalName(response.data.full_name); // store original
        setIsEdit(true);
      }
    } catch (error) {
      // first time user
    }
  };

  fetchProfile();
}, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    
    if (isEdit) {
      await Axios.put("/profile/career-profile", formData);
      toast.success("Profile updated successfully");
    } else {
      await Axios.post("/profile/career-profile", formData);
      toast.success("Profile created successfully");
    }

    navigate("/dashboard");

  } catch (error) {
    toast.error("Something went wrong");
  }
};

  return (
<div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">    <form
      onSubmit={handleSubmit}
className="w-full max-w-md bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl p-8 text-slate-900 flex flex-col gap-4 transition-transform duration-300 hover:scale-[1.02]"    >
      <h2 className="text-white text-xl font-semibold text-center">
        {isEdit ? "Update Profile" : "Create Profile"}
      </h2>

     <input
  type="text"
  placeholder="Full Name"
  value={formData.full_name}
  onChange={(e) => {
    setFormData({ ...formData, full_name: e.target.value });
  }}
  className="p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
      <input
        type="text"
        placeholder="Education"
        value={formData.education}
        onChange={(e) =>
          setFormData({ ...formData, education: e.target.value })
        }
        className="p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Skills"
        value={formData.skills}
        onChange={(e) =>
          setFormData({ ...formData, skills: e.target.value })
        }
        className="p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={formData.experience}
        onChange={(e) =>
          setFormData({ ...formData, experience: e.target.value })
        }
        className="p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select experience</option>
        <option value="0">0 years</option>
        <option value="1">1+ year</option>
        <option value="2">2+ years</option>
        <option value="5">5+ years</option>
      </select>

      <input
        type="text"
        placeholder="Interests"
        value={formData.interests}
        onChange={(e) =>
          setFormData({ ...formData, interests: e.target.value })
        }
        className="p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Bio"
        value={formData.bio}
        onChange={(e) =>
          setFormData({ ...formData, bio: e.target.value })
        }
        className="p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows="3"
      />

      <button
        type="submit"
        className="p-3 bg-slate-700 hover:bg-slate-600 text-white  transition duration-200 rounded-lg font-semibold hover:-translate-y-1 hover:shadow-xl shadow-md cursor-pointer"
      >
        {isEdit ? "Update Profile" : "Create Profile"}
      </button>
   <button
  type="button"
  onClick={() => navigate("/dashboard")}
  className="p-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
>
  Skip for now
</button>
    </form>
  </div>
);

}
