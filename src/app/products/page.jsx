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

        const bannedRes = await fetch(
          `/api/banned?destination=${user.country}`
        );
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Products</h1>
      {loading && <p>Loading products...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allowedProducts.map((product) => {
          const convertedPrice = (product.basePriceUSD * exchangeRate).toFixed(
            2
          );
          return (
            <div
              key={product.id}
              className="border p-4 rounded shadow bg-white"
            >
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p>Origin: {product.originCountry}</p>
              <p>
                Price in {currency}: {convertedPrice}
              </p>
              <p className="text-orange-600">
                Customs Duty: {tariffs[product.id] || "..."}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
