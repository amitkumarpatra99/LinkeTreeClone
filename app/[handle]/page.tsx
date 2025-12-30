import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';

interface LinkType {
    link: string;
    linktext: string;
}

interface User {
    handle: string;
    pic?: string;
    bio?: string;
    theme?: string;
    links?: LinkType[];
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
    const { handle } = await params;

    if (!handle) {
        return notFound();
    }

    const client = await clientPromise;
    const db = client.db("linktree");
    const collection = db.collection<User>("users");

    const user = await collection.findOne({ handle: handle });

    if (!user) {
        return notFound();
    }

    const theme = user.theme || 'default';
    
    // Theme configurations
    const themeStyles: any = {
        default: 'bg-[#0a0a0a] text-white',
        light: 'bg-[#f4f4f4] text-black',
        gradient: 'bg-gradient-to-br from-indigo-900 to-purple-900 text-white',
        forest: 'bg-[#1a2e1a] text-white'
    };

    const linkStyles: any = {
        default: 'bg-white/5 border-white/10 hover:bg-white/10 text-white',
        light: 'bg-white border-gray-200 hover:bg-gray-50 text-black shadow-sm',
        gradient: 'bg-white/10 border-white/20 hover:bg-white/20 text-white',
        forest: 'bg-[#2a402a] border-white/10 hover:bg-[#354f35] text-white'
    };
    
    const textMuted = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

    return (
        <div className={`min-h-screen flex justify-center selection:bg-[#d2e823] selection:text-black transition-colors duration-500 ${themeStyles[theme]}`}>
            
            {/* Background Effects (Only for default theme for now, or adapted) */}
            {theme === 'default' && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#d2e823]/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
                </div>
            )}

            <main className="w-full max-w-lg p-6 relative z-10 flex flex-col items-center pt-20 gap-8 animate-fade-in">
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className={`relative w-32 h-32 rounded-full overflow-hidden border-4 shadow-2xl ${theme === 'light' ? 'border-white' : 'border-white/10'}`}>
                        {/* Fallback image if user.pic is empty or invalid */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={user.pic || "https://avatars.githubusercontent.com/u/10?v=4"}
                            alt={user.handle}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">@{user.handle}</h1>
                        <p className={`text-sm max-w-xs mx-auto ${textMuted}`}>{user.bio || "Welcome to my Linktree!"}</p>
                    </div>
                </div>

                {/* Links */}
                <div className="w-full flex flex-col gap-4">
                    {user.links && user.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.link.startsWith('http') ? link.link : `https://${link.link}`}
                            target="_blank"
                            className={`group w-full p-4 rounded-xl border hover:scale-[1.02] transition-all duration-300 flex items-center justify-center text-center font-semibold ${linkStyles[theme]}`}
                        >
                            {link.linktext}
                        </Link>
                    ))}
                </div>

                {/* Footer Branding */}
                <div className="mt-auto py-8">
                    <Link href="/" className="text-xs font-bold flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                        <span className={theme === 'light' ? 'text-black' : 'text-gray-300'}>Link</span><span className="text-[#d2e823]">Tree</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
