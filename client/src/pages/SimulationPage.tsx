import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Mail,
    AlertTriangle,
    ShieldCheck,
    History,
    Inbox
} from 'lucide-react';

interface Simulation {
    id: string;
    sender: string;
    subject: string;
    content: string;
    difficulty: string;
}

interface SimulationResult {
    status: 'PASSED' | 'FAILED';
    score: number;
    total: number;
}

export default function SimulationPage() {
    const { token } = useAuth();
    const [inbox, setInbox] = useState<Simulation[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Simulation | null>(null);
    const [answers, setAnswers] = useState<{ [key: string]: 'PHISHING' | 'SAFE' }>({});
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<SimulationResult | null>(null);

    useEffect(() => {
        if (token) {
            fetchInbox();
        }
    }, [token]);

    const fetchInbox = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/simulation/inbox', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInbox(response.data);
            setResult(null);
            setAnswers({});
            setSelectedEmail(null);
        } catch (err) {
            console.error('Failed to load simulations', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerdict = (simId: string, verdict: 'PHISHING' | 'SAFE') => {
        setAnswers(prev => ({ ...prev, [simId]: verdict }));
    };

    const submitDrill = async () => {
        const payload = Object.keys(answers).map(simId => ({
            simulationId: simId,
            verdict: answers[simId]
        }));

        try {
            const response = await axios.post('/api/simulation/submit-drill',
                { answers: payload },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResult(response.data);
        } catch (err) {
            console.error('Failed to submit drill', err);
        }
    };

    const allAnswered = inbox.length > 0 && Object.keys(answers).length === inbox.length;

    if (loading) {
        return <div className="text-white text-center p-20">Loading Neural Simulation...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 h-[calc(100vh-80px)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black text-white font-outfit uppercase tracking-tight flex items-center gap-3">
                        <Inbox className="w-8 h-8 text-orange-500" />
                        Live Phishing Drill
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Identify threats in the simulated inbox. You must score <strong>8/10</strong> to pass.
                    </p>
                </div>
                {result && (
                    <button
                        onClick={fetchInbox}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2"
                    >
                        <History className="w-4 h-4" /> Reset Simulation
                    </button>
                )}
            </div>

            {/* Main Interface Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">

                {/* Email List (Sidebar) */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inbox ({inbox.length})</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {inbox.map(email => (
                            <div
                                key={email.id}
                                onClick={() => setSelectedEmail(email)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedEmail?.id === email.id ? 'bg-orange-600/10 border-orange-500/50' : 'bg-slate-800/50 border-transparent hover:bg-slate-800'} ${answers[email.id] ? 'opacity-50' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-white text-sm truncate w-2/3">{email.sender}</span>
                                    {answers[email.id] && (
                                        answers[email.id] === 'PHISHING' ?
                                            <AlertTriangle className="w-4 h-4 text-red-500" /> :
                                            <ShieldCheck className="w-4 h-4 text-green-500" />
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 truncate font-medium">{email.subject}</p>
                                <p className="text-xs text-slate-600 truncate mt-1">{email.content.substring(0, 40)}...</p>
                            </div>
                        ))}
                    </div>
                    {allAnswered && !result && (
                        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                            <button
                                onClick={submitDrill}
                                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg hover:scale-[1.02] transition-transform"
                            >
                                Submit Verdicts
                            </button>
                        </div>
                    )}
                </div>

                {/* Email Reader (Main Content) */}
                <div className="lg:col-span-2 flex flex-col h-full gap-6">
                    {/* Reading Pane */}
                    <div className="flex-1 bg-white text-slate-900 rounded-2xl p-8 overflow-y-auto shadow-2xl relative">
                        {selectedEmail ? (
                            <>
                                <div className="border-b border-slate-200 pb-6 mb-6">
                                    <h2 className="text-2xl font-bold mb-2">{selectedEmail.subject}</h2>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                                            {selectedEmail.sender[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{selectedEmail.sender}</p>
                                            <p className="text-xs text-slate-500">To: Me &lt;target@corp.com&gt;</p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="prose max-w-none text-sm leading-relaxed text-slate-700"
                                    dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
                                ></div>

                                {/* Action Bar */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-slate-900/90 p-2 rounded-2xl backdrop-blur-sm shadow-xl border border-slate-700">
                                    <button
                                        onClick={() => handleVerdict(selectedEmail.id, 'SAFE')}
                                        className={`px-6 py-2 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all ${answers[selectedEmail.id] === 'SAFE' ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                    >
                                        <ShieldCheck className="w-4 h-4" /> Safe
                                    </button>
                                    <div className="w-px bg-slate-700"></div>
                                    <button
                                        onClick={() => handleVerdict(selectedEmail.id, 'PHISHING')}
                                        className={`px-6 py-2 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all ${answers[selectedEmail.id] === 'PHISHING' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                    >
                                        <AlertTriangle className="w-4 h-4" /> Phishing
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <Mail className="w-16 h-16 mb-4 opacity-20" />
                                <p>Select an email from the inbox to inspect headers and content.</p>
                            </div>
                        )}
                    </div>

                    {/* Result Overlay */}
                    {result && (
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Drill Results</p>
                                    <h3 className={`text-3xl font-black font-orbitron ${result.status === 'PASSED' ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.score}/{result.total} <span className="text-base text-white ml-2">{result.status}</span>
                                    </h3>
                                </div>
                                {result.status === 'PASSED' ? (
                                    <div className="text-right">
                                        <p className="text-green-400 font-bold mb-1">Excellent Work</p>
                                        <p className="text-xs text-slate-500">Threat detection protocols verified.</p>
                                    </div>
                                ) : (
                                    <div className="text-right">
                                        <p className="text-red-400 font-bold mb-1">Critical Failure</p>
                                        <p className="text-xs text-slate-500">Review your training. Mistakes are confidential.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
