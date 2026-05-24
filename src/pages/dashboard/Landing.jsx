import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useState,useEffect,useRef } from "react";
import { ChevronLeft, ChevronRight, Menu, X ,Target,Users,Brain,BriefcaseBusiness,FileUser,ChartLine} from "lucide-react";
import { ReactTyped } from "react-typed";
import img1 from "../../assets/img1.png";
import img2 from "../../assets/img2.png";
import img3 from "../../assets/img3.png";
import img4 from "../../assets/img4.png";
import img2_1 from "../../assets/img2_1.png";
import img1_hover from "../../assets/img1_1.png";
import img3_hover from "../../assets/img3_1.png";
import img4_hover from "../../assets/img4_1.png";



const card = [
  { normal: img1, hover: img1_hover, label: "Career" },
  { normal: img2, hover: img2_1, label: "Counseling" },
  { normal: img3, hover: img3_hover, label: "Guidance" },
  { normal: img4, hover: img4_hover, label: "Support" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % card.length);
  }, 2000); // 2 sec

  return () => clearInterval(interval);
}, []);
const scrollRef = useRef(null);
const [scrollProgress, setScrollProgress] = useState(0);
const handleScroll = () => {
  const el = scrollRef.current;
  const scrollWidth = el.scrollWidth - el.clientWidth;
  const progress = (el.scrollLeft / scrollWidth) * 100;
  setScrollProgress(progress);
};

const scrollLeft = () => {
  scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
};

const scrollRight = () => {
  scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
};

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};



const [openIndex, setOpenIndex] = useState(null);
 const faq = [
    {
      q: "What is CareerConnect?",
      a: "CareerConnect is a platform that helps students and professionals discover the right career path through expert guidance, AI recommendations, and real opportunities.",
    },
    {
      q: "Is CareerConnect free to use?",
      a: "Yes, basic features are free. Some premium counseling sessions may require payment.",
    },
    {
      q: "How does 1:1 counseling work?",
      a: "You can book sessions with experienced mentors who guide you based on your goals, strengths, and interests.",
    },
    {
      q: "Are AI recommendations reliable?",
      a: "They are based on your inputs, preferences, and patterns. They improve over time and are best used along with expert guidance.",
    },
    {
      q: "Who can use this platform?",
      a: "Students, college graduates, and early professionals looking for career clarity and growth.",
    },
    {
      q: "How do I get started?",
      a: "Simply create an account, complete your profile, and start exploring career paths or book a session.",
    },
  ];

  return (
    <div className="min-h-screen text-white">

      {/* NAVBAR */}
   <div className="bg-slate-800 m-2 rounded-3xl border-b px-4 py-3">

      {/* TOP BAR */}
      <div className="flex justify-between items-center">

        {/* LOGO */}
        <h1 className="text-lg md:text-xl font-semibold text-white">
          CareerConnect
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 items-center">
          <button onClick={() => scrollToSection("home")} className="nav-link hover:bg-slate-700 px-3 py-1 rounded-md cursor-pointer">
            Home
          </button>
          <button onClick={() => scrollToSection("features")} className="nav-link hover:bg-slate-700 px-3 py-1 rounded-md cursor-pointer">
            Features
          </button>
          <button onClick={() => scrollToSection("about")} className="nav-link hover:bg-slate-700 px-3 py-1 rounded-md cursor-pointer">
            About
          </button>
        </div>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1 border border-slate-500 rounded-3xl hover:bg-slate-700 text-sm"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-1 bg-white text-slate-900 rounded-3xl text-sm"
          >
            Sign Up
          </button>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-3">

          <button onClick={() => scrollToSection("home")} className="mobile-link hover:bg-slate-700 px-3 py-1 rounded-md cursor-pointer">
            Home
          </button>

          <button onClick={() => scrollToSection("features")} className="mobile-link hover:bg-slate-700 px-3 py-1 rounded-md cursor-pointer">
            Features
          </button>

          <button onClick={() => scrollToSection("about")} className="mobile-link hover:bg-slate-700 px-3 py-1 rounded-md cursor-pointer">
            About
          </button>

          <hr className="border-slate-600 my-2" />

          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-slate-500 rounded-3xl"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-white text-slate-900 rounded-3xl"
          >
            Sign Up
          </button>
        </div>
      )}
    </div>

      {/* HERO */}
    <section className="bg-slate-800 text-white min-h-[80vh] md:min-h-screen flex flex-col items-center justify-start pt-16 pb-10 px-4 text-center rounded-3xl border-b m-2 relative" id="home" >

 <motion initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center ">
   {/* TEXT */}
  <p className="text-xs tracking-widest text-slate-400 mb-2 pt-1 md:pt-2">
    CAREER GUIDANCE PLATFORM
  </p>

  <h1 className="text-4xl md:text-5xl font-bold leading-tight">
    Find the Right Career Path <br />
    <span className="text-blue-400">with Expert Guidance</span>
  </h1>
{/* LEFT GLOW */}
<div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 blur-3xl rounded-full"></div>

{/* RIGHT GLOW */}
<div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 blur-3xl rounded-full"></div>
 <ReactTyped
  className="text-slate-300 mt-4 max-w-xl"
  strings={[
    "Connect with top counselors, explore personalized career paths",
    "and build your future with confidence."
  ]}
  typeSpeed={50}
  backSpeed={50}
  loop
/>

  {/* BUTTONS */}
  <div className="flex gap-4 mt-6">
    <button className="bg-white text-slate-800 px-6 py-2 rounded-full font-medium hover:bg-gray-200">
      Get Started
    </button>

    <button className="border border-slate-500 px-6 py-2 rounded-full hover:bg-slate-700">
      Explore
    </button>
  </div>

  {/* 4 VISUALS */}
  {/* desktop */}

<motion.div                                //for simple div remove all motion.div just use <div className="hidden md:grid mt-10 grid-cols-4 gap-20 max-w-5xl w-full">
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.1, duration: 0.8 }}
   className="hidden md:grid mt-10 grid-cols-4 gap-20 max-w-5xl w-full">
  {card.map((item, index) => (
    <div key={index} className="flex flex-col items-center group">

      <div className="bg-slate-700 rounded-full w-60 h-60 flex items-center justify-center relative overflow-hidden transition hover:bg-slate-600">

        {/* Default Image */}
        <img
          src={item.normal}
          className="w-54 h-54 object-contain absolute transition duration-300 group-hover:opacity-0"
          alt={item.label}
        />

        {/* Hover Image */}
        <img
          src={item.hover}
          className="w-54 h-54 object-contain absolute opacity-0 transition duration-300 group-hover:opacity-100"
          alt={item.label}
        />

      </div>

      <p className="mt-3 text-sm text-slate-300">{item.label}</p>

    </div>

  ))}
 
</motion.div>
{/* mobile carousel */}
<motion.div                                //for simple div remove all motion.div just use <div className="hidden md:grid mt-10 grid-cols-4 gap-20 max-w-5xl w-full">
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.1, duration: 0.9 }}
   className="md:hidden mt-6 flex flex-col items-center">
  
  <div className="bg-slate-700 rounded-full w-60 h-60 flex items-center justify-center relative overflow-hidden">
    
    <img
      src={card[current].normal}
      className="w-54 h-54 object-contain"
      alt="mobile"
    />

  </div>

  <p className="mt-3 text-sm text-slate-300">
    {card[current].label}
  </p>

</motion.div>
 </motion>
</section>

      {/* FEATURES */}
    <div className="bg-slate-900 py-16 px-6 rounded-3xl border-b m-2" id="features">

  {/* HEADING */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="text-center max-w-2xl mx-auto"
  >
    <h2 className="text-2xl md:text-3xl font-semibold mb-3">
      Everything you need to plan and grow your career
    </h2>

    <p className="text-slate-400 text-sm md:text-base">
      From discovering the right path to landing your first job, CareerConnect
      supports you at every step.
    </p>
  </motion.div>

  {/* CAROUSEL */}
  <div className="relative mt-12 px-6 md:px-10">

  {/* LEFT BUTTON */}
 <button
  onClick={scrollLeft}
  className="flex md:flex absolute left-2 md:left-25 top-1/2 -translate-y-1/2 z-20 
  bg-slate-700/40 backdrop-blur-sm text-white p-1.5 rounded-full"
>
  <ChevronLeft size={18} />
</button>
<div className="mt-12 px-6 md:px-10">
  <div
    ref={scrollRef}
    onScroll={handleScroll}
    className="overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth max-w-6xl mx-auto"
  >
    <div className="flex gap-6  snap-x snap-mandatory">
        {[
         {
          title: "Career Assessment",
          desc: "Discover your ideal path based on your strengths.",
          points: [
            "Aptitude & personality analysis",
            "Identify strengths & gaps",
            "Clear career direction",
          ],
         icon: <Target size={18} />,
        },
        {
          title: "1:1 Counseling",
          desc: "Get guidance from experienced mentors.",
          points: [
            "Book expert sessions",
            "Real-world career advice",
            "Personalized guidance",
          ],
          icon: <Users size={18} />,
        },
        {
          title: "AI Recommendations",
          desc: "Smart suggestions tailored to you.",
          points: [
            "AI-driven career matching",
            "Based on your profile",
            "Continuously improves",
          ],
          icon: <Brain size={18} />,
        },
        {
          title: "Jobs & Internships",
          desc: "Find opportunities that match your skills.",
          points: [
            "Curated job listings",
            "Role-based suggestions",
            "Early career exposure",
          ],
          icon: <BriefcaseBusiness size={18} />,
        },
        {
          title: "Resume & Interview",
          desc: "Prepare to stand out confidently.",
          points: [
            "Resume building tips",
            "Interview practice",
            "Industry guidance",
          ],
          icon: <FileUser size={18} />,
        },
        {
          title: "Track Growth",
          desc: "Monitor your progress over time.",
          points: [
            "Track milestones",
            "Measure improvement",
            "Stay consistent",
          ],
          icon: <ChartLine size={18} />,
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.04 }}
className="snap-start bg-slate-800 p-3 rounded-xl shadow-md hover:bg-slate-700 transition cursor-pointer 
w-[85%] sm:w-[55%] md:w-[28%] lg:w-[25%] flex-shrink-0"        >

          {/* ICON + TITLE (same row) */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl text-blue-400">{item.icon}</span>
            <h3 className="font-semibold text-base">
              {item.title}
            </h3>
          </div>

          {/* DESC */}
          <p className="text-sm text-slate-400 mb-2">
            {item.desc}
          </p>

          {/* POINTS */}
          <ul className="text-xs text-slate-300 space-y-1">
            {item.points.map((p, i) => (
              <li key={i}>• {p}</li>
            ))}
          </ul>

        </motion.div>
      ))}

    </div>
  </div>
  </div>
   <button
  onClick={scrollRight}
  className="flex md:flex absolute right-2 md:right-25 top-1/2 -translate-y-1/2 z-20 
  bg-slate-700/40 backdrop-blur-sm text-white p-1.5 rounded-full"
>
  <ChevronRight size={18} />
</button>

</div>
<div className="mt-4 w-full md:w-80 h-[3px] bg-slate-700 rounded-full overflow-hidden mx-auto">  <div
    className="h-full bg-white transition-all duration-200"
    style={{ width: `${scrollProgress}%` }}
  ></div>
</div>
</div>

      {/* CTA */}
      <div className="bg-slate-900 py-16 px-6 rounded-3xl m-2" id="about">

  <div className="max-w-5xl mx-auto text-center">

    {/* HEADING */}
    <h2 className="text-2xl md:text-3xl font-semibold mb-4">
      Why CareerConnect exists
    </h2>

    {/* INTRO */}
    <p className="text-slate-400 text-sm md:text-base max-w-3xl mx-auto">
      Choosing a career shouldn’t feel confusing. Yet most students and
      early professionals struggle with too many options and not enough clarity.
    </p>

  </div>

  {/* 3 BLOCKS */}
  <div className="mt-12 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

    {/* PROBLEM */}
    <div className="bg-slate-800 p-6 rounded-xl">
      <h3 className="font-semibold mb-2">The problem</h3>
      <p className="text-sm text-slate-400">
        Lack of guidance, unclear direction, and generic advice often lead to
        wrong career choices and wasted time.
      </p>
    </div>

    {/* APPROACH */}
    <div className="bg-slate-800 p-6 rounded-xl">
      <h3 className="font-semibold mb-2">Our approach</h3>
      <p className="text-sm text-slate-400">
        We combine real mentorship with smart technology to give you
        personalized, practical, and actionable career guidance.
      </p>
    </div>

    {/* OUTCOME */}
    <div className="bg-slate-800 p-6 rounded-xl">
      <h3 className="font-semibold mb-2">The outcome</h3>
      <p className="text-sm text-slate-400">
        Clarity in decisions, confidence in your path, and access to
        real opportunities that match your goals.
      </p>
    </div>

  </div>
 <div className="bg-slate-900 py-16 px-6 rounded-3xl m-2">
      <div className="max-w-4xl mx-auto">

        {/* HEADING */}
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
          Frequently Asked Questions
        </h2>

        {/* FAQ LIST */}
        <div className="space-y-4">
          {faq.map((item, index) => (
           <div
  key={index}
  onClick={() => setOpenIndex(openIndex === index ? null : index)}
  className={`rounded-xl p-4 cursor-pointer transition 
    ${openIndex === index 
      ? "bg-blue-600/20 border border-blue-400" 
      : "bg-slate-800 hover:bg-slate-700"
    }`}
>

              {/* QUESTION */}
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-base font-medium">
                  {item.q}
                </h3>
                <span className="text-lg">
                  {openIndex === index ? "-" : "+"}
                </span>
              </div>

              {/* ANSWER */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-slate-400 text-sm mt-3 overflow-hidden"
                  >
                    {item.a}
                  </motion.p>
                )}
              </AnimatePresence>

            </div>
          ))}
        </div>

      </div>
    </div>
</div>
    </div>
  );
}