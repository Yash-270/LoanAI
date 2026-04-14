"use client";
import { useEffect, useState } from "react"
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Loan(){
    const route=useRouter();
    const[error,setError]=useState<any>(null);
    useEffect(() => {

        const isLoggedIn = localStorage.getItem("loggedIn");

        if (!isLoggedIn) {
        route.push("/login");
        }
    }, []);
    const[form,setForm]=useState<any>({
        income: "",
        amount: "",
        hist:""
    });
    const[result,setResult]=useState<any>(""); 
    const[showModal,setShowModal]=useState(false); 
    const[loading,setLoading]=useState(false);
    const handleChange=(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
        setForm({...form, [e.target.name]: e.target.value})
    }
   
    const handleAdd=async()=>{
        try{
            if(!form.income || !form.amount || form.hist===""){
                setError("Please fill all fields");
                return;
            }
            if(isNaN(form.income) || isNaN(form.amount) || isNaN(form.hist)){
                setError("Please enter valid numbers");
                return;
            }
            setLoading(true);
            const res=await axios.post("http://localhost:8000/predict", {
                income: Number(form.income),
                loan_amount: Number(form.amount),
                credit_history: Number(form.hist),
            });
            console.log(res);
            
            setShowModal(true);
            setResult(res.data.prediction);
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            const old = JSON.parse(
                localStorage.getItem(user.email || "data") || "[]"
            );

            const newEntry = {
            income: form.income,
            amount: form.amount,
            status: res.data.prediction,
            time: new Date().toLocaleString(),
            };

            old.push(newEntry);

            // 🔥 SAVE
            localStorage.setItem(user.email || "data", JSON.stringify(old));

        }
        catch(err: any){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl text-gray-800 font-bold text-center mb-4">Loan Approval Predictor 💰</h2>
                <div className="flex flex-col gap-4">
                    <input className="border p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400" name="income" placeholder="Income" value={form.income} onChange={(e)=>handleChange(e)}></input>
                    <input className="border p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400" name="amount" placeholder="Loan amount" value={form.amount} onChange={(e)=>handleChange(e)}></input>
                            <select className="border p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400" name="hist" value={form.hist} onChange={(e)=>handleChange(e)}>
                                <option value="" >Select Credit History</option>
                                <option value="1">Good (No defaults)</option>
                                <option value="0">Bad / No History</option>
                            </select>
                    <button disabled={loading} className="text-semibold px-4 py-2 bg-green-500 text-white rounded hover:bg-green-800" onClick={handleAdd}>
                        {loading ? "Predicting..." : "Predict"}
                    </button>
                    <p className="text-red-500 text-sm text-center">{error}</p>
                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center border-gray-400 bg-white bg-opacity-40 z-50">
                            
                            {/* Modal Box */}
                            <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center relative animate-fadeIn">

                            {/* ❌ Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                            >
                                ✖
                            </button>

                            {/* Result */}
                            <h2 className="text-2xl text-gray-800 font-bold mb-4">
                                {result === 1 ? "✅ Loan Approved" : "❌ Loan Rejected"}
                            </h2>

                            {/* Action Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                OK
                            </button>

                            </div>
                        </div>
                        )}
                </div>
            </div>
        </div>
    )
}