import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogOut,
    Shield,
    Github,
    Mail,
    MapPin,
    ShieldCheck,
    Twitter,
    Linkedin,
    Quote,
    Activity,
    ShieldAlert
} from 'lucide-react';

const CYBER_QUOTES = [
    { text: "Cybersecurity is not just a technical problem, it is a human solution.", author: "Security Axiom" },
    { text: "The most secure lock is the one between your ears. Think before you click.", author: "Digital Wisdom" },
    { text: "Social engineering is the art of hacking a person's trust before hacking their computer.", author: "The Human Factor" },
    { text: "Data is the new gold, and encryption is the safest vault.", author: "Crypto Principles" },
    { text: "In the world of 0s and 1s, the most powerful number is a resilient user.", author: "Nodyt Philosophy" }
];

export default function Layout({ children }: { children: ReactNode }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % CYBER_QUOTES.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const isLoginOrRegister = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

    if (isLoginOrRegister) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200 font-inter relative">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col sticky top-0 h-screen z-20">
                <div className="h-20 flex items-center px-8 border-b border-slate-800">
                    <a href="https://nodyt.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
                        <img src="/logo.webp" alt="Logo" className="h-10 w-auto mr-3" />
                        <span className="font-bold text-white tracking-[0.2em] font-orbitron text-base">NODYTCURITY</span>
                    </a>
                </div>

                <nav className="flex-1 px-6 py-10 space-y-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`w-full flex items-center px-5 py-4 rounded-xl border transition-all duration-300 ${location.pathname === '/dashboard' ? 'bg-orange-600/10 text-orange-400 border-orange-500/30' : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200'}`}
                    >
                        <Shield className="w-6 h-6 mr-4" />
                        <span className="font-bold uppercase tracking-wider text-sm">Operation Hub</span>
                    </button>

                    <button
                        onClick={() => navigate('/progress')}
                        className={`w-full flex items-center px-5 py-4 rounded-xl border transition-all duration-300 ${location.pathname === '/progress' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200'}`}
                    >
                        <Activity className="w-6 h-6 mr-4" />
                        <span className="font-bold uppercase tracking-wider text-sm">My Progress</span>
                    </button>

                    <button
                        onClick={() => navigate('/simulation')}
                        className={`w-full flex items-center px-5 py-4 rounded-xl border transition-all duration-300 ${location.pathname === '/simulation' ? 'bg-red-600/10 text-red-500 border-red-500/30' : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200'}`}
                    >
                        <Mail className="w-6 h-6 mr-4" />
                        <span className="font-bold uppercase tracking-wider text-sm">Phishing Drill</span>
                    </button>

                    <button
                        onClick={() => navigate('/quiz')}
                        className={`w-full flex items-center px-5 py-4 rounded-xl border transition-all duration-300 ${location.pathname === '/quiz' ? 'bg-orange-600/10 text-orange-400 border-orange-500/30' : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200'}`}
                    >
                        <ShieldAlert className="w-6 h-6 mr-4" />
                        <span className="font-bold uppercase tracking-wider text-sm">Cyber Drill</span>
                    </button>

                    <div className="pt-2">
                        <button
                            onClick={logout}
                            className="w-full flex items-center px-5 py-4 rounded-xl border transition-all duration-300 text-slate-400 border-transparent hover:bg-red-600/10 hover:text-red-500"
                        >
                            <LogOut className="w-6 h-6 mr-4" />
                            <span className="font-bold uppercase tracking-wider text-sm">Log Out</span>
                        </button>
                    </div>

                    <div className="pt-10">
                        <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-600"></div>
                            <Quote className="w-6 h-6 text-orange-500 mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <div className="h-24">
                                <p className="text-base leading-relaxed font-outfit text-slate-200 italic animate-in fade-in slide-in-from-right-4 duration-500" key={quoteIndex}>
                                    "{CYBER_QUOTES[quoteIndex].text}"
                                </p>
                            </div>
                            <p className="text-xs font-black text-orange-600 mt-4 uppercase tracking-[0.2em]">— {CYBER_QUOTES[quoteIndex].author}</p>
                        </div>
                    </div>
                </nav>

                <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-500 font-black font-orbitron text-lg shadow-lg">
                            {user?.name ? user.name[0].toUpperCase() : '?'}
                        </div>
                        <div className="ml-4 overflow-hidden">
                            <p className="text-base font-black text-white truncate font-outfit uppercase tracking-tight">{user?.name || user?.email}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
                <a href="https://nodyt.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
                    <img src="/logo.webp" alt="Logo" className="h-8 w-auto mr-2" />
                    <span className="font-bold text-white tracking-wider font-orbitron text-xs">NODYTCURITY</span>
                </a>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                <main className="flex-1">
                    {children}
                </main>

                {/* Nodyt Official Footer */}
                <footer className="mt-auto py-20 border-t border-white/5 bg-black/40 relative overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                            {/* Col 1: Brand */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <img src="/logo.webp" alt="NODYT" className="w-10 h-10 object-contain" />
                                    <span className="text-xl font-bold font-mono tracking-wider text-white">NODYT</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
                                    Architecting the Autonomous Enterprise. Empowering visionary companies with the intelligent workforce of tomorrow.
                                </p>
                                <div className="flex gap-4">
                                    <a href="https://x.com/nodyt" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                    <a href="https://linkedin.com/company/nodyt" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                    <a href="https://github.com/nodyt" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                        <Github className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                            {/* Col 2: Menu */}
                            <div>
                                <h4 className="text-white font-bold mb-6 font-display uppercase tracking-widest text-sm">MENU</h4>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li><a href="https://nodyt.com" className="hover:text-orange-500 transition-colors">Home</a></li>
                                    <li><a href="https://nodyt.com/enterprise.html" className="hover:text-orange-500 transition-colors">Enterprise</a></li>
                                    <li><a href="https://nodyt.com/#services" className="hover:text-orange-500 transition-colors">Solutions</a></li>
                                    <li><a href="https://nodyt.com/#cases" className="hover:text-orange-500 transition-colors">Case Studies</a></li>
                                    <li><a href="https://nodyt.com/blog/" className="hover:text-orange-500 transition-colors">Blog</a></li>
                                    <li><a href="https://nodyt.com/#contact" className="hover:text-orange-500 transition-colors">Contact</a></li>
                                </ul>
                            </div>

                            {/* Col 3: Legal */}
                            <div>
                                <h4 className="text-white font-bold mb-6 font-display uppercase tracking-widest text-sm">LEGAL</h4>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li><a href="https://nodyt.com/privacy-policy.html" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
                                    <li><a href="https://nodyt.com/terms-of-service.html" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
                                </ul>
                            </div>

                            {/* Col 4: Contact */}
                            <div>
                                <h4 className="text-white font-bold mb-6 font-display uppercase tracking-widest text-sm">CONTACT</h4>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                                        <span>NODYT LLC<br />16192 Coastal Highway<br />Lewes, DE 19958, USA</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-orange-500" />
                                        <a href="mailto:contact@nodyt.com" className="hover:text-white transition-colors">contact@nodyt.com</a>
                                    </li>
                                </ul>
                                <div className="mt-6 flex items-center gap-2 text-xs text-green-500 border border-green-500/20 bg-green-500/5 px-3 py-2 rounded-full w-max">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>GDPR/SOC2 Compliant</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <p>&copy; 2026 NODYT. All rights reserved.</p>
                                <div className="hidden md:block w-1 h-1 bg-gray-700 rounded-full"></div>
                                <a href="https://www.linkedin.com/in/cesarmatta/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-orange-500 transition-colors group">
                                    <span>Systems by <strong className="text-gray-300 group-hover:text-white transition-colors">Cesar Matta</strong></span>
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="flex gap-6">
                                <a href="https://nodyt.com/privacy-policy.html" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="https://nodyt.com/terms-of-service.html" className="hover:text-white transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}
