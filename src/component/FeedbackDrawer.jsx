//23 march 
import { useEffect, useState } from "react";
import Axios from "../axios/api.axios.js";
import toast from "react-hot-toast";
import { ThumbsUp,CrossIcon, Pointer } from "lucide-react";

export default function FeedbackDrawer({ open, onClose, counselorId, onFeedbackAdded,counselorName }) {
      const [reviews, setReviews] = useState([]);
      const [filter, setFilter] = useState("all");
  const [summary, setSummary] = useState({ avg: 0, total: 0 });

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchFeedback = async () => {
    try {
const res = await Axios.get(`/feedback/${counselorId}?filter=${filter}`);
      setReviews(res.data);

      const sum = await Axios.get(`/feedback/summary/${counselorId}`);
      setSummary(sum.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  if (open && counselorId) {
    fetchFeedback();
  }
}, [open, counselorId, filter]);

  const handleSubmit = async () => {
    try {
      await Axios.post("/feedback", {
        counselor_id: counselorId,
        rating,
        comment
      });

      setRating(0);
      setComment("");

      fetchFeedback(); // refresh list + count
      onFeedbackAdded();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error");
    }
  };

  if (!open) return null;
  const handleLike = async (id) => {
  try {
    await Axios.post("/feedback/like", {
      feedback_id: id
    });

    fetchFeedback(); // refresh UI
  } catch (err) {
    toast.error(err);
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-full max-w-md bg-white h-full p-5 overflow-y-auto">
 
       {/* TOP HEADER */}
<div className="mb-4">

  {/* Name + Close */}
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold">
      Counselor: {counselorName}
    </h2>
    <button onClick={onClose}><CrossIcon size={16} cursor="pointer"/></button>
  </div>

  {/* Rating */}
  <div className="flex items-center gap-2 mt-1">
    <div className="text-yellow-500">
      {[1,2,3,4,5].map((s) => (
        <span key={s}>
          {s <= Math.round(summary.avg) ? "★" : "☆"}
        </span>
      ))}
    </div>

    <span className="text-sm text-gray-600">
      {summary.avg} ({summary.total} reviews)
    </span>
  </div>

  {/* Filters */}
  <div className="flex gap-2 mt-3">
    <button
      onClick={() => setFilter("all")}
      className={`px-3 py-1 rounded ${
        filter === "all" ? "bg-slate-700 text-white" : "bg-gray-200"
      }`}
    >
      All
    </button>

    <button
      onClick={() => setFilter("new")}
      className={`px-3 py-1 rounded ${
        filter === "new" ? "bg-slate-700 text-white" : "bg-gray-200"
      }`}
    >
      New Feedback
    </button>

    <button
      onClick={() => setFilter("week")}
      className={`px-3 py-1 rounded ${
        filter === "week" ? "bg-slate-700 text-white" : "bg-gray-200"
      }`}
    >
      Within 1 Week
    </button>
  </div>

</div>

        {/* Give Feedback */}
        <div className="mb-4 border p-3 rounded">
          <h3 className="font-medium mb-2">Give Feedback</h3>

          {/* Stars */}
          <div className="flex gap-2 mb-2">
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write your feedback..."
            className="w-full border p-2 rounded mb-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-slate-700 text-white py-2 rounded"
          >
            Submit
          </button>
        </div>

        {/* Reviews */}
        <div>
          {reviews.map((r) => (
            <div key={r.id} className="border-b py-3">
              <p className="font-medium">
{r.profiles?.career_profiles?.[0]?.full_name || "User"}
              </p>

              <p className="text-yellow-500">
                {"★".repeat(r.rating)}
              </p>

              <p className="text-sm text-gray-600">{r.comment}</p>

             <div className="flex justify-between items-center mt-2 text-xs text-gray-400">

  {/* date on left */}
  <p>
    {new Date(r.created_at).toLocaleDateString()}
  </p>

  {/*like on right  */}
  <button
    onClick={() => handleLike(r.id)}
    className="flex items-center gap-1 hover:text-slate-900"
  >
    <ThumbsUp size={16} />
    <span>{r.feedback_likes?.[0]?.count || 0}</span>
  </button>

</div>
              
              <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">

 

</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}