"use client";
import { useEffect, useState } from "react";
import { products } from "../lib/Product";
import { convertFromUSD } from "../lib/Currency_converter";
import { motion, AnimatePresence } from "framer-motion";

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
            } catch {
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
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-100 via-white to-blue-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
      >
        Available Products for You
      </motion.h1>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <motion.p
            className="text-lg text-blue-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Loading products...
          </motion.p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <AnimatePresence>
            {allowedProducts.map((product) => {
              const convertedPrice = (product.basePriceUSD * exchangeRate).toFixed(2);

              return (
                <motion.div
                  key={product.id}
                  className="border border-gray-200 rounded-2xl shadow-md p-5 bg-white hover:shadow-xl transition-transform hover:scale-[1.02]"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">{product.name}</h2>
                  <p className="text-gray-500 mb-1">Origin: {product.originCountry}</p>
                  <p className="text-gray-700 mb-1">
                    Price ({currency}):{" "}
                    <span className="font-medium text-green-600">{convertedPrice}</span>
                  </p>
                  <p className="text-gray-700">
                    Customs Duty:{" "}
                    <span className="font-semibold text-orange-600">
                      {tariffs[product.id] || "..."}
                    </span>
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
