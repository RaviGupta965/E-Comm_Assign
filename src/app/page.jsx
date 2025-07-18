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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white text-black shadow-md p-6 rounded w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input
          className="border p-2 mb-3 w-full"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 mb-3 w-full"
          placeholder="Country of Residence"
          onChange={(e) => setCountry(e.target.value)}
        />
        <select
          className="border p-2 mb-4 w-full"
          onChange={(e) => setCurrency(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select Preferred Currency
          </option>
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
          className="bg-blue-600 text-white w-full py-2 rounded"
          onClick={handleLogin}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
