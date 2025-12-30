"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Signup = () => {
    const [handle, setHandle] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ handle, email, password })
            });

            const data = await res.json();
            if (data.success) {
                alert("Account created! Please log in.");
                router.push('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 selection:bg-[#d2e823] selection:text-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d2e823]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md animate-fade-in">
                <div className="glass p-8 md:p-12 rounded-3xl w-full relative z-10">
                    <div className="text-center mb-10">
                        <Link href="/" className="text-3xl font-bold tracking-tighter mb-2 inline-block">
                            Link<span className="text-[#d2e823]">Tree</span>
                        </Link>
                        <h2 className="text-xl font-semibold mt-4">Create your account</h2>
                        <p className="text-gray-400 text-sm mt-2">Join Linktree today.</p>
                    </div>

                    <form onSubmit={handleSignup} className="flex flex-col gap-6">
                        <div className="space-y-4">
                            <div className="group">
                                <input
                                    value={handle}
                                    onChange={(e) => setHandle(e.target.value)}
                                    type="text"
                                    placeholder="Choose a Handle"
                                    className="w-full bg-[#151515] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#d2e823] transition-all placeholder-gray-600 font-medium"
                                />
                            </div>
                            <div className="group">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full bg-[#151515] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#d2e823] transition-all placeholder-gray-600 font-medium"
                                />
                            </div>
                            <div className="group">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-[#151515] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#d2e823] transition-all placeholder-gray-600 font-medium"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-[#d2e823] hover:bg-[#c1d620] text-black font-bold py-5 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_20px_rgba(210,232,35,0.2)] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Sign up'}
                        </button>
                    </form>

                    <div className="text-center mt-8 text-sm text-gray-400">
                        Already have an account? <Link href="/login" className="text-white underline hover:text-[#d2e823] transition-colors">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
