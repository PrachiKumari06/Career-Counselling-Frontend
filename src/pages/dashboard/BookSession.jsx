import React from "react";
import CounselorCard from "../../component/CounselorCard";
import FeedbackDrawer from "../../component/FeedbackDrawer"; //23 march
import Axios from "../../axios/api.axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Calendar, Search, Clock, Check } from "lucide-react";

const DEFAULT_SLOTS = [
  { time: "10:00 AM", label: "10:00 AM", hour: 10, minute: 0 },
  { time: "11:30 AM", label: "11:30 AM", hour: 11, minute: 30 },
  { time: "02:00 PM", label: "02:00 PM", hour: 14, minute: 0 },
  { time: "04:00 PM", label: "04:00 PM", hour: 16, minute: 0 },
  { time: "06:00 PM", label: "06:00 PM", hour: 18, minute: 0 },
  { time: "07:30 PM", label: "07:30 PM", hour: 19, minute: 30 },
];

export default function BookSession() {
  const [feedbackOpen, setFeedbackOpen] = useState(false); //feedback (23 march )
  const [selectedCounselorId, setSelectedCounselorId] = useState(null);//feedback (23 march )
  const [selectedCounselorName, setSelectedCounselorName] = useState(""); //feedback (23 march )
  const [loading, setLoading] = useState(false);  //as double booking when i click Confirm multiple times quickly
  const inputRef = useRef(null);
  const [counselors, setCounselors] = useState([]);
  const [search, setSearch] = useState("");

  // Slot Availability States
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [checkingSlots, setCheckingSlots] = useState(false);

  useEffect(() => {
    fetchCounselors();
  }, []);

  // Fetch booked slots when counselor or date changes
  useEffect(() => {
    if (selectedCounselor && selectedDate) {
      fetchBookedSlots(selectedCounselor, selectedDate);
    } else {
      setBookedSlots([]);
      setSelectedSlot(null);
    }
  }, [selectedCounselor, selectedDate]);

  const fetchBookedSlots = async (counselorId, date) => {
    try {
      setCheckingSlots(true);
      const res = await Axios.get(`/session/booked-slots/${counselorId}?date=${date}`);
      setBookedSlots(res.data?.bookedSlots || []);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
    } finally {
      setCheckingSlots(false);
    }
  };

  const fetchCounselors = async () => {
    try {
      const res = await Axios.get("/profile/match-counselors"); 
      console.log("API DATA:", res.data);
      setCounselors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredCounselors = counselors.filter((c) => {
    const profile = c.career_profiles?.[0];
    if (!profile) return false;

    const text = (
      profile.full_name +
      profile.skills +
      profile.education +
      profile.bio +
      String(profile.experience)
    ).toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const handleBookSession = async () => {
    if (loading) return;

    if (!selectedDate || !selectedSlot) {
      toast.error("Please select both a date and a time slot");
      return;
    }

    // Combine selected date and slot into ISO string
    const [year, month, day] = selectedDate.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day, selectedSlot.hour, selectedSlot.minute, 0);
    const sessionDate = dateObj.toISOString();

    try {
      setLoading(true);
      const res = await Axios.post("/session/book", {
        counselor_id: selectedCounselor,
        session_date: sessionDate
      });

      console.log("Backend response:", res.data);
      // FREE SESSION
      if (!res.data.paymentRequired) {
        toast.success(
          "Session booked successfully! Your first session is free. Check your email."
        );
        setSelectedCounselor(null);
        setSelectedDate("");
        setSelectedSlot(null);
        setBookedSlots([]);
        setLoading(false);   
        return;
      }

      // PAYMENT REQUIRED
      const order = res.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        handler: async function (response) {
          await Axios.post("/payment/verify", {
            ...response,
            counselor_id: selectedCounselor,
            session_date: sessionDate
          });

          toast.success("Payment successful. Session booked!");

          setSelectedCounselor(null);
          setSelectedDate("");
          setSelectedSlot(null);
          setBookedSlots([]);
          setLoading(false);
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };
  return (
    <>
{/* Section Header */}
{/* Section Header */}
<div className="mb-6">

  {/* Mobile Version */}
  <div className="flex items-center gap-3 md:hidden">
    <h2 className="text-lg font-semibold text-slate-800 whitespace-nowrap">
      Book a Session
    </h2>
    <div className="flex-1 h-[1px] bg-slate-300"></div>
  </div>

  {/* Desktop Version (unchanged layout) */}
  <div className="hidden md:flex items-center justify-between">
    <h2 className="text-xl font-semibold text-slate-800">
      Book a Session
    </h2>
<div className="relative w-72">
  <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
    <input
      type="text"
      placeholder="Search by skill or specialization..."
      onChange={(e) => setSearch(e.target.value)}
  className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 transition"
    />
    </div>
  </div>

  {/* Mobile Search */}
  <div className="relative mt-4 md:hidden">
  <Search
    size={16}
    className="absolute left-3 top-3 text-gray-400"
  />

  <input
    type="text"
    placeholder="Search by skill or specialization..."
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 transition"
  />
</div>
</div>
{/* if no counselor found than this by using terniary operator here  */}
      {filteredCounselors.length === 0 ? (
  <div className="text-center py-12 text-gray-500">
    <p className="text-lg font-medium">No counselors found</p>
    <p className="text-sm mt-1">
      Try searching with a different skill or specialization.
    </p>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {filteredCounselors.map((c) => (
     // <CounselorCard key={c.id} counselor={c} onBook={setSelectedCounselor} />
     <CounselorCard key={c.id} counselor={c} onBook={setSelectedCounselor} onViewFeedback={(id,name) => { setSelectedCounselorId(id);setFeedbackOpen(true);setSelectedCounselorName(name); }} //23march
/>
    ))}
  </div>
)}
      {/* when click on book session button, show modal with slot picker */}
      {selectedCounselor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-full max-w-lg shadow-2xl animate-rise-in text-white">
            <h2 className="text-xl font-bold mb-1 tracking-wide text-white">
              Select Date & Slot
            </h2>
            <p className="text-xs text-slate-300 mb-4">
              Choose your preferred date and an available counseling time slot.
            </p>

            {/* 1. Date Picker */}
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              1. Choose Date
            </label>
            <div className="relative mb-5">
              <input
                ref={inputRef} 
                type="date"
                value={selectedDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                onClick={() => inputRef.current?.showPicker()}
                className="w-full border border-slate-600 p-2.5 pr-10 rounded-xl text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-pointer text-sm [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
              <Calendar
                size={18}
                onClick={() => inputRef.current?.showPicker()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white cursor-pointer transition"
              />
            </div>

            {/* 2. Slot Selection */}
            {selectedDate && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-300" />
                    2. Select Available Slot
                  </label>
                  {checkingSlots && (
                    <span className="text-[11px] text-slate-400 animate-pulse">
                      Checking availability...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {DEFAULT_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot.time);
                    const isSelected = selectedSlot?.time === slot.time;

                    // Also check if selected date is today and slot hour has passed
                    const todayStr = new Date().toISOString().slice(0, 10);
                    const now = new Date();
                    const isPastToday =
                      selectedDate === todayStr &&
                      (now.getHours() > slot.hour ||
                        (now.getHours() === slot.hour && now.getMinutes() >= slot.minute));

                    const isDisabled = isBooked || isPastToday;

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-between transition border ${
                          isDisabled
                            ? "bg-slate-900/50 border-slate-700 text-slate-500 cursor-not-allowed"
                            : isSelected
                            ? "bg-slate-900 border-slate-400 text-white shadow-md font-semibold"
                            : "bg-gray-200 hover:bg-gray-100 border-gray-300 text-slate-800 cursor-pointer font-medium"
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected && <Check size={14} className="text-white" />}
                        {isBooked && (
                          <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Summary Banner */}
            {selectedDate && selectedSlot && (
              <div className="mb-5 p-3 rounded-xl bg-slate-700/60 border border-slate-600 text-xs text-slate-200 flex items-center gap-2">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>
                  Booking for <strong className="text-white">{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { dateStyle: "medium" })}</strong> at <strong className="text-white">{selectedSlot.time}</strong>
                </span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setSelectedCounselor(null);
                  setSelectedDate("");
                  setSelectedSlot(null);
                  setBookedSlots([]);
                }}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-slate-800 font-medium rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loading || !selectedDate || !selectedSlot}
                onClick={handleBookSession}
                className="px-5 py-2 text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white border border-slate-600 font-medium rounded-xl transition cursor-pointer shadow-md"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

<FeedbackDrawer                                    //23 march
  open={feedbackOpen}
  onClose={() => setFeedbackOpen(false)}
  counselorId={selectedCounselorId}
  counselorName={selectedCounselorName}
  onFeedbackAdded={fetchCounselors}
/>
    </>
  );
}
