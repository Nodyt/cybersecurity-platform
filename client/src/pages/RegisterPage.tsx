import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, User, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Register
            await axios.post('/api/auth/register', {
                email,
                name,
                password
            });

            // Auto-login after register
            const loginResponse = await axios.post('/api/auth/login', {
                email,
                password
            });

            const { token, user } = loginResponse.data;
            login(token, user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
            <div className="w-full max-w-md space-y-8 bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-800">

                <div className="text-center">
                    <a href="https://nodyt.com" target="_blank" rel="noopener noreferrer" className="mx-auto flex h-20 items-center justify-center mb-6 hover:opacity-80 transition-opacity cursor-pointer">
                        <img src="/logo.webp" alt="NODYTCURITY Logo" className="h-full w-auto object-contain" />
                    </a>
                    <h2 className="text-3xl font-black font-orbitron text-white uppercase tracking-wider">
                        Join NodytCurity
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Start your journey to becoming a NODYT Agent.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300">
                                Full Name
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full rounded-md border border-slate-700 bg-slate-950 py-2 pl-10 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300">
                                Email Address
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border border-slate-700 bg-slate-950 py-2 pl-10 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm"
                                    placeholder="agent@nodyt.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border border-slate-700 bg-slate-950 py-2 pl-10 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg shadow-orange-600/20"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-slate-400">Already have an account? </span>
                        <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400 transition-colors">
                            Sign in instead
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
