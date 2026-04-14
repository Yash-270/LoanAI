"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const[user,setUser]=useState<any>(null);
  useEffect(()=>{
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("loggedIn");

    if (storedUser && isLoggedIn) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout=()=>{
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-400 px-8 py-3 flex items-center justify-between">
      
      <div 
        onClick={() => router.push("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        {/* <div className="w-8 h-8 bg-green-500 rounded-full"></div> */}
        <div>
          <img src="https://cdn-icons-png.flaticon.com/512/2331/2331941.png"
            alt="Logo"
            className="w-8 h-8"
          />
        </div>
        <h1 className="text-xl font-bold text-green-600">
          LoanAI
        </h1>
      </div>

      {/* 🔹 Links */}
      <div className="flex items-center gap-6">
        
        <Link 
          href="/" 
          className="text-gray-600 hover:text-green-600 transition "
        >
          Home
        </Link>

        
        
        {!user ? (
          <>
          <Link 
          href="/loan-details" 
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Predict
        </Link>
        <div className="flex gap-2">
        <Link
          href="/login"
          className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Signup
        </Link>
        </div>
        </>
        ):
        (
          <>
            <span className="text-gray-600 hover:text-green-600 transition">
              Hi, {user.name} 👋
            </span>

            <Link
              href="/dashboard"
              className="bg-orange-400 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Dashboard
            </Link>
            <Link 
          href="/loan-details" 
          className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Predict
        </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )
        }

      </div>

    </nav>
  );
}