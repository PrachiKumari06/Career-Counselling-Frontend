import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import {User} from "lucide-react"

export default function Navbar({ matchingJobs = [], unreadCount = 0, onBellClick,userName="" }) {
    const navigate = useNavigate();

  const handleUpdateProfile = () => {
    navigate("/onboarding");
  };
  const firstLetter =
  userName && userName.trim().length > 0
    ? userName.trim().charAt(0).toUpperCase()
    : "U";

  return (
    <div className="flex justify-between items-center px-6 py-4 
                    bg-slate-800 
                    rounded-2xl 
                    shadow-xl 
                    border border-slate-700
                    mt-2
                    ml-4
                    mr-4">

      <h1 className="text-2xl font-bold text-white tracking-wide">
        Dashboard
      </h1>

      <div className="flex items-center gap-5">
         <Notification />
{/* Avatar */}
       <div className="w-9 h-9 bg-white text-slate-800 
                rounded-full 
                flex items-center justify-center 
                font-semibold 
                shadow-md transition hover:scale-110">
  {firstLetter}
</div>

        {/* Update Button */}
        <div
          onClick={handleUpdateProfile}
          className="px-4 py-2 text-sm font-medium rounded-md 
                     bg-slate-700 hover:bg-slate-600 
                     text-white transition cursor-pointer flex items-center justify-center gap-2"
        >
           <User size={18} />
          Update Profile
        </div>
      </div>
    </div>
  );
}