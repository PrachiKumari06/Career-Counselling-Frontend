export default function CounselorCard({ counselor,onBook }) {
  const profile = counselor.career_profiles?.[0];
  return (
    
    <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2">

      <h2 className="text-lg font-semibold text-gray-800">
        {profile?.full_name}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        {profile?.education}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {profile?.skills}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {profile?.experience}+ years of experience
      </p>

      <p className="text-sm mt-3 text-gray-600">
        {profile?.bio}
      </p>

      <button className="mt-4 w-full cursor-pointer transition-all duration-300 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium  hover:-translate-y-1 hover:shadow-md"
      onClick={()=>onBook(counselor.id)}   >
        Book Session
      </button>
    </div>
  );
}