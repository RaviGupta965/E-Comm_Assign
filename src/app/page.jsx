"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!name || !country || !currency) return alert("All fields required");
    localStorage.setItem("user", JSON.stringify({ name, country, currency }));
    router.push("/products");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100">
      <div className="bg-white text-black shadow-xl p-8 rounded-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Welcome to GlobexMart</h2>
        
        <label className="block mb-2 font-semibold">Name</label>
        <input
          className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mb-2 font-semibold">Country of Residence</label>
        <input
          className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="E.g., India"
          onChange={(e) => setCountry(e.target.value)}
        />

        <label className="block mb-2 font-semibold">Preferred Currency</label>
        <select
          className="border border-gray-300 p-3 rounded w-full mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setCurrency(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select Currency</option>
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="INR">INR - Indian Rupee</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="AUD">AUD - Australian Dollar</option>
          <option value="CAD">CAD - Canadian Dollar</option>
          <option value="CNY">CNY - Chinese Yuan</option>
          <option value="SGD">SGD - Singapore Dollar</option>
          <option value="KRW">KRW - South Korean Won</option>
        </select>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full py-3 rounded transition duration-200"
          onClick={handleLogin}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
