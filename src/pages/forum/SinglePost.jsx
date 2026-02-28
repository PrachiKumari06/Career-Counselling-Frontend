import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../../axios/api.axios";
import Sidebar from "../../component/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Send,
  Lock,
} from "lucide-react";

export default function SinglePost() {
const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
const userId = localStorage.getItem("userId");  // Show Close Button Only to Owner
  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await Axios.get(`/forum/${id}`);
      setPost(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpvote = async () => {
    try {
      await Axios.post(
        "/forum/upvote",
        { post_id: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPost();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleAddComment = async () => {
    if (!comment) return;

    try {
      await Axios.post(
        "/forum/comment",
        { post_id: id, content: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setComment("");
      fetchPost();
    } catch (err) {
      console.log(err.response?.data);
    }
  };
const handleClose = async () => {
  try {
    await Axios.post(
      "/forum/close",
      { post_id: id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    fetchPost();
  } catch (err) {
    console.log(err.response?.data);
  }
};
  if (!post) return <div>Loading...</div>;

  const author =
    post.profiles?.career_profiles?.[0]?.full_name || "User";

console.log("POST USER:", post.user_id);
console.log("LOGGED USER:", localStorage.getItem("user"));

  return (
   <div className="flex bg-slate-100 min-h-screen overflow-x-hidden">
  <Sidebar />

  <div className="flex-1 md:ml-64 pt-16 md:pt-6 px-4 md:px-6 pb-10">
    <div className="max-w-3xl mx-auto">
<button
  onClick={() => navigate("/forum")}
  className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
>
  <ArrowLeft size={18} />
  Back to Discussions
</button>
        <div className="bg-white p-6 rounded-xl shadow mb-6">
<div className="flex justify-between items-start gap-4">

  <h2 className="text-2xl font-semibold">
    {post.title}
  </h2>

  {post.user_id === userId && post.status === "open" && (
    <button
      onClick={handleClose}
      className="
        px-4 py-2 
        bg-slate-800 
        text-white 
        rounded-lg 
        shadow-md
        hover:bg-slate-700
        hover:shadow-indigo-500/40
        transition-all duration-300
      "
    >
      Close Ticket
    </button>
  )}

</div>
          <p className="text-sm text-gray-500 mt-1">
  {author} •{" "}
     {/* {new Date(post.created_at).toLocaleString()} */}
  {new Date(post.created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  })}
</p>

          <p className="mt-4">{post.content}</p>

        <div className="flex gap-6 mt-4 text-gray-600">

  <div
    onClick={handleUpvote}
    className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
  >
    <ThumbsUp size={18} />
    {post.upvotes}
  </div>

  <div className="flex items-center gap-2">
    <MessageCircle size={18} />
    {post.forum_comments?.length || 0}
  </div>

</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mb-6">
         <div className="flex gap-3">
  <input
    type="text"
    placeholder="Write a comment..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    className="flex-1 border px-3 py-2 rounded"
  />

  <button
    onClick={handleAddComment}
    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition"
  >
    <Send size={16} />
    Post
  </button>
</div>
        </div>

        <div className="space-y-4">
          {post.forum_comments?.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-xl shadow">
              <p className="text-sm text-gray-500">
                {c.profiles?.career_profiles?.[0]?.full_name || "User"} •{" "}
                {new Date(c.created_at).toLocaleString()}
              </p>

              <p className="mt-2">{c.content}</p>
            </div>
          ))}
        </div>

     </div>
      </div>
    </div>
  );
}