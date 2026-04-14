"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login(){
    const route=useRouter();
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState("");
    const [emailError, setEmailError] = useState("");
    const [passError, setPassError] = useState("");
    const handleLogin=()=>{
           let valid = true;
            setLoading(true);
            // reset errors
            setEmailError("");
            setPassError("");


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
            
            const info=JSON.parse(localStorage.getItem("user") || "{}");
            if(info.email===email && info.password===password){
                localStorage.setItem("loggedIn", "true");
                window.location.href = "/dashboard";
            }
            else{
                setError("Invalid credentials");
                valid=false;
            }
            if(!valid) return;    
        };

    return(
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl text-gray-800 font-bold text-center mb-4">Login</h2>
                <div className="flex flex-col gap-4">
                    <input className="border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                     <p className="text-red-500 text-sm">{emailError}</p>
                    <input className="border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" name="password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <p className="text-red-500 text-sm">{passError}</p>
                    <button disabled={loading} onClick={handleLogin} className="text-semibold px-4 py-2 bg-green-500 text-white rounded hover:bg-green-800">Login</button>
                    <p className="text-red-500 text-sm">{error}</p>
                    <p className="text-center text-gray-500">
                        Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Signup</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}