import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className='glass fixed top-6 left-1/2 -translate-x-1/2 w-[90vw] md:w-[80vw] max-w-7xl rounded-full px-8 py-4 z-50 flex justify-between items-center transition-all duration-300 hover:bg-white/5'>
      <div className="flex items-center gap-2">
        <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-[#d2e823] transition-colors">
          Link<span className="text-[#d2e823]">Tree</span>
        </Link>
      </div>

      <div className='hidden md:flex gap-8 font-medium text-sm text-gray-300'>
        {['Templates', 'Marketplace', 'Discover', 'Pricing', 'Learn'].map((item) => (
          <Link key={item} href="#" className="hover:text-white transition-colors">
            {item}
          </Link>
        ))}
      </div>

      <div className='flex gap-4 items-center'>
        <Link href="/login" className="hidden md:block text-sm font-semibold hover:text-white transition-colors text-gray-300">
          Log in
        </Link>
        <Link href="/signup" className="bg-[#d2e823] hover:bg-[#c1d620] text-black px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(210,232,35,0.3)]">
          Sign up free
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
