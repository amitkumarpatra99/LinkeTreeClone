"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// import { ToastContainer, toast } from 'react-toastify';

interface LinkItem {
  link: string;
  linktext: string;
}

const Generate = () => {
  const [links, setLinks] = useState<LinkItem[]>([{ link: "", linktext: "" }]);
  const [handle, setHandle] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

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

  const submitLinks = async () => {
    if (!handle || links.length === 0) {
      alert("Please fill in your handle and at least one link.");
      return;
    }

    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "links": links,
      "handle": handle,
      "pic": pic
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect
    };

    try {
      const r = await fetch("/api/add", requestOptions);
      const result = await r.json();
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error: any) {
      alert("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white pt-24 selection:bg-[#d2e823] selection:text-black'>
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[80vh]">

        {/* Form Section */}
        <div className='flex flex-col gap-8 animate-fade-in'>
          <div>
            <h1 className='text-4xl font-bold mb-2'>Create your LinkTree</h1>
            <p className="text-gray-400">Customize your profile and share it with the world.</p>
          </div>

          <div className='flex flex-col gap-8'>
            {/* Step 1: Handle */}
            <div className="space-y-4">
              <h2 className='text-[#d2e823] font-semibold text-xl flex items-center gap-2'>
                <span className="w-8 h-8 rounded-full bg-[#d2e823] text-black flex items-center justify-center text-sm font-bold">1</span>
                Claim your Handle
              </h2>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-medium">
                  linktr.ee/
                </div>
                <input
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  className='w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-24 pr-4 focus:outline-none focus:border-[#d2e823] transition-colors font-medium placeholder-gray-600'
                  type="text"
                  placeholder='yourname'
                />
              </div>
            </div>

            {/* Step 2: Links */}
            <div className="space-y-4">
              <h2 className='text-[#d2e823] font-semibold text-xl flex items-center gap-2'>
                <span className="w-8 h-8 rounded-full bg-[#d2e823] text-black flex items-center justify-center text-sm font-bold">2</span>
                Add your Links
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
              onClick={submitLinks}
              className={`mt-4 bg-[#d2e823] hover:bg-[#c1d620] text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(210,232,35,0.3)] disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create your Link Tree'}
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
          </div>
        </div>

      </div>
      {/* <ToastContainer /> */}
    </div>
  )
}

export default Generate
