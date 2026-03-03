import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Award, Download, ChevronLeft } from 'lucide-react';

export default function CertificatePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [date] = useState(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }));

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl mx-auto print:max-w-none">
                {/* Controls - Hidden on Print */}
                <div className="mb-8 flex justify-between items-center print:hidden">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all"
                    >
                        <Download className="w-5 h-5" />
                        Download PDF
                    </button>
                </div>

                {/* Certificate Container */}
                <div className="bg-white text-slate-900 p-10 md:p-1 md:py-20 relative overflow-hidden shadow-2xl rounded-xl print:shadow-none print:border-none w-full aspect-[1.414/1] flex flex-col print:h-screen print:w-screen print:rounded-none landscape:h-[800px]">

                    {/* Border Design */}
                    <div className="absolute inset-4 border-[8px] border-slate-900 absolute z-10 pointer-events-none"></div>
                    <div className="absolute inset-6 border-[2px] border-orange-600 absolute z-10 pointer-events-none"></div>

                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
                        <img src="/logo-iau-eagle.jpg" alt="IAU Eagle Watermark" className="w-[600px] h-[600px] object-contain mix-blend-multiply" />
                    </div>

                    <div className="relative z-20 flex flex-col h-full items-center justify-between py-12 px-20 text-center">

                        {/* Header */}
                        <div className="space-y-4 w-full flex flex-col items-center">
                            <div className="flex w-full justify-between items-center px-10 mb-6">
                                {/* Left Logo - Generic or Nodyt */}
                                <img src="/logo.webp" alt="Nodyt Logo" className="h-16 w-auto object-contain" />

                                <div className="text-center">
                                    <h1 className="text-5xl font-black font-serif uppercase tracking-wider text-slate-900">
                                        Certificate of Completion
                                    </h1>
                                    <p className="text-xl font-bold text-orange-600 uppercase tracking-[0.2em] mt-2">
                                        Digital Perimeter Specialist
                                    </p>
                                </div>

                                {/* Right Logo - IAU */}
                                <div className="flex flex-col items-center">
                                    <img src="/logo-iau.png" alt="International American University" className="h-20 w-auto object-contain mix-blend-multiply" />
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="max-w-3xl space-y-6 my-8">
                            <p className="text-lg italic text-slate-600">This is to certify that</p>
                            <div className="border-b-2 border-slate-300 pb-2 px-10 inline-block min-w-[400px]">
                                <span className="text-5xl font-bold text-slate-900 font-serif">
                                    {user?.name || user?.email || "Agent"}
                                </span>
                            </div>
                            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                                Has successfully completed the rigorous <strong>Cybersecurity Awareness & Defense Protocol</strong>, endorsed mutually by <strong>NODYT</strong> and the <strong>INTERNATIONAL AMERICAN UNIVERSITY</strong>.
                                The recipient has demonstrated proficiency in Phishing Defense, Data Protection,
                                and Operational Security Compliance.
                            </p>
                        </div>

                        {/* Footer / Signatures */}
                        <div className="w-full flex justify-between items-end mt-auto px-10">
                            <div className="text-center">
                                <div className="font-dancing-script text-3xl text-slate-800 mb-2 font-handwriting">
                                    Academic Board
                                </div>
                                <div className="h-[1px] w-48 bg-slate-400 mt-2 mb-2"></div>
                                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">International American University</p>
                            </div>

                            <div className="mb-4">
                                <Award className="w-24 h-24 text-orange-600 mx-auto opacity-80" />
                                <p className="text-sm font-bold text-slate-900 mt-4">{date}</p>
                            </div>

                            <div className="text-center">
                                <div className="font-dancing-script text-3xl text-slate-800 mb-2 font-handwriting">
                                    Director of Security
                                </div>
                                <div className="h-[1px] w-48 bg-slate-400 mt-2 mb-2"></div>
                                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Nodyt Authority</p>
                            </div>
                        </div>

                        {/* Security ID */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono">
                            ID: {user?.id?.substring(0, 8).toUpperCase() || 'NDT-SEC-001'} • VERIFIED SECURE DOCUMENT
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8 text-slate-600 text-sm print:hidden">
                    <p>Use the specific browser settings to print this in Landscape mode for best results.</p>
                </div>
            </div>
        </div>
    );
}
