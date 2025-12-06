"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'

const Discover = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const req = await fetch('/api/users');
                const res = await req.json();
                if (res.success) {
                    setUsers(res.users);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.handle?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 selection:bg-[#d2e823] selection:text-black">
            <div className="container mx-auto px-6 min-h-[80vh]">
                <div className="flex flex-col items-center mb-12 animate-fade-in text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Linktrees</h1>
                    <p className="text-gray-400 max-w-lg">Explore profiles created by the community. Find inspiration or connect with others.</p>

                    {/* Search Bar */}
                    <div className="mt-8 w-full max-w-md relative">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Search by handle..."
                            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 pl-12 focus:outline-none focus:border-[#d2e823] transition-colors"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                            <Link key={index} href={`/${user.handle}`} className="block group">
                                <div className="glass h-full p-6 rounded-2xl flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                                    <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-tr from-[#d2e823]/0 to-[#d2e823]/5 group-hover:to-[#d2e823]/10 transition-colors"></div>

                                    <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden border-2 border-white/10 group-hover:border-[#d2e823] transition-colors relative z-10">
                                        <img src={user.pic || "https://avatars.githubusercontent.com/u/10?v=4"} alt={user.handle} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="text-center relative z-10">
                                        <h3 className="font-bold text-lg">@{user.handle}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{user.links?.length || 0} links</p>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full text-center text-gray-500 py-12">No profiles found matching "{search}"</div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default Discover
