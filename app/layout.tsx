import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "LinkTree Clone | One link for everything",
  description: "The only link you'll ever need. Share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-[#0a0a0a] text-white antialiased selection:bg-[#d2e823] selection:text-black`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
