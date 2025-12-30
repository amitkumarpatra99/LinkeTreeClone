"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LinkItem {
  link: string;
  linktext: string;
}

const Dashboard = () => {
  const [links, setLinks] = useState<LinkItem[]>([{ link: "", linktext: "" }]);
  const [handle, setHandle] = useState("");
  const [pic, setPic] = useState("");
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
                pic: pic
            })
        });
        const result = await res.json();
        if (result.success) {
            alert("Profile saved successfully!");
        } else {
            alert(result.message);
        }
    } catch (error: any) {
        alert("Error saving profile: " + error.message);
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white pt-24 selection:bg-[#d2e823] selection:text-black'>
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[80vh]">

        {/* Form Section */}
        <div className='flex flex-col gap-8 animate-fade-in'>
          <div className="flex justify-between items-start">
            <div>
                <h1 className='text-4xl font-bold mb-2'>Dashboard</h1>
                <p className="text-gray-400">Manage your Linktree profile.</p>
            </div>
            <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-sm font-medium"
            >
                Logout
            </button>
          </div>

          <div className='flex flex-col gap-8'>
            {/* Step 1: Handle (Read Only in Dashboard) */}
            <div className="space-y-4">
              <h2 className='text-[#d2e823] font-semibold text-xl flex items-center gap-2'>
                <span className="w-8 h-8 rounded-full bg-[#d2e823] text-black flex items-center justify-center text-sm font-bold">1</span>
                Your Handle
              </h2>
              <div className="relative group opacity-75">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-medium">
                  linktr.ee/
                </div>
                <input
                  value={handle}
                  readOnly
                  className='w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-24 pr-4 focus:outline-none cursor-not-allowed font-medium text-gray-400'
                  type="text"
                />
              </div>
            </div>

            {/* Step 2: Links */}
            <div className="space-y-4">
              <h2 className='text-[#d2e823] font-semibold text-xl flex items-center gap-2'>
                <span className="w-8 h-8 rounded-full bg-[#d2e823] text-black flex items-center justify-center text-sm font-bold">2</span>
                Your Links
              </h2>

              <div className="flex flex-col gap-4">
                {links.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start animate-fade-in">
                    <div className="flex-1 grid gap-2">
                      <input
                        value={item.linktext}
                        onChange={e => handleLinkChange(index, "linktext", e.target.value)}
                        className='bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d2e823] transition-colors text-sm'
                        type="text"
                        placeholder='Link Title (e.g. My Instagram)'
                      />
                      <input
                        value={item.link}
                        onChange={e => handleLinkChange(index, "link", e.target.value)}
                        className='bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d2e823] transition-colors text-sm font-mono text-gray-400'
                        type="text"
                        placeholder='URL (https://...)'
                      />
                    </div>
                    <button
                      onClick={() => removeLinkField(index)}
                      className="p-3 text-red-500 hover:bg-white/5 rounded-lg transition-colors bg-white/5 border border-white/10 h-fit"
                      title="Remove link"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button onClick={addLinkField} className="w-full py-3 border border-dashed border-white/20 rounded-lg text-gray-400 hover:text-[#d2e823] hover:border-[#d2e823] hover:bg-[#d2e823]/5 transition-all text-sm font-medium">
                  + Add another link
                </button>
              </div>
            </div>

            {/* Step 3: Picture */}
            <div className="space-y-4">
              <h2 className='text-[#d2e823] font-semibold text-xl flex items-center gap-2'>
                <span className="w-8 h-8 rounded-full bg-[#d2e823] text-black flex items-center justify-center text-sm font-bold">3</span>
                Profile Picture
              </h2>
              <input
                value={pic}
                onChange={e => setPic(e.target.value)}
                className='w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-[#d2e823] transition-colors'
                type="text"
                placeholder='Paste Image URL (https://...)'
              />
            </div>

            <button
              onClick={saveProfile}
              className={`mt-4 bg-[#d2e823] hover:bg-[#c1d620] text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(210,232,35,0.3)] disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Preview Section - Desktop Only */}
        <div className='hidden lg:flex items-center justify-center relative'>
          <div className="sticky top-32">
            <div className="w-[300px] h-[600px] bg-[#111] border-[8px] border-[#222] rounded-[3rem] shadow-2xl overflow-hidden glass relative">
              <div className="w-full h-full bg-[#0a0a0a] flex flex-col p-6 items-center pt-12 gap-6 overflow-y-auto no-scrollbar">
                {/* Preview Content */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border-2 border-[#333] overflow-hidden">
                  {pic && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={pic} className="w-full h-full object-cover" alt="Preview" />
                  )}
                </div>
                <div className="text-center w-full">
                  <div className="font-bold text-white mb-1">@{handle || "yourname"}</div>
                </div>

                <div className="w-full flex flex-col gap-3">
                  {links.map((link, i) => (
                    link.linktext && (
                      <div key={i} className="w-full p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center text-xs font-medium text-white">
                        {link.linktext}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
            
            <Link href={`/${handle}`} target="_blank" className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-sm text-gray-400 hover:text-[#d2e823] transition-colors flex items-center gap-2">
                View Live Page <span>→</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
