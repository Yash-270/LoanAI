import type { Metadata } from "next";
import "./globals.css"; // 🔥 IMPORTANT
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

import { Inter } from "next/font/google";


export const metadata: Metadata = {
  title: "Loan Predictor",
  description: "AI based loan prediction app",
};
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* 🔹 Navbar */}
        <Navbar />

        {/* 🔹 Page Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 🔹 Footer */}
        <Footer/>

      </body>
    </html>
  );
}
