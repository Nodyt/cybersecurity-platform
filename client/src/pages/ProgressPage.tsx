import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Activity,
    Target,
    AlertTriangle,
    Loader2,
    Zap
} from 'lucide-react';

interface DashboardData {
    riskScore: number;
    excellenceScore: number;
    completedModules: number;
    totalModules: number;
    modules: any[];
}

export default function ProgressPage() {
    const { token } = useAuth();
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

    if (loading) {
        return (
            <div className="flex bg-slate-950 h-full items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    const completionRate = Math.round(((data?.completedModules || 0) / (data?.totalModules || 1)) * 100);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10 pb-20">
            <header className="mb-12">
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Agent Status Report</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white font-outfit leading-tight mb-4">
                    Personnel <span className="text-orange-500">Analytics</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Detailed breakdown of operational readiness, risk mitigation scores, and tactical mastery.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] opacity-5 group-hover:opacity-10 transition-all duration-500 rotate-12">
                        <AlertTriangle className="w-48 h-48 text-orange-500" />
                    </div>
                    <div className="relative z-10 w-full">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Digital Entry Risk</p>
                        </div>
                        <div className="text-5xl font-black text-white flex items-end font-orbitron mb-6">
                            {data?.riskScore}<span className="text-lg text-slate-600 mb-2 ml-1">/ 100</span>
                        </div>
                        <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden border border-slate-700/50">
                            <div
                                className="bg-gradient-to-r from-orange-400 to-orange-600 h-full transition-all duration-1000"
                                style={{ width: `${data?.riskScore}%` }}
                            ></div>
                        </div>
                        <div className="mt-4 text-[10px] text-slate-500 flex justify-between">
                            <span>Secure Threshold</span>
                            <span className="text-orange-500">Target: 0</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-2xl relative overflow-hidden group border-green-500/10">
                    <div className="absolute right-[-20px] top-[-20px] opacity-5 group-hover:opacity-10 transition-all duration-500">
                        <Target className="w-48 h-48 text-green-500" />
                    </div>
                    <div className="relative z-10 w-full">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Training Excellence</p>
                        </div>
                        <div className="text-5xl font-black text-white flex items-end font-orbitron mb-6">
                            {data?.excellenceScore}<span className="text-lg text-slate-600 mb-2 ml-1">%</span>
                        </div>
                        <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden border border-slate-700/50">
                            <div
                                className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-1000"
                                style={{ width: `${data?.excellenceScore}%` }}
                            ></div>
                        </div>
                        <div className="mt-4 text-[10px] text-slate-500 flex justify-between">
                            <span>Precision Rate</span>
                            <span className="text-green-500">Reward: Full</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-2xl relative overflow-hidden group border-blue-500/10">
                    <div className="absolute right-[-20px] top-[-20px] opacity-5 group-hover:opacity-10 transition-all duration-500 -rotate-12">
                        <Activity className="w-48 h-48 text-blue-500" />
                    </div>
                    <div className="relative z-10 w-full">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Mission Coverage</p>
                        </div>
                        <div className="text-5xl font-black text-white flex items-end font-orbitron mb-6">
                            {data?.completedModules}<span className="text-lg text-slate-600 mb-2 ml-1">/ {data?.totalModules}</span>
                        </div>
                        <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden border border-slate-700/50">
                            <div
                                className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-1000"
                                style={{ width: `${completionRate}%` }}
                            ></div>
                        </div>
                        <div className="mt-4 text-[10px] text-slate-500 flex justify-between">
                            <span>Active Learning</span>
                            <span className="text-blue-500">{completionRate}% Done</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Module Precision Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {data?.modules.map(mod => (
                        <div key={mod.id} className="space-y-3">
                            <div className="flex justify-between items-end px-1">
                                <div>
                                    <h4 className="text-white font-bold font-outfit text-lg">{mod.title}</h4>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
                                        {mod.status === 'COMPLETED' ? 'Validated' : 'Pending'} • {mod.attempts} attempts
                                    </p>
                                </div>
                                <span className={`font-orbitron font-bold text-xl ${mod.score >= 85 ? 'text-green-500' : 'text-slate-600'}`}>{mod.score}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${mod.score >= 85 ? 'bg-green-500' : 'bg-slate-700'}`}
                                    style={{ width: `${mod.score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
