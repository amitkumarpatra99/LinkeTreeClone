"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Login = () => {
    const [handle, setHandle] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Since we don't have real auth, we just simulate a login by sending them to the generate page
        // with their handle pre-filled (if we implemented query params there) or just redirecting.
        // For better UX, we could check if the handle exists first via API, but for now, we'll assume success.

        if (handle) {
            router.push('/generate');
        } else {
            alert("Please enter your handle");
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
                        <h2 className="text-xl font-semibold mt-4">Welcome back</h2>
                        <p className="text-gray-400 text-sm mt-2">Login to your Linktree.</p>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div className="space-y-1">
                            <input
                                value={handle}
                                onChange={(e) => setHandle(e.target.value)}
                                type="text"
                                placeholder="Username / Handle"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#d2e823] transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#d2e823] transition-colors"
                            />
                        </div>

                        <button type="submit" className="bg-[#d2e823] hover:bg-[#c1d620] text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(210,232,35,0.3)] mt-2">
                            Log in
                        </button>
                    </form>

                    <div className="text-center mt-8 text-sm text-gray-400">
                        Don&apos;t have an account? <Link href="/generate" className="text-white underline hover:text-[#d2e823] transition-colors">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
