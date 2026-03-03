import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
    ChevronLeft,
    BookOpen,
    PlayCircle,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Loader2,
    Youtube,
    Zap,
    Activity,
    Target
} from 'lucide-react';
import axios from 'axios';

// Declare YT for TypeScript
declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

interface Question {
    q: string;
    a: string[];
    c: number;
}

interface ModuleData {
    id: string;
    title: string;
    description: string;
    theory: string;
    videoUrl: string;
    quizData: Question[];
}

export default function ModulePlayerPage() {
    const { moduleId } = useParams<{ moduleId: string }>();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [module, setModule] = useState<ModuleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [mode, setMode] = useState<'video' | 'theory' | 'quiz' | 'result'>('video');
    const [videoFinished, setVideoFinished] = useState(false);

    // Quiz state
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showBypassToast, setShowBypassToast] = useState(false);

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const response = await axios.get(`/api/training/module/${moduleId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setModule(response.data);
            } catch (err) {
                setError('Failed to load module content');
            } finally {
                setLoading(false);
            }
        };

        if (token && moduleId) fetchModule();
    }, [moduleId, token]);

    // YouTube API Load
    const [videoId, setVideoId] = useState('');
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (module?.videoUrl) {
            const id = getYouTubeId(module.videoUrl);
            setVideoId(id);
        }
    }, [module]);

    const handleVideoEnd = useCallback(() => {
        setVideoFinished(true);
    }, []);

    // Load YouTube IFrame API and create player
    useEffect(() => {
        if (!videoId || mode !== 'video') return;

        // Destroy previous player if exists
        if (playerRef.current) {
            try { playerRef.current.destroy(); } catch (_) { }
            playerRef.current = null;
        }

        const createPlayer = () => {
            if (!playerContainerRef.current) return;
            playerRef.current = new window.YT.Player(playerContainerRef.current, {
                videoId: videoId,
                playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    autoplay: 1,
                },
                events: {
                    onStateChange: (event: any) => {
                        // YT.PlayerState.ENDED === 0
                        if (event.data === 0) {
                            handleVideoEnd();
                        }
                    },
                },
            });
        };

        if (window.YT && window.YT.Player) {
            createPlayer();
        } else {
            // Load the API script if not loaded yet
            const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
            if (!existingScript) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(tag);
            }
            window.onYouTubeIframeAPIReady = createPlayer;
        }

        return () => {
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch (_) { }
                playerRef.current = null;
            }
        };
    }, [videoId, mode, handleVideoEnd]);

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : '';
    };

    const handleAnswer = (index: number) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
        setIsAnswered(true);
        if (index === module?.quizData[currentQuestion].c) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion + 1 < (module?.quizData.length || 0)) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setMode('result');
            finishModule();
        }
    };

    const finishModule = async () => {
        try {
            const finalScore = Math.round((score / (module?.quizData.length || 10)) * 100);
            const response = await axios.post(`/api/training/module/${moduleId}/complete`,
                { score: finalScore },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === 'RESET_REQUIRED') {
                alert('Attention: You have failed this module 3 times. You must watch the video and review the theory again to restart the quiz.');
                setMode('video');
                setVideoFinished(false);
                setCurrentQuestion(0);
                setScore(0);
                setSelectedAnswer(null);
                setIsAnswered(false);
                return;
            }

            setMode('result');
        } catch (err) {
            console.error('Failed to save progress');
            setMode('result');
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-80px)] items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error || !module) {
        return (
            <div className="flex h-[calc(100vh-80px)] items-center justify-center text-white p-4">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">{error || 'Module not found'}</h2>
                    <Link to="/dashboard" className="text-orange-500 hover:underline">Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 relative">
            {/* Hacker Bypass Toast */}
            <AnimatePresence>
                {showBypassToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/50 p-4 rounded-xl shadow-2xl shadow-emerald-500/20 flex items-center gap-3 backdrop-blur-md"
                    >
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                            <Zap className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-emerald-400 font-bold font-orbitron uppercase tracking-wider text-sm">Operator Override</p>
                            <p className="text-slate-300 text-xs font-inter">Bypass sequence initiated successfully.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header / Breadcrumb */}
            <header className="mb-8 flex justify-between items-start">
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Training Session</span>
                        <h1 className="text-3xl font-black text-white font-outfit uppercase tracking-tight">
                            {module.title}
                        </h1>
                    </div>
                </div>
            </header>

            {/* Progress Tabs */}
            {mode !== 'result' && (
                <div className="flex mb-8 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                    <button
                        onClick={() => setMode('video')}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl transition-all duration-300 font-bold uppercase tracking-widest text-xs ${mode === 'video' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Youtube className="w-4 h-4 mr-2" />
                        Operation Brief
                    </button>
                    <button
                        disabled={!videoFinished && mode !== 'theory'}
                        onClick={() => setMode('theory')}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl transition-all duration-300 font-bold uppercase tracking-widest text-xs ${mode === 'theory' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-500 hover:text-slate-300'} ${!videoFinished && mode !== 'theory' ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Intel Check
                    </button>
                    <button
                        disabled={!videoFinished && mode !== 'quiz'}
                        onClick={() => setMode('quiz')}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl transition-all duration-300 font-bold uppercase tracking-widest text-xs ${mode === 'quiz' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-500 hover:text-slate-300'} ${!videoFinished && mode !== 'quiz' ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Engagement
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl transition-all duration-500">

                {mode === 'video' && (
                    <div className="p-0">
                        <div className="video-container bg-black aspect-video relative group flex items-center justify-center">
                            {module.videoUrl ? (
                                <div
                                    ref={playerContainerRef}
                                    className="w-full h-full"
                                ></div>
                            ) : (
                                <div className="text-white">Video not available</div>
                            )}

                            {/* Overlay removed as it might block clicks or be confusing with native controls */}
                        </div>
                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-2 mb-6 text-orange-500">
                                <Zap className="w-4 h-4 fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Module Objective</span>
                            </div>
                            <h2
                                className="text-2xl font-black text-white font-outfit mb-4 select-none cursor-pointer"
                                title="Double-click to override"
                                onDoubleClick={() => {
                                    if (!videoFinished) {
                                        handleVideoEnd();
                                        setShowBypassToast(true);
                                        setTimeout(() => setShowBypassToast(false), 3000);
                                    }
                                }}
                            >
                                Tactical Intelligence Briefing
                            </h2>
                            <p className="text-slate-400 mb-6 text-base leading-relaxed font-inter">
                                {module.description}
                            </p>

                            <div className="p-6 bg-slate-950/60 rounded-xl border border-slate-800/60 mb-8">
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-orange-500" />
                                    Primary Objective
                                </h4>
                                <p className="text-sm text-slate-400">
                                    Analyze the provided intel to identify key threat vectors. Mastery of this content is required to bypass the subsequent security evaluation.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800/50 gap-6">
                                <div className="flex items-center">
                                    {videoFinished ? (
                                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mr-5 border border-green-500/20">
                                            <CheckCircle2 className="w-7 h-7 text-green-500" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mr-5 border border-orange-500/20">
                                            <AlertCircle className="w-7 h-7 text-orange-500" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-base font-black text-white font-outfit uppercase tracking-tight">
                                            {videoFinished ?
                                                // Check if video is finished but player state shows it didn't naturally end
                                                (playerRef.current?.getPlayerState && playerRef.current?.getPlayerState() !== 0
                                                    ? <span className="text-blue-400 font-black">Admin Bypass Activated</span>
                                                    : 'Data Synchronized')
                                                : 'Monitoring Stream'
                                            }
                                        </p>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">{videoFinished ? 'You are cleared for tactical execution.' : 'Complete the briefing to unlock access.'}</p>
                                    </div>
                                </div>
                                <button
                                    disabled={!videoFinished}
                                    onClick={() => setMode('theory')}
                                    className={`w-full sm:w-auto px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 ${videoFinished ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                                >
                                    Access Intel Docs
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {mode === 'theory' && (
                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-2 h-10 bg-orange-600 rounded-full"></div>
                            <div>
                                <h2 className="text-3xl font-black text-white font-outfit uppercase tracking-tight">Core Theoretical Protocol</h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Documentation Level 4 • Internal Use Only</p>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg font-inter">
                            <ReactMarkdown>{module.theory}</ReactMarkdown>
                        </div>

                        <div className="mt-16 p-8 bg-orange-600/5 border border-orange-500/10 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                <Activity className="w-24 h-24 text-orange-500" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="font-black text-white mb-3 uppercase tracking-widest font-outfit text-xl">Operational Readiness</h4>
                                <p className="text-slate-400 mb-8 max-w-2xl leading-relaxed">
                                    You are about to initiate the evaluation phase. <strong>85% precision</strong> is required to maintain your reputation score and reduce organizational risk.
                                </p>
                                <button
                                    disabled={!videoFinished}
                                    onClick={() => setMode('quiz')}
                                    className={`px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center transition-all duration-300 ${videoFinished ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-600/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                                >
                                    {videoFinished ? 'Begin Evaluation' : 'Synchronization Required'} <ArrowRight className="w-5 h-5 ml-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {mode === 'quiz' && (
                    <div className="p-8 md:p-12">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-2">Tactical Engagement</span>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight font-outfit">Task {currentQuestion + 1} of {module.quizData.length}</h3>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Phase Progress</span>
                                <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700/30">
                                    <div
                                        className="bg-orange-600 h-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                                        style={{ width: `${((currentQuestion + 1) / module.quizData.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-white leading-tight font-inter">
                                {module.quizData[currentQuestion].q}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {module.quizData[currentQuestion].a.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={isAnswered}
                                    className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 flex justify-between items-center group relative overflow-hidden
                                        ${!isAnswered ? 'bg-slate-900/40 border-slate-800/60 hover:border-orange-500/50 hover:bg-slate-800/40' : ''}
                                        ${isAnswered && idx === module.quizData[currentQuestion].c ? 'bg-green-600/10 border-green-500/40 text-green-400' : ''}
                                        ${isAnswered && selectedAnswer === idx && idx !== module.quizData[currentQuestion].c ? 'bg-red-600/10 border-red-500/40 text-red-400' : ''}
                                        ${isAnswered && idx !== module.quizData[currentQuestion].c && selectedAnswer !== idx ? 'bg-slate-950/20 border-slate-900/20 opacity-30 shadow-none' : 'shadow-xl'}
                                    `}
                                >
                                    <span className="font-bold text-lg font-inter relative z-10">{option}</span>
                                    {isAnswered && idx === module.quizData[currentQuestion].c && <CheckCircle2 className="w-6 h-6 text-green-500 relative z-10" />}
                                    {isAnswered && selectedAnswer === idx && idx !== module.quizData[currentQuestion].c && <AlertCircle className="w-6 h-6 text-red-500 relative z-10" />}
                                </button>
                            ))}
                        </div>

                        {isAnswered && (
                            <div className="mt-12 flex justify-end">
                                <button
                                    onClick={nextQuestion}
                                    className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-xl shadow-orange-600/20 flex items-center group"
                                >
                                    {currentQuestion + 1 === module.quizData.length ? 'Finalize Log' : 'Deploy Next Task'}
                                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {mode === 'result' && (
                    <div className="p-12 md:p-20 text-center relative overflow-hidden">
                        {Math.round((score / module.quizData.length) * 100) >= 85 ? (
                            <>
                                <div className="w-32 h-32 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-2xl shadow-green-500/10 relative">
                                    <div className="absolute inset-0 bg-green-500 opacity-20 blur-2xl rounded-full"></div>
                                    <CheckCircle2 className="w-16 h-16 text-green-500 relative z-10" />
                                </div>
                                <h2 className="text-4xl font-black text-white font-outfit uppercase tracking-tight mb-4">Mission Accomplished</h2>
                                <p className="text-slate-400 mb-12 max-w-md mx-auto text-lg leading-relaxed">
                                    Strategic objectives achieved. Your performance has successfully contributed to the ecosystem security.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-32 h-32 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10 relative">
                                    <div className="absolute inset-0 bg-red-500 opacity-20 blur-2xl rounded-full"></div>
                                    <AlertCircle className="w-16 h-16 text-red-500 relative z-10" />
                                </div>
                                <h2 className="text-4xl font-black text-white font-outfit uppercase tracking-tight mb-4">System Anomaly</h2>
                                <p className="text-slate-400 mb-12 max-w-md mx-auto text-lg leading-relaxed">
                                    Evaluation failure. Critical vulnerabilities detected in your theoretical understanding.
                                </p>
                            </>
                        )}

                        <div className="grid grid-cols-2 gap-8 mb-16 max-w-sm mx-auto">
                            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 shadow-lg">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Precision Score</p>
                                <p className={`text-4xl font-black font-orbitron ${Math.round((score / module.quizData.length) * 100) >= 85 ? 'text-white' : 'text-red-500'}`}>
                                    {Math.round((score / module.quizData.length) * 100)}<span className="text-sm ml-1 opacity-50">%</span>
                                </p>
                            </div>
                            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 shadow-lg">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Operational Status</p>
                                <p className={`text-lg font-black font-outfit ${Math.round((score / module.quizData.length) * 100) >= 85 ? 'text-green-500' : 'text-red-500'} uppercase tracking-widest`}>
                                    {Math.round((score / module.quizData.length) * 100) >= 85 ? 'Valid' : 'Blocked'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            {Math.round((score / module.quizData.length) * 100) < 85 && (
                                <button
                                    onClick={() => {
                                        setMode('quiz');
                                        setCurrentQuestion(0);
                                        setScore(0);
                                        setSelectedAnswer(null);
                                        setIsAnswered(false);
                                    }}
                                    className="bg-slate-800/80 hover:bg-slate-700 text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all border border-slate-700"
                                >
                                    Re-Initiate Eval
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-orange-600 hover:bg-orange-500 text-white px-12 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-xl shadow-orange-600/20"
                            >
                                Back to Control Center
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
