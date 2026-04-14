"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/dist/client/link";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[loading,setLoading]=useState(false);
  // 🔥 separate error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");

  const handleSignup = () => {
    let valid = true;
    setLoading(true);
    // reset errors
    setNameError("");
    setEmailError("");
    setPassError("");

    if (name.length === 0) {
      setNameError("Name is required");
      valid = false;
    }

    if (email.length === 0) {
      setEmailError("Email is required");
      valid = false;
    } else if (!email.includes("@")) {
      setEmailError("Invalid email");
      valid = false;
    }

    if (password.length < 6) {
      setPassError("Password must be at least 6 characters");
      valid = false;
    }

    if (!valid) return;

    // save user
    localStorage.setItem(
      "user",
      JSON.stringify({ name, email, password })
    );
    setLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h2 className="text-2xl text-gray-800 font-bold text-center mb-4">Signup</h2>

         <div className="flex flex-col gap-4">
        <input
          placeholder="Name"
          className="border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-red-500 text-sm">{nameError}</p>

        
        <input
          placeholder="Email"
          className="border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-red-500 text-sm">{emailError}</p>

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-red-500 text-sm">{passError}</p>

        <button
            disabled={loading}
          onClick={handleSignup}
          className="bg-blue-500 text-white w-full py-2 mt-3 rounded-lg hover:bg-blue-700 transition"
        >
          Signup
        </button>
        <p className="text-center text-gray-500 ">
            Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
        </div>
      </div>
    </div>
  );
}