import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    CheckCircle,
    PlayCircle,
    Trophy,
    Zap,
    Loader2,
    ShieldAlert,
    ArrowRight
} from 'lucide-react';
import axios from 'axios';

interface Module {
    id: string;
    title: string;
    description: string;
    type: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    attempts: number;
    score: number;
    completedAt: string | null;
}

interface DashboardData {
    riskScore: number;
    excellenceScore: number;
    completedModules: number;
    totalModules: number;
    modules: Module[];
}

export default function DashboardPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('/api/training/status', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    // Handle auto-redirect to certificate when all modules are completed
    useEffect(() => {
        if (data && data.completedModules === data.totalModules && data.totalModules > 0) {
            const hasSeenCertificate = localStorage.getItem('has_seen_certificate');
            if (hasSeenCertificate !== 'true') {
                localStorage.setItem('has_seen_certificate', 'true');
                navigate('/certificate');
            }
        }
    }, [data, navigate]);

    if (loading) {
        return (
            <div className="flex bg-slate-950 h-[calc(100vh-80px)] items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10 pb-20">
            <header className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-orange-500 mb-2">
                            <Zap className="w-4 h-4 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Status: Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white font-outfit leading-tight">
                            Welcome, <span className="text-orange-500">{user?.name?.split(' ')[0] || 'Agent'}</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl">
                            Deploying intelligence to mitigate digital risks. Your progress determines the security score of the ecosystem.
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white font-outfit uppercase tracking-wider">Required Protocols</h3>
                    </div>
                    <div className="grid gap-4">
                        {data?.modules.map((module) => (
                            <div
                                key={module.id}
                                onClick={() => navigate(`/training/${module.id}`)}
                                className="flex items-center justify-between p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-orange-500/40 hover:bg-slate-800/50 transition-all cursor-pointer group shadow-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${module.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700 group-hover:text-orange-500'}`}>
                                        {module.status === 'COMPLETED' ? <CheckCircle className="w-7 h-7" /> : <PlayCircle className="w-7 h-7" />}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold font-outfit text-lg">{module.title}</h4>
                                        <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">
                                            {module.status === 'COMPLETED' ? `Certified • ${module.score}% Precision` : 'Certification Pending'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Effort</p>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={`w-3 h-1 rounded-full ${i <= module.attempts ? (i === 3 ? 'bg-red-500' : 'bg-orange-500') : 'bg-slate-800'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Certificate Action - Visible after all modules are complete */}
                    {data && data.completedModules === data.totalModules && data.totalModules > 0 && (
                        <div className="mt-8 pt-8 border-t border-slate-800">
                            <button
                                onClick={() => navigate('/certificate')}
                                className="w-full py-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-orange-900/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 group"
                            >
                                <Trophy className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span>Get International American University Diploma</span>
                            </button>
                        </div>
                    )}
                </section>

                <aside className="space-y-6">
                    <div className="bg-orange-600/5 border border-orange-500/20 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Trophy className="w-20 h-20 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white font-outfit uppercase tracking-widest mb-6 border-b border-orange-500/10 pb-4">Protocol Specs</h3>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-6 h-6 rounded-md bg-orange-600/20 flex items-center justify-center text-[10px] font-bold text-orange-400">01</div>
                                <div>
                                    <p className="text-sm font-bold text-white mb-1">Pass Requirement</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">Minimum 85% precision is mandatory for system validation.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-6 h-6 rounded-md bg-orange-600/20 flex items-center justify-center text-[10px] font-bold text-orange-400">02</div>
                                <div>
                                    <p className="text-sm font-bold text-white mb-1">Progress Reset</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">Failing 3rd attempt resets module locks. Full review required.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div
                        onClick={() => navigate('/quiz')}
                        className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-orange-500/30 shadow-2xl cursor-pointer group hover:border-orange-500/60 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">Daily Drill</span>
                        </div>
                        <h4 className="text-white font-bold font-outfit mb-2">Tactical Intelligence Assessment</h4>
                        <p className="text-slate-400 text-xs leading-relaxed mb-6">Test your instincts with a 6-phase cybersecurity drill. Highly precise execution required.</p>
                        <div className="flex items-center text-xs font-bold text-white uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                            <span>Initiate Drill</span>
                            <ArrowRight className="w-4 h-4 text-orange-500" />
                        </div>
                    </div>

                    <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-2xl italic">
                        <p className="text-blue-400 text-sm leading-relaxed mb-4">
                            "The transition to an autonomous enterprise starts with the security of its humans."
                        </p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">— Nodyt Architecture</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
