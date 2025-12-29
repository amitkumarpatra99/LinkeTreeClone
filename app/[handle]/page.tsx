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
        // Or return a custom "User not found" component
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex justify-center selection:bg-[#d2e823] selection:text-black">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#d2e823]/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
            </div>

            <main className="w-full max-w-lg p-6 relative z-10 flex flex-col items-center pt-20 gap-8 animate-fade-in">
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                        {/* Fallback image if user.pic is empty or invalid */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={user.pic || "https://avatars.githubusercontent.com/u/10?v=4"}
                            alt={user.handle}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">@{user.handle}</h1>
                        <p className="text-gray-400 text-sm">Everything in one place.</p>
                    </div>
                </div>

                {/* Links */}
                <div className="w-full flex flex-col gap-4">
                    {user.links && user.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.link.startsWith('http') ? link.link : `https://${link.link}`}
                            target="_blank"
                            className="group w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 flex items-center justify-between"
                        >
                            <span className="font-semibold text-center w-full">{link.linktext}</span>
                            {/* Optional: Add icon here if available */}
                        </Link>
                    ))}
                </div>

                {/* Footer Branding */}
                <div className="mt-auto py-8">
                    <Link href="/" className="text-xs font-bold flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                        <span className="text-gray-300">Link</span><span className="text-[#d2e823]">Tree</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
