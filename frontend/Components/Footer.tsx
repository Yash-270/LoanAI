"use client";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router=useRouter();
  return (
    <footer className="bg-gray-900 text-gray-300">
      
  <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
    
    {/* 🔹 Brand Section */}
    <div>

      <div 
        onClick={() => router.push("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2331/2331941.png"
          alt="Logo"
          className="w-9 h-9 bg-green-100 p-1 rounded-md"
        />

        <h1 className="text-xl font-bold text-green-500">
          LoanAI
        </h1>
      </div>

      {/* 🔥 NEW CONTENT */}
      <p className="mt-4 text-sm text-gray-400 leading-relaxed">
        LoanAI is an intelligent platform that helps you predict loan approval 
        instantly using machine learning models. Make smarter financial decisions 
        with real-time insights.
      </p>

      {/* 🔥 TAGLINE */}
      <p className="mt-3 text-green-400 text-sm font-medium">
        Smarter Loans. Better Decisions.
      </p>

    </div>

    {/* 🔹 Contact */}
    <div>
      <h3 className="text-white font-semibold mb-3">Contact Us</h3>
      <p className="text-sm text-gray-400">📧 info@loanai.com</p>
      <p className="text-sm text-gray-400 mt-1">📍 India</p>
    </div>

    {/* 🔹 Links */}
    <div>
      <h3 className="text-white font-semibold mb-3">Quick Links</h3>

      <div className="flex flex-col gap-2 text-sm">
        <a href="/" className="hover:text-green-400 transition">
          Home
        </a>
        <a href="/loan-details" className="hover:text-green-400 transition">
          Predict
        </a>
        <a href="/dashboard" className="hover:text-green-400 transition">
          Dashboard
        </a>
      </div>
    </div>

  </div>

  {/* 🔻 Bottom line */}
  <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
    © 2026 LoanAI. All rights reserved.
  </div>

</footer>
  )
}