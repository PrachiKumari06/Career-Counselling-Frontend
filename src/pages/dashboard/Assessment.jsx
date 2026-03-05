import { useState, useEffect } from "react";
import Sidebar from "../../component/Sidebar";
import { Clock, ListChecks, Sparkles } from "lucide-react";
import timeoutSound from "../../assets/timeout.mp3";

function Assessment() {
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [audio] = useState(() => new Audio(timeoutSound));

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

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    audio.volume = 1;
  }, [audio]);

  useEffect(() => {
    if (timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

 useEffect(() => {
  if (timeLeft === 0 && !result) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    setShowTimeoutModal(true);
  }
}, [timeLeft, result, audio]);
useEffect(() => {
  if (result) return;

  //  Play once at 30 seconds
  if (timeLeft === 30) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  //  Play continuously under 10 seconds
  if (timeLeft <= 10 && timeLeft > 0) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

 

}, [timeLeft, result, audio]);

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

    return (
      <>
        <Sidebar />
        <div className="md:ml-64 min-h-screen bg-slate-100 flex justify-center items-center p-6">
          <div className="w-full max-w-2xl bg-slate-800 shadow-2xl rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-semibold text-center mb-2">
              Your Career Profile
            </h2>
            <p className="text-center text-blue-400 text-lg font-medium mb-6">
              {profileTitle}
            </p>
            <div className="bg-slate-700/60 p-4 rounded-lg text-sm mb-8">
              Based on your responses, this profile reflects your strongest tendencies and areas for development.
            </div>
            <h3 className="text-lg font-semibold mb-4">Top Strengths</h3>
            <div className="space-y-4 mb-8">
              {topStrengths.map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">
                      {category.replace("_", " ")}
                    </span>
                    <span>{score}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <h3 className="text-lg font-semibold mb-2">Growth Opportunity</h3>
            <div className="bg-slate-700/60 p-4 rounded-lg text-sm mb-8">
              <span className="capitalize font-medium">
                {growthArea[0].replace("_", " ")}
              </span>{" "}
              needs more attention.
            </div>
            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
                setStep(0);
                setTimeLeft(300);
              }}
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
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
      <div className="pt-16 md:pt-0 md:ml-64 min-h-screen bg-slate-100">
        <div className="max-w-3xl mx-auto pt-8 px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Career Assessment
          </h1>
          <p className="text-slate-500 mt-2">
            Complete this 9-question assessment to discover your strengths and growth areas.
          </p>
          <div className="flex gap-6 mt-6 text-sm text-slate-600 flex-wrap">
            <div className="flex items-center gap-2">
              <ListChecks size={18} />9 Questions
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />5 Minutes
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} />Personalized Results
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-6 px-4 sm:px-6 pb-16">
          <div className="bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl p-6 sm:p-8 text-white">

            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-slate-400">
                Question {step + 1} of {totalSteps}
              </span>

              <div className="flex flex-col items-end">
                {timeLeft <= 30 && timeLeft > 0 && (
                  <p className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs mb-1">
                    Hurry up! Less than 30 seconds remaining.
                  </p>
                )}
                <div
                  className={`flex items-center gap-2 font-medium ${
                    timeLeft <= 30 ? "text-red-500" : "text-slate-100"
                  }`}
                >
                  <Clock size={16} />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <h3 className="text-lg mb-6">
              {questions[step].question}
            </h3>

            <div className="space-y-3">
              {questions[step].options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-3 rounded-lg cursor-pointer border transition ${
                    answers[step]?.label === option.label
                      ? "bg-slate-700 border-blue-500"
                      :  "bg-slate-900 border-slate-600 hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${step}`}
                    checked={answers[step]?.label === option.label}
                    onChange={() => handleSelect(option)}
                   className="mr-2 accent-blue-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrev}
                disabled={step === 0}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!answers[step]}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >
                {step === totalSteps - 1 ? "Finish" : "Next"}
              </button>
            </div>

          </div>
        </div>

        {showTimeoutModal && (
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
                  setShowTimeoutModal(false);
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
    </>
  );
}

export default Assessment;