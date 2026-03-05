import { useEffect, useState } from "react";
import Axios from "../../axios/api.axios";
import Sidebar from "../../component/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Tag
} from "lucide-react";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
const [statusFilter, setStatusFilter] = useState("all");
const [categoryFilter, setCategoryFilter] = useState("all");  // New post fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await Axios.get("/forum");
      setPosts(res.data);
    } catch (err) {
      console.log("Error fetching posts:", err);
    }
  };

  // Create new discussion
  const handleCreatePost = async () => {
  if (!title || !content) {
    alert("Please fill all fields");
    return;
  }

  try {
    await Axios.post(
      "/forum/create",
      {
        title,
        content,
        category,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setTitle("");
    setContent("");
    setCategory("General");
    setShowModal(false);

    fetchPosts();
  } catch (err) {
    console.log("Create post error:", err.response?.data);
  }
};

 const filteredPosts = posts
  .filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  )
  .filter((post) =>
    statusFilter === "all" ? true : post.status === statusFilter
  )
  .filter((post) =>
    categoryFilter === "all" ? true : post.category === categoryFilter
  );

  return (
    <div className="flex bg-slate-100 min-h-screen overflow-x-hidden">
  <Sidebar />

  <div className="flex-1 md:ml-64 pt-16 md:pt-6 px-4 md:px-6 pb-6">

        {/* Header */}
       {/* Header */}
<div className="mb-6">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    {/* Left: Title */}
    <h2 className="text-2xl font-semibold">
      Community Discussions
    </h2>

    {/* Right: Search + Filters */}
    <div className="flex flex-col sm:flex-row gap-3 md:justify-end">

     <div className="relative w-full sm:w-60">
  <Search
    size={16}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
  />
  <input
    type="text"
    placeholder="Search discussions..."
    className="pl-9 pr-3 py-2 border rounded w-full"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 border rounded w-full sm:w-36"
      >
        <option value="all">All Status</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="px-3 py-2 border rounded w-full sm:w-40"
      >
        <option value="all">All Categories</option>
        <option value="General">General</option>
        <option value="Jobs">Jobs</option>
        <option value="Assessment">Assessment</option>
        <option value="Career">Career</option>
      </select>

    </div>
  </div>
</div>

        {/* Start Discussion Button */}
        <div className="mb-6">
        <button
  onClick={() => setShowModal(true)}
  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
>
  <Plus size={18} />
  Start Discussion
</button>
        </div>

        {/* Posts */}
       <div className="space-y-4">

  {filteredPosts.length === 0 ? (

    <div className="bg-white p-10 rounded-xl shadow text-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        There are no discussions yet
      </h3>

      <p className="text-gray-500 mb-4">
        Click on the Create Discussion button to start a discussion
      </p>
    </div>

  ) : (

    filteredPosts.map((post) => {
      const author =
        post.profiles?.career_profiles?.[0]?.full_name || "User";

      return (
      <div
  key={post.id}
  onClick={() => navigate(`/forum/${post.id}`)}
  className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
>
          <h3 className="text-lg font-semibold">
            {post.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {author} •{" "}
            {new Date(post.created_at).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour12: false,
            })}
          </p>

          <div className="flex justify-between items-center mt-4">
           <div className="flex gap-6 text-sm text-gray-600">
  <div className="flex items-center gap-1">
    <ThumbsUp size={16} />
    {post.upvotes}
  </div>

  <div className="flex items-center gap-1">
    <MessageCircle size={16} />
{post.forum_comments?.[0]?.count || 0}
  </div>
</div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
  <Tag size={12} />
  {post.category}
</div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.status === "closed"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {post.status === "closed" ? "Closed" : "Open"}
              </span>
            </div>
          </div>
        </div>
      );
    })

  )}

</div>

        {/* -------------MODAL ----------------------------*/}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">

              <h3 className="text-lg font-semibold mb-4">
                Start a New Discussion
              </h3>

              {/* Title */}
              <input
                type="text"
                placeholder="Discussion title"
                className="w-full border px-3 py-2 rounded mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Category */}
              <select
                className="w-full border px-3 py-2 rounded mb-4"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>General</option>
                <option>Jobs</option>
                <option>Assessment</option>
                <option>Career</option>
              </select>

              {/* Content */}
              <textarea
                rows="4"
                placeholder="Write your discussion..."
                className="w-full border px-3 py-2 rounded mb-4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
                >
                  Post
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}