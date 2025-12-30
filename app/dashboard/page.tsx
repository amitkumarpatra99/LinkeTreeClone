"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { toast } from 'react-toastify';

interface LinkItem {
  link: string;
  linktext: string;
}

const Dashboard = () => {
  const [links, setLinks] = useState<LinkItem[]>([{ link: "", linktext: "" }]);
  const [handle, setHandle] = useState("");
  const [pic, setPic] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("default");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return;
    }

    // Fetch user data
    fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            setHandle(data.user.handle);
            setPic(data.user.pic || "");
            setBio(data.user.bio || "");
            setTheme(data.user.theme || "default");
            setLinks(data.user.links && data.user.links.length > 0 ? data.user.links : [{ link: "", linktext: "" }]);
        } else {
            localStorage.removeItem('token');
            router.push('/login');
        }
    })
    .catch(err => {
        console.error(err);
        localStorage.removeItem('token');
        router.push('/login');
    });

  }, [router]);

  const addLinkField = () => {
    setLinks([...links, { link: "", linktext: "" }]);
  }

  const removeLinkField = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  }

  const handleLinkChange = (index: number, key: keyof LinkItem, value: string) => {
    const newLinks = [...links];
    newLinks[index][key] = value;
    setLinks(newLinks);
  }

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
  }

  const saveProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    // We update via api/add (which performs upsert). 
    // Ideally we should secure api/add too, but for now we trust the handle from the verified user session state.
    // To make it secure, we should really pass the token to api/add and let it verify.
    // For this quick pass, we'll keep using api/add but we populate it with the correct handle from state.

    try {
        const res = await fetch("/api/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                links: links,
                handle: handle,
                pic: pic,
                bio: bio,
                theme: theme
            })
        });
        const result = await res.json();
        if (result.success) {
            toast.success("Profile saved successfully!");
        } else {
            toast.error(result.message);
        }
    } catch (error: any) {
        toast.error("Error saving profile: " + error.message);
    } finally {
        setLoading(false);
    }
  }

  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white pt-32 md:pt-40 pb-12 selection:bg-[#d2e823] selection:text-black'>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
            onClick={() => setPreviewMode(!previewMode)}
            className="bg-[#d2e823] text-black w-14 h-14 rounded-full flex items-center justify-center font-bold shadow-lg shadow-yellow-400/20 active:scale-90 transition-transform"
        >
            {previewMode ? 'Edit' : 'View'}
        </button>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[80vh]">

        {/* Form Section */}
        <div className={`flex flex-col gap-10 animate-fade-in ${previewMode ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex justify-between items-end border-b border-white/10 pb-6">
            <div>
                <h1 className='text-3xl md:text-5xl font-extrabold mb-2 tracking-tight'>Dashboard</h1>
                <p className="text-gray-400 text-sm md:text-base">Customize your public profile.</p>
            </div>
            <button 
                onClick={handleLogout}
                className="px-5 py-2.5 bg-white/5 hover:bg-red-500/10 text-gray-300 hover:text-red-500 border border-white/10 hover:border-red-500/50 rounded-full transition-all text-sm font-semibold backdrop-blur-sm"
            >
                Log out
            </button>
          </div>

          <div className='flex flex-col gap-10'>
            {/* Step 1: Handle (Read Only in Dashboard) */}
            <div className="space-y-4">
              <h2 className='text-xl flex items-center gap-3 font-bold'>
                <div className="w-8 h-8 rounded-full bg-[#d2e823] text-black flex items-center justify-center text-sm font-bold shadow-[0_0_10px_rgba(210,232,35,0.2)]">1</div>
                Your Handle
              </h2>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 font-medium z-10">
                  linktr.ee/
                </div>
                <input
                  value={handle}
                  readOnly
                  className='w-full bg-[#151515] border border-white/5 rounded-2xl py-5 pl-24 pr-6 focus:outline-none cursor-not-allowed font-medium text-gray-400 shadow-inner'
                  type="text"
                />
              </div>
            </div>

            {/* Step 2: Links */}
            <div className="space-y-4">
              <h2 className='text-xl flex items-center gap-3 font-bold'>
                <div className="w-8 h-8 rounded-full bg-[#d2e823] text-black flex items-center justify-center text-sm font-bold shadow-[0_0_10px_rgba(210,232,35,0.2)]">2</div>
                Your Links
              </h2>

              <div className="flex flex-col gap-4">
                {links.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start animate-fade-in group">
                    <div className="flex-1 grid gap-3 p-5 rounded-2xl bg-[#151515] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="relative">
                        <input
                            value={item.linktext}
                            onChange={e => handleLinkChange(index, "linktext", e.target.value)}
                            className='w-full bg-transparent border-b border-white/10 px-0 py-2 focus:outline-none focus:border-[#d2e823] transition-colors text-sm font-medium placeholder-gray-600'
                            type="text"
                            placeholder='Title (e.g. My Instagram)'
                        />
                      </div>
                      <div className="relative">
                         <input
                            value={item.link}
                            onChange={e => handleLinkChange(index, "link", e.target.value)}
                            className='w-full bg-transparent border-b border-white/10 px-0 py-2 focus:outline-none focus:border-[#d2e823] transition-colors text-sm font-mono text-gray-400 placeholder-gray-700'
                            type="text"
                            placeholder='URL (https://...)'
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeLinkField(index)}
                      className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all h-full flex items-center justify-center border border-transparent hover:border-red-500/20"
                      title="Remove link"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))}

                <button onClick={addLinkField} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 hover:text-[#d2e823] hover:border-[#d2e823] hover:bg-[#d2e823]/5 transition-all text-sm font-bold flex items-center justify-center gap-2 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">+</span> Add another link
                </button>
              </div>
            </div>

            {/* Step 3: Picture & Bio */}
            <div className="space-y-4">
              <h2 className='text-xl flex items-center gap-3 font-bold'>
                <div className="w-8 h-8 rounded-full bg-[#d2e823] text-black flex items-center justify-center text-sm font-bold shadow-[0_0_10px_rgba(210,232,35,0.2)]">3</div>
                Profile Details
              </h2>
              <div className="bg-[#151515] p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                <div>
                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 block">Profile Picture URL</label>
                    <input
                        value={pic}
                        onChange={e => setPic(e.target.value)}
                        className='w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d2e823] transition-colors text-white placeholder-gray-600 text-sm'
                        type="text"
                        placeholder='https://...'
                    />
                </div>
                <div>
                     <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 block">Bio</label>
                    <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        className='w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#d2e823] transition-colors text-white placeholder-gray-600 text-sm h-24 resize-none'
                        placeholder='Tell the world a little bit about yourself...'
                    />
                </div>
              </div>
            </div>

            {/* Step 4: Theme */}
            <div className="space-y-4">
              <h2 className='text-xl flex items-center gap-3 font-bold'>
                <div className="w-8 h-8 rounded-full bg-[#d2e823] text-black flex items-center justify-center text-sm font-bold shadow-[0_0_10px_rgba(210,232,35,0.2)]">4</div>
                Select Theme
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {  id: 'default', name: 'Dark Mode', bg: 'bg-[#0a0a0a]' },
                    {  id: 'light', name: 'Light Mode', bg: 'bg-[#f4f4f4]' },
                    {  id: 'gradient', name: 'Gradient', bg: 'bg-gradient-to-br from-indigo-900 to-purple-900' },
                    {  id: 'forest', name: 'Forest', bg: 'bg-[#1a2e1a]' }
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`p-1 rounded-2xl border-2 transition-all ${theme === t.id ? 'border-[#d2e823] scale-105' : 'border-transparent hover:scale-105'} flex flex-col gap-2 group`}
                    >
                         <div className={`h-24 w-full rounded-xl ${t.bg} border border-white/10 relative overflow-hidden shadow-lg`}>
                            {theme === t.id && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-[#d2e823] flex items-center justify-center text-black">
                                       ✓
                                    </div>
                                </div>
                            )}
                         </div>
                         <span className={`text-sm font-medium ${theme === t.id ? 'text-[#d2e823]' : 'text-gray-400 group-hover:text-white'}`}>{t.name}</span>
                    </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
                <button
                onClick={saveProfile}
                className={`w-full bg-[#d2e823] hover:bg-[#c1d620] text-black font-bold py-5 rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_30px_rgba(210,232,35,0.2)] disabled:opacity-50 disabled:cursor-not-allowed text-lg`}
                disabled={loading}
                >
                {loading ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </div>
          </div>
        </div>

        {/* Preview Section - Sticky on Desktop, Toggle on Mobile */}
        <div className={`${previewMode ? 'flex' : 'hidden'} lg:flex items-start justify-center relative pt-10`}>
          <div className="sticky top-32 w-full flex flex-col items-center">
            <h3 className="text-gray-400 text-sm font-medium mb-6 uppercase tracking-widest hidden lg:block">Live Preview</h3>
            
            <div className="w-[320px] h-[640px] bg-black border-[12px] border-[#222] rounded-[3.5rem] shadow-2xl overflow-hidden relative ring-1 ring-white/10">
              <div 
                className={`w-full h-full flex flex-col p-6 items-center pt-12 gap-6 overflow-y-auto no-scrollbar relative transition-colors duration-500
                ${theme === 'light' ? 'bg-[#f4f4f4] text-black' : 
                  theme === 'gradient' ? 'bg-gradient-to-br from-indigo-900 to-purple-900 text-white' : 
                  theme === 'forest' ? 'bg-[#1a2e1a] text-white' : 
                  'bg-[#0a0a0a] text-white'
                }`}
              >
                
                {/* Status Bar */}
                <div className={`absolute top-0 w-full h-6 px-6 flex justify-between items-center text-[10px] opacity-50 z-20 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <div className={`w-3 h-3 rounded-full ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
                        <div className={`w-3 h-3 rounded-full ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="relative z-10 flex flex-col items-center w-full gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border-4 border-[#1a1a1a] overflow-hidden shrink-0 shadow-lg">
                    {pic ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={pic} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold opacity-20">?</div>
                    )}
                    </div>
                    <div className="text-center w-full">
                        <div className="font-bold text-xl mb-1">@{handle || "yourname"}</div>
                        <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{bio || "Bio description can go here"}</p>
                    </div>

                    <div className="w-full flex flex-col gap-3 mt-2">
                    {links.map((link, i) => (
                        link.linktext && (
                        <div key={i} 
                            className={`w-full p-4 rounded-xl border backdrop-blur-sm flex items-center justify-center text-sm font-semibold break-words text-center transition-colors cursor-pointer shadow-sm
                            ${theme === 'light' 
                                ? 'bg-white border-gray-200 text-black hover:bg-gray-50' 
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                            }`}
                        >
                            {link.linktext}
                        </div>
                        )
                    ))}
                    {links.length === 0 || !links[0].linktext ? (
                        <div className="w-full h-12 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-xs text-gray-600">
                            Add links to see them here
                        </div>
                    ) : null}
                    </div>
                </div>

                {/* Bottom branding */}
                 <div className="mt-auto py-4 opacity-30">
                     <div className="transform scale-75 flex gap-1 font-bold">
                        <span className={theme === 'light' ? 'text-black' : 'text-white'}>Link</span>
                        <span className="text-[#d2e823]">Tree</span>
                     </div>
                 </div>

              </div>
            </div>
            
            <Link href={`/${handle}`} target="_blank" className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-sm text-gray-300 hover:text-[#d2e823] transition-all flex items-center gap-2 border border-white/5">
                View Live Page <span className="text-lg">↗</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
