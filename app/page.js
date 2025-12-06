import Image from "next/image";
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 overflow-hidden selection:bg-[#d2e823] selection:text-black">

      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#d2e823] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-fade-in duration-1000"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-fade-in delay-200 duration-1000"></div>
      </div>

      <section className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        <div className="flex flex-col gap-8 max-w-2xl animate-fade-in">
          <h1 className="font-extrabold text-5xl sm:text-7xl leading-[1.1] tracking-tight">
            Everything you are. In one, simple <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d2e823] to-green-400">link in bio.</span>
          </h1>

          <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
            Join 50M+ people using Linktree for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-lg">
            <div className="relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d2e823] to-green-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-[#1a1a1a] rounded-lg p-1">
                <span className="pl-4 pr-2 text-gray-500 font-medium">linktr.ee/</span>
                <input
                  type="text"
                  placeholder="yourname"
                  className="w-full bg-transparent text-white p-3 focus:outline-none font-medium placeholder-gray-600"
                />
              </div>
            </div>
            <button className="bg-[#d2e823] hover:bg-[#c1d620] text-black font-bold py-4 px-8 rounded-lg whitespace-nowrap transition-transform hover:scale-105 shadow-[0_0_20px_rgba(210,232,35,0.3)]">
              Claim your Linktree
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end animate-fade-in delay-200">
          {/* Mockup Container */}
          <div className="relative w-[300px] h-[600px] bg-[#111] border-[8px] border-[#222] rounded-[3rem] shadow-2xl overflow-hidden glass z-10">
            {/* Screen Content */}
            <div className="w-full h-full bg-[#0a0a0a] flex flex-col p-6 gap-4 relative overflow-hidden">
              {/* Profile */}
              <div className="flex flex-col items-center gap-2 mt-8 z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border-2 border-[#333]"></div>
                <div className="h-4 w-32 bg-gray-800 rounded-full"></div>
                <div className="h-3 w-24 bg-gray-900 rounded-full"></div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-3 mt-4 z-10 w-full">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-12 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="h-2 w-24 bg-white/10 rounded-full"></div>
                  </div>
                ))}
              </div>

              {/* Floating Elements Background in Phone */}
              <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d2e823] via-[#0a0a0a] to-[#0a0a0a]"></div>
            </div>
          </div>

          {/* Decorative Elements behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#d2e823]/20 rounded-full blur-3xl -z-10"></div>
        </div>
      </section>

      <section className="bg-[#0f0f0f] py-32 mt-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Create and customize your Linktree in minutes</h2>
            <p className="text-gray-400 text-lg">Connect your TikTok, Instagram, Twitter, website, store, videos, music, podcast, events and more. It all comes together in a link in bio landing page designed to convert.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Analytics', desc: 'Track your engagement and understand your audience.', color: 'from-blue-500/20 to-purple-500/20' },
              { title: 'Customization', desc: 'Design your page to match your brand style.', color: 'from-[#d2e823]/20 to-green-500/20' },
              { title: 'Monetization', desc: 'Accept payments and sell products directly.', color: 'from-pink-500/20 to-red-500/20' }
            ].map((item, i) => (
              <div key={i} className={`glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} blur-2xl rounded-full -mr-10 -mt-10 transition-all group-hover:scale-150 duration-700`}></div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">{item.title}</h3>
                <p className="text-gray-400 relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
