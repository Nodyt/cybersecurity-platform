import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldAlert,
    ShieldCheck,
    Zap,
    Timer,
    Trophy,
    RotateCcw,
    ArrowRight,
    Lock,
    Unlock,
    Activity,
    Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

const QUIZ_QUESTIONS: Question[] = [
    {
        id: 1,
        question: "You receive an email from 'IT Support' asking you to click a link to 'verify your account credentials' due to a security breach. What is the safest course of action?",
        options: [
            "Click the link immediately to secure your account",
            "Reply to the email asking if it's legitimate",
            "Report the email through official channels and do not click anything",
            "Click the link but use a guest browser window"
        ],
        correctAnswer: 2,
        explanation: "This is a classic phishing attempt. legitimate IT support will almost never ask you to verify credentials via an unsolicited email link.",
        difficulty: 'Easy'
    },
    {
        id: 2,
        question: "What does MFA stand for in the context of cybersecurity?",
        options: [
            "Major Firewall Authority",
            "Multi-Factor Authentication",
            "Mobile File Access",
            "Manual Frequency Alignment"
        ],
        correctAnswer: 1,
        explanation: "Multi-Factor Authentication (MFA) requires two or more verification methods to gain access to a resource.",
        difficulty: 'Easy'
    },
    {
        id: 3,
        question: "Which of these is the most secure password practice?",
        options: [
            "Using the same complex password for all sites",
            "Writing passwords down in a physical notebook",
            "Using a unique passphrase and a password manager",
            "Changing your password every week to different variations"
        ],
        correctAnswer: 2,
        explanation: "Passphrases (long strings of random words) combined with a password manager provide the best balance of security and usability.",
        difficulty: 'Medium'
    },
    {
        id: 4,
        question: "What is 'Social Engineering' in the context of cyber-attacks?",
        options: [
            "Optimizing social media algorithms",
            "Manipulating people into giving up confidential information",
            "Hacking into social networking websites",
            "Engineering a website's social sharing buttons"
        ],
        correctAnswer: 1,
        explanation: "Social engineering exploits human psychology rather than technical vulnerabilities.",
        difficulty: 'Medium'
    },
    {
        id: 5,
        question: "A 'Zero-Day' vulnerability refers to:",
        options: [
            "A flaw that has been fixed for zero days",
            "A computer virus that executes at midnight",
            "A software vulnerability that is known to the vendor but has no patch yet",
            "The first day a company starts its cybersecurity program"
        ],
        correctAnswer: 2,
        explanation: "Zero-day means the developers have had 'zero days' to fix the problem because it was just discovered or is being actively exploited.",
        difficulty: 'Hard'
    },
    {
        id: 6,
        question: "Which protocol is used to encrypt communication between a web browser and a website?",
        options: [
            "HTTP",
            "FTP",
            "HTTPS",
            "SMTP"
        ],
        correctAnswer: 2,
        explanation: "HTTPS (Hypertext Transfer Protocol Secure) uses TLS to encrypt communication.",
        difficulty: 'Easy'
    }
];

export default function QuizPage() {
    const navigate = useNavigate();
    const [started, setStarted] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20);

    const currentQuestion = QUIZ_QUESTIONS[currentIdx];

    useEffect(() => {
        let timer: any;
        if (started && !isAnswered && !showResult && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !isAnswered) {
            handleAnswer(-1); // Time's up
        }
        return () => clearInterval(timer);
    }, [started, isAnswered, showResult, timeLeft]);

    const handleAnswer = (index: number) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
        setIsAnswered(true);
        if (index === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
            setCurrentIdx(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setTimeLeft(20);
        } else {
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setStarted(false);
        setCurrentIdx(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowResult(false);
        setTimeLeft(20);
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'text-green-400';
            case 'Medium': return 'text-yellow-400';
            case 'Hard': return 'text-red-400';
            default: return 'text-slate-400';
        }
    };

    if (!started) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-orange-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-orange-500/20 shadow-2xl shadow-orange-500/10">
                        <ShieldAlert className="w-12 h-12 text-orange-500" />
                    </div>
                    <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter mb-6">
                        Cybersecurity <span className="text-orange-500">Drill</span>
                    </h1>
                    <p className="text-slate-400 text-xl max-w-xl mx-auto mb-12 leading-relaxed">
                        Test your tactical intelligence and secure your status.
                        Highly precise decisions are required to mitigate organizational threats.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <Activity className="w-6 h-6 text-orange-500 mb-3" />
                            <h4 className="text-white font-bold mb-1 uppercase tracking-widest text-xs">Reality Check</h4>
                            <p className="text-slate-500 text-xs">Real-world scenarios designed to test instincts.</p>
                        </div>
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <Timer className="w-6 h-6 text-orange-500 mb-3" />
                            <h4 className="text-white font-bold mb-1 uppercase tracking-widest text-xs">Timed Execution</h4>
                            <p className="text-slate-500 text-xs">20 seconds per protocol. Speed meets accuracy.</p>
                        </div>
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <Lock className="w-6 h-6 text-orange-500 mb-3" />
                            <h4 className="text-white font-bold mb-1 uppercase tracking-widest text-xs">Secure Status</h4>
                            <p className="text-slate-500 text-xs">Earn the respect of the system administrators.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setStarted(true)}
                        className="px-12 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl shadow-orange-900/40 transition-all hover:scale-[1.05] group"
                    >
                        Initiate Protocol
                    </button>
                </motion.div>
            </div>
        );
    }

    if (showResult) {
        const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-[2.5rem] border border-slate-800 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <Trophy className="w-64 h-64 text-orange-500" />
                    </div>

                    <div className="relative z-10">
                        {percentage >= 80 ? (
                            <div className="w-32 h-32 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-green-500/20 shadow-2xl shadow-green-500/10">
                                <ShieldCheck className="w-16 h-16 text-green-500" />
                            </div>
                        ) : (
                            <div className="w-32 h-32 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-2xl shadow-red-500/10">
                                <ShieldAlert className="w-16 h-16 text-red-500" />
                            </div>
                        )}

                        <h2 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter mb-4">
                            Assessment <span className="text-orange-500">Complete</span>
                        </h2>
                        <p className="text-slate-400 text-xl mb-12 max-w-md mx-auto leading-relaxed">
                            {percentage >= 80
                                ? "Operational excellence verified. You are a resilient link in the security chain."
                                : "Vulnerabilities detected. Critical review of security protocols is recommended."}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Score</p>
                                <p className="text-3xl font-black text-white font-orbitron">{percentage}%</p>
                            </div>
                            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Accuracy</p>
                                <p className="text-3xl font-black text-white font-orbitron">{score}/{QUIZ_QUESTIONS.length}</p>
                            </div>
                            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</p>
                                <p className={`text-xl font-black uppercase tracking-tighter ${percentage >= 80 ? 'text-green-500' : 'text-red-500'}`}>
                                    {percentage >= 80 ? 'RESILIENT' : 'VULNERABLE'}
                                </p>
                            </div>
                            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Rank</p>
                                <p className="text-xl font-black text-orange-500 uppercase tracking-tighter">
                                    {percentage >= 90 ? 'Guardian' : percentage >= 70 ? 'Analyst' : 'Trainee'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button
                                onClick={resetQuiz}
                                className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3"
                            >
                                <RotateCcw className="w-4 h-4" /> Reset Drill
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-orange-900/30 flex items-center justify-center gap-3"
                            >
                                <Target className="w-4 h-4" /> Control Center
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2 text-orange-500 mb-3">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Evaluation Phase</span>
                    </div>
                    <h2 className="text-3xl font-black text-white font-outfit uppercase tracking-tight">
                        Tactical Task <span className="text-orange-500">{currentIdx + 1}</span>
                    </h2>
                    <div className="flex items-center gap-3 mt-4">
                        <span className={`px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(currentQuestion.difficulty)}`}>
                            {currentQuestion.difficulty}
                        </span>
                        <div className="flex gap-1">
                            {QUIZ_QUESTIONS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-4 h-1 rounded-full transition-all duration-500 ${i === currentIdx ? 'bg-orange-500 w-8' : i < currentIdx ? 'bg-green-500/50' : 'bg-slate-800'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex items-center gap-6 shadow-xl backdrop-blur-sm min-w-[180px]">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 rotate-[-90deg]">
                            <circle
                                cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                                className="text-slate-800"
                            />
                            <circle
                                cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                                strokeDasharray={126}
                                strokeDashoffset={126 - (timeLeft / 20) * 126}
                                className={`transition-all duration-1000 ${timeLeft < 5 ? 'text-red-500' : 'text-orange-500'}`}
                            />
                        </svg>
                        <span className={`absolute font-black font-orbitron text-sm ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            {timeLeft}
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Response Window</p>
                        <p className="text-sm font-black text-white uppercase tracking-tighter">SEC_LIMIT_REACHED</p>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="glass-card rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl"
                >
                    <div className="p-8 md:p-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight font-inter mb-12">
                            {currentQuestion.question}
                        </h3>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={isAnswered}
                                    className={`w-full p-6 md:p-8 rounded-[1.5rem] border text-left transition-all duration-300 flex justify-between items-center group relative overflow-hidden
                                        ${!isAnswered ? 'bg-slate-900/40 border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/40' : ''}
                                        ${isAnswered && idx === currentQuestion.correctAnswer ? 'bg-green-600/10 border-green-500/40 text-green-400' : ''}
                                        ${isAnswered && selectedAnswer === idx && idx !== currentQuestion.correctAnswer ? 'bg-red-600/10 border-red-500/40 text-red-400' : ''}
                                        ${isAnswered && idx !== currentQuestion.correctAnswer && (selectedAnswer !== idx || selectedAnswer === -1) ? 'bg-slate-950/20 border-slate-900/20 opacity-30 shadow-none' : 'shadow-xl'}
                                    `}
                                >
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border transition-colors ${!isAnswered ? 'bg-slate-800 border-slate-700 text-slate-500 group-hover:border-orange-500/50 group-hover:text-orange-400' : idx === currentQuestion.correctAnswer ? 'bg-green-500 text-white' : selectedAnswer === idx ? 'bg-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="font-bold text-lg font-inter">{option}</span>
                                    </div>

                                    {isAnswered && idx === currentQuestion.correctAnswer && <Unlock className="w-6 h-6 text-green-500 relative z-10" />}
                                    {isAnswered && selectedAnswer === idx && idx !== currentQuestion.correctAnswer && <Lock className="w-6 h-6 text-red-500 relative z-10" />}
                                </button>
                            ))}
                        </div>

                        {isAnswered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-12 p-8 bg-slate-950/80 rounded-3xl border border-slate-800"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-2xl ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">Technical Analysis</h4>
                                        <p className="text-slate-400 leading-relaxed italic">
                                            {currentQuestion.explanation}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={nextQuestion}
                                        className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-orange-900/20 flex items-center group"
                                    >
                                        {currentIdx + 1 === QUIZ_QUESTIONS.length ? 'Finalize Log' : 'Deploy Next Task'}
                                        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            <footer className="mt-12 flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-4">
                <span>Nodyt Systems Intelligence Unit</span>
                <span>Hash: {Math.random().toString(36).substring(7).toUpperCase()}</span>
            </footer>
        </div>
    );
}
