import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full py-10 px-6 border-t border-white/10 mt-20 relative bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} LinkTree Clone By MR PATRA. All rights reserved.
                </div>

                <div className="flex gap-6 text-gray-400">
                    {['Privacy', 'Terms', 'Cookies'].map((item) => (
                        <Link key={item} href="#" className="hover:text-[#d2e823] transition-colors text-sm">
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
