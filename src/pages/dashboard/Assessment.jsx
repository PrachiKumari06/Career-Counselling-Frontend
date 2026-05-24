import { useState, useEffect, useRef } from "react";
import Sidebar from "../../component/Sidebar";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  ListChecks,
  Sparkles,
} from "lucide-react";
import timeoutSound from "../../assets/timeout.mp3";

function Assessment() {
  const audioRef = useRef(new Audio(timeoutSound));

  const questions = [
    {
      question: "How confident are you in your skills?",
      category: "confidence",
      options: [
        { label: "Very confident", value: 100 },
        { label: "Somewhat confident", value: 75 },
        { label: "Still improving", value: 50 },
        { label: "Just getting started", value: 25 }
      ]
    },
    {
      question: "Which skill describes you best?",
      category: "skill",
      options: [
        { label: "Technical Skills", value: 100 },
        { label: "Leadership", value: 90 },
        { label: "Analytical Thinking", value: 85 },
        { label: "Communication", value: 75 },
        { label: "Creativity", value: 70 }
      ]
    },
    {
      question: "What motivates you most?",
      category: "motivation",
      options: [
        { label: "High salary", value: 70 },
        { label: "Job stability", value: 75 },
        { label: "Passion", value: 100 },
        { label: "Entrepreneurship", value: 90 },
        { label: "Social impact", value: 85 }
      ]
    },
    {
      question: "How do you prefer solving problems?",
      category: "thinking_style",
      options: [
        { label: "Logical and analytical", value: 100 },
        { label: "Creative and innovative", value: 90 },
        { label: "Collaborative discussion", value: 80 },
        { label: "Trial and error", value: 60 }
      ]
    },
    {
      question: "What type of work environment suits you best?",
      category: "environment",
      options: [
        { label: "Structured corporate setting", value: 85 },
        { label: "Startup fast-paced culture", value: 95 },
        { label: "Remote / independent work", value: 80 },
        { label: "Field or hands-on environment", value: 75 }
      ]
    },
    {
      question: "How comfortable are you with taking risks?",
      category: "risk",
      options: [
        { label: "Very comfortable", value: 100 },
        { label: "Moderately comfortable", value: 75 },
        { label: "Prefer stability", value: 60 },
        { label: "Avoid risks", value: 40 }
      ]
    },
    {
      question: "What excites you more?",
      category: "interest",
      options: [
        { label: "Building products", value: 95 },
        { label: "Leading teams", value: 90 },
        { label: "Research and analysis", value: 85 },
        { label: "Helping people grow", value: 88 }
      ]
    },
    {
      question: "How do you handle challenges?",
      category: "resilience",
      options: [
        { label: "Stay calm and strategize", value: 95 },
        { label: "Seek guidance and adapt", value: 85 },
        { label: "Push through independently", value: 80 },
        { label: "Feel overwhelmed", value: 50 }
      ]
    },
    {
      question: "How clear are you about your career goals?",
      category: "clarity",
      options: [
        { label: "Very clear", value: 100 },
        { label: "Somewhat clear", value: 75 },
        { label: "Still exploring", value: 50 },
        { label: "Confused", value: 25 }
      ]
    }
  ];

  const totalSteps = questions.length;
  const categoryLabels = {
    confidence: "Self belief",
    skill: "Skill readiness",
    motivation: "Motivation",
    thinking_style: "Thinking style",
    environment: "Work setting",
    risk: "Risk comfort",
    interest: "Interests",
    resilience: "Resilience",
    clarity: "Goal clarity",
  };

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    audioRef.current.volume = 1;
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

 useEffect(() => {
  if (timeLeft === 0 && !result) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }
}, [timeLeft, result]);
useEffect(() => {
  if (result) return;

  //  Play once at 30 seconds
  if (timeLeft === 30) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  //  Play continuously under 10 seconds
  if (timeLeft <= 10 && timeLeft > 0) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

 

}, [timeLeft, result]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [step]: option
    }));
  };

  const calculateResult = () => {
    const categoryScores = {};
    const categoryCounts = {};
    questions.forEach((q, index) => {
      const selected = answers[index];
      if (selected) {
        if (!categoryScores[q.category]) {
          categoryScores[q.category] = 0;
          categoryCounts[q.category] = 0;
        }
        categoryScores[q.category] += selected.value;
        categoryCounts[q.category] += 1;
      }
    });
    Object.keys(categoryScores).forEach((category) => {
      categoryScores[category] = Math.round(
        categoryScores[category] / categoryCounts[category]
      );
    });
    return categoryScores;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setResult(calculateResult());
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const progress = ((step + 1) / totalSteps) * 100;
  const answeredCount = Object.keys(answers).length;

  if (result) {
    const sortedResults = Object.entries(result).sort((a, b) => b[1] - a[1]);
    const topStrengths = sortedResults.slice(0, 3);
    const growthArea = sortedResults[sortedResults.length - 1];

    const generateProfile = () => {
      if (result.thinking_style >= 90 && result.skill >= 90) {
        return "Strategic Builder";
      }
      if (result.motivation >= 90 && result.resilience >= 85) {
        return "Driven Achiever";
      }
      if (result.interest >= 85 && result.environment >= 85) {
        return "Creative Explorer";
      }
      return "Balanced Professional";
    };

    const profileTitle = generateProfile();
    const profileCopy = {
      "Strategic Builder":
        "You show strong analytical judgment and product-minded execution. Roles that mix systems, planning, and ownership can fit you well.",
      "Driven Achiever":
        "You are motivated, resilient, and likely to stay steady when goals get demanding. Growth tracks with clear milestones may suit you.",
      "Creative Explorer":
        "You seem energized by variety, ideas, and environments where you can test new possibilities before narrowing down.",
      "Balanced Professional":
        "Your profile is balanced across multiple traits, which gives you flexibility to compare options before choosing a focused path.",
    };
    const nextSteps = [
      "Book a counselor session to validate your top career paths.",
      "Use AI recommendations to compare skills, roles, and learning roadmaps.",
      "Retake this assessment after completing a course or project milestone.",
    ];

    return (
      <>
        <Sidebar />
        <div className="md:ml-64 min-h-screen bg-[#f6f7fb] px-4 pb-4 pt-0 sm:px-6 sm:pb-6">
          <div className="mx-auto max-w-6xl pt-0">
            <div className="mb-6 overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl">
              <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
                <div>
                  <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
                    <CheckCircle2 size={16} /> Assessment complete
                  </p>
                  <h2 className="text-3xl font-semibold md:text-4xl">
                    {profileTitle}
                  </h2>
                  <p className="mt-3 max-w-2xl text-slate-300">
                    {profileCopy[profileTitle]}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-300">Strongest signal</p>
                  <p className="mt-2 text-2xl font-semibold capitalize">
                    {categoryLabels[topStrengths[0][0]]}
                  </p>
                  <div className="mt-4 h-3 rounded-full bg-white/10">
                    <div
                      className="h-3 rounded-full bg-emerald-400"
                      style={{ width: `${topStrengths[0][1]}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {topStrengths[0][1]}% match strength
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Top Strengths
                </h3>
                <div className="space-y-5">
                  {topStrengths.map(([category, score]) => (
                    <div key={category}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {categoryLabels[category]}
                        </span>
                        <span className="text-slate-500">{score}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Growth Focus
                </h3>
                <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                  <span className="font-semibold">
                    {categoryLabels[growthArea[0]]}
                  </span>{" "}
                  is the area to strengthen next. Start with one small project,
                  habit, or conversation that makes this skill visible.
                </div>
                <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-900">
                  Next Steps
                </h3>
                <div className="space-y-3">
                  {nextSteps.map((item) => (
                    <p
                      key={item}
                      className="flex gap-3 rounded-lg border border-slate-100 p-3 text-sm text-slate-700"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
                setStep(0);
                setTimeLeft(300);
              }}
              className="mt-6 w-full rounded-xl bg-slate-950 p-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="pt-0 md:ml-64 min-h-screen bg-[#f4f7fb] px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="mx-auto max-w-6xl pt-0">
          <div className="mb-6 md:mt-2  mt-18">
            <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl sm:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <ListChecks size={16} /> {totalSteps} questions
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <Clock size={16} /> 5 minutes
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <Sparkles size={16} /> Personalized results
                </span>
              </div>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
                Discover the career patterns behind your choices.
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Answer honestly and get strengths, growth focus, and practical
                next steps for your career planning.
              </p>
            </div>

          </div>

          <div className="grid gap-6 pb-16 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm font-medium text-slate-500">
                Question map
              </p>
              <div className="grid grid-cols-5 gap-2 lg:grid-cols-3">
                {questions.map((question, index) => (
                  <button
                    key={question.category}
                    onClick={() => setStep(index)}
                    className={`h-10 rounded-lg text-sm font-semibold transition ${
                      step === index
                        ? "bg-slate-950 text-white"
                        : answers[index]
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-cyan-50 p-4 text-sm text-cyan-950">
                Your answer is saved as soon as you select an option.
              </div>
            </aside>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm sm:p-8">

            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500">
                Question {step + 1} of {totalSteps}
              </span>

              <div className="flex flex-col items-end">
                {timeLeft <= 30 && timeLeft > 0 && (
                <p className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs mb-1">
  <span className="md:hidden">Less than 30s left!</span>
  <span className="hidden md:inline">Hurry up! Less than 30 seconds remaining.</span>
</p>
                )}
                <div
                  className={`flex items-center gap-2 font-medium ${
                    timeLeft <= 30 ? "text-red-500" : "text-slate-800"
                  }`}
                >
                  <Clock size={16} />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mb-2 text-sm font-medium text-emerald-700">
              {categoryLabels[questions[step].category]}
            </p>
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">
              {questions[step].question}
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {questions[step].options.map((option, index) => (
                <label
                  key={index}
                  className={`flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    answers[step]?.label === option.label
                      ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                      :  "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${step}`}
                    checked={answers[step]?.label === option.label}
                    onChange={() => handleSelect(option)}
                   className="accent-emerald-500"
                  />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrev}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!answers[step]}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {step === totalSteps - 1 ? "Finish" : "Next"}
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>

        {timeLeft === 0 && !result && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-sm text-center shadow-2xl">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                 <Clock size={18} /> Time's Up
              </h2>
              <p className="text-slate-600 mb-6">
                Your assessment time has ended. Your answers will now be submitted.
              </p>
              <button
                onClick={() => {
                  setResult(calculateResult());
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                View Results
              </button>
            </div>
          </div>
        )}

      </div>
      </div>
    </>
  );
}

export default Assessment;
