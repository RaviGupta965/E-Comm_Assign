"use client";
import { useEffect, useState } from "react";
import { products } from "../lib/Product";
import { convertFromUSD } from "../lib/Currency_converter";

export default function ProductPage() {
  const [currency, setCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [tariffs, setTariffs] = useState({});
  const [allowedProducts, setAllowedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    setCurrency(user.currency);

    (async () => {
      try {
        const rate = await convertFromUSD(1, user.currency);
        setExchangeRate(rate);

        const bannedRes = await fetch(`/api/banned?destination=${user.country}`);
        const { banned } = await bannedRes.json();

        const filtered = products.filter(
          (product) => !banned.includes(product.originCountry)
        );
        setAllowedProducts(filtered);

        const tariffMap = {};
        await Promise.all(
          filtered.map(async (product) => {
            try {
              const res = await fetch("/api/customs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  destination: user.country,
                  productName: product.name,
                  originCountry: product.originCountry,
                }),
              });
              const data = await res.json();
              tariffMap[product.id] = data.customsDuty || "N/A";
            } catch (e) {
              tariffMap[product.id] = "N/A";
            }
          })
        );
        setTariffs(tariffMap);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🌍 Available Products for You
      </h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <p className="text-lg text-blue-500 animate-pulse">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allowedProducts.map((product) => {
            const convertedPrice = (product.basePriceUSD * exchangeRate).toFixed(2);
            return (
              <div
                key={product.id}
                className="border border-gray-200 rounded-2xl shadow-lg p-5 bg-white hover:shadow-xl transition duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{product.name}</h2>
                <p className="text-gray-500 mb-1">🌐 Origin: {product.originCountry}</p>
                <p className="text-gray-700 mb-1">
                  💵 Price ({currency}):{" "}
                  <span className="font-medium text-green-600">{convertedPrice}</span>
                </p>
                <p className="text-gray-700">
                  🧾 Customs Duty:{" "}
                  <span className="font-semibold text-orange-600">
                    {tariffs[product.id] || "..."}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
