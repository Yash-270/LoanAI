"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-white overflow-hidden">

      <section className="relative min-h-screen flex items-center px-6 bg-gradient-to-br from-white via-green-50 to-white">

  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

    {/* LEFT CONTENT */}
    <div>
       <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
      <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 leading-tight tracking-tight">
        AI-Based Loan Approval <br />
        <span className="text-green-600">Made Simple</span>
      </h1>

      <p className="mt-6 text-lg text-gray-600 max-w-xl">
        Analyze your financial profile and get instant insights on loan approval using advanced machine learning.
      </p>

      <div className="mt-8 flex gap-4">
        <button className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg shadow-lg hover:bg-green-700 transition">
          <Link href="/loan-details">Get Started</Link>
        </button>

        <button className="border border-gray-300 px-8 py-3 rounded-xl text-lg text-gray-700 hover:bg-gray-100 transition">
          <Link href="/dashboard">Dashboard</Link>
        </button>
      </div>
      </motion.div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="relative">
      <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
      <img
        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
        alt="finance"
        className="rounded-2xl shadow-2xl object-cover h-[450px] w-full"
      />

      {/* glass card */}
      <div className="absolute bottom-5 left-5 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg">
        <p className="text-sm text-gray-500">Prediction</p>
        <p className="text-lg font-semibold text-green-600">
          Approved ✔
        </p>
      </div>
      </motion.div>
    </div>

  </div>
</section>
      {/* 🔥 FEATURES */}
      <section className="py-20 bg-white">

  <div className="max-w-6xl mx-auto px-6">

    <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
      Built for Smart Financial Decisions
    </h2>

    <div className="grid md:grid-cols-3 gap-8">

      {[
        {
          title: "Fast Prediction",
          desc: "Instant loan approval insights using ML models.",
        },
        {
          title: "Data Driven",
          desc: "Accurate predictions based on real datasets.",
        },
        {
          title: "Secure",
          desc: "Your financial data stays completely private.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="p-6 rounded-xl border border-gray-200 hover:shadow-xl transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            {item.title}
          </h3>
          <p className="text-gray-600">{item.desc}</p>
        </div>
      ))}

    </div>
  </div>
</section>

      {/* 🔥 BIG BANNER */}
     <section className="py-20 bg-gradient-to-r from-green-600 to-green-500 text-white text-center">

        <motion.div
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
           <h2 className="text-4xl font-semibold mb-4">
    Check Your Loan Eligibility Today
  </h2>

  <p className="mb-6 text-lg text-green-100">
    Get instant results powered by AI
  </p>

  <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
    <Link href="/loan-details">Start Prediction</Link>
  </button>
        </motion.div>

      </section>

    </div>
  );
}