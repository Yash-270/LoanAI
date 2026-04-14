"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashBoard() {
  const route = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [tog, setTog] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");

    if (!isLoggedIn) {
      route.push("/login");
    } else {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      const d = JSON.parse(localStorage.getItem(u.email || "data") || "[]");

      setUser(u);
      setData(d);
    }
  }, []);

  const total = data.length;
  const approved = data.filter((d) => d.status === 1).length;
  const rejected = data.filter((d) => d.status === 0).length;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 SIDEBAR */}
      <div className={`${tog ? "w-49" : "w-20"} bg-gray-900 text-white p-5 transition-all duration-300`}>

        {/* <h2 className="text-xl font-bold text-green-400 mb-6">
          {tog ? "LoanAI" : "L"}
        </h2> */}

        <button
          onClick={() => setTog(!tog)}
          className="mb-6 text-sm bg-gray-700 px-3 py-1 rounded"
        >
          {tog ? "Collapse" : "→"}
        </button>

        <ul className="space-y-5">

          <li className="flex items-center gap-3 hover:text-green-400 cursor-pointer">
            🏠 {tog && "Dashboard"}
          </li>

          <li className="flex items-center gap-3 hover:text-green-400 cursor-pointer">
            📊 {tog && "Predictions"}
          </li>

          <li className="flex items-center gap-3 hover:text-green-400 cursor-pointer">
            <Link href="/loan-details" className="flex items-center gap-3">
              ➕ {tog && "New Prediction"}
            </Link>
          </li>

        </ul>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Welcome {user?.name} 👋
        </h1>

        <p className="text-gray-600 mt-2">
          View your loan prediction analytics here.
        </p>

        {/* 🔥 STATS */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600">Total Predictions</p>
            <h2 className="text-2xl font-bold text-black">{total}</h2>
          </div>

          <div className="bg-green-100 p-6 rounded-xl shadow">
            <p className="text-green-700">Approved</p>
            <h2 className="text-2xl font-bold text-green-700">
              {approved}
            </h2>
          </div>

          <div className="bg-red-100 p-6 rounded-xl shadow">
            <p className="text-red-700">Rejected</p>
            <h2 className="text-2xl font-bold text-red-700">
              {rejected}
            </h2>
          </div>

        </div>
        <div className="bg-white p-4 text-gray-800 rounded shadow mt-6">
            <h2 className="font-bold mb-2">Feature Importance</h2>
            <p>Credit History → High Impact</p>
            <p>Income → Medium Impact</p>
            <p>Loan Amount → Medium Impact</p>
        </div>

        <div className="bg-white p-4 text-gray-800 rounded shadow mt-6">
            <h2 className="font-bold text-lg mb-2">Model Info</h2>
            <p>Model: Random Forest</p>
            <p>Accuracy: 82%</p>
        </div>

        {/* 🔥 TABLE */}
        <div className="bg-white p-6 rounded-xl shadow mt-8">

          <h2 className="font-bold mb-4 text-gray-800">
            Recent Predictions
          </h2>

          <table className="w-full text-left">

            <thead>
              <tr className="border-b text-gray-700">
                <th className="py-2">Income</th>
                <th>Loan Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody  className="py-2 text-gray-700">
              {data.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">

                  <td className="py-2 text-gray-700">{item.income}</td>
                  <td  className="py-2 text-gray-700">{item.amount}</td>

                  <td>
                    {item.status === 1 ? (
                      <span className="text-green-600 font-semibold">
                        ✅ Approved
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        ❌ Rejected
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}