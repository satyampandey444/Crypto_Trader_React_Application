import React, { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
  const [coins, setCoins] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("usd");
  const [symbol, setSymbol] = useState("$");
  const [error, setError] = useState("");

  const currencySymbols = {
    usd: "$",
    inr: "₹",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    aud: "A$",
    cad: "C$",
  };

  // Helper functions for caching
  const getCachedData = (key, expiryMinutes = 10) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { timestamp, data } = JSON.parse(cached);
    const now = new Date().getTime();
    if (now - timestamp < expiryMinutes * 60 * 1000) {
      return data;
    }
    return null;
  };

  const setCachedData = (key, data) => {
    localStorage.setItem(
      key,
      JSON.stringify({ timestamp: new Date().getTime(), data })
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        setSymbol(currencySymbols[currency] || "$");

        // Check cache for coins and global data
        const coinsCacheKey = `topCoins_${currency}`;
        const globalCacheKey = `globalData_${currency}`;
        const cachedCoins = getCachedData(coinsCacheKey);
        const cachedGlobal = getCachedData(globalCacheKey);

        let coinsData = cachedCoins;
        let global = cachedGlobal;

        if (!cachedCoins || !cachedGlobal) {
          // Fetch from API if cache is empty or expired
          const [coinsRes, globalRes] = await Promise.all([
            axios.get(
              `/api/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=6&page=1&sparkline=true`
            ),
            axios.get("/api/global"),
          ]);

          coinsData = coinsRes.data;
          global = globalRes.data.data;

          // Store in cache
          setCachedData(coinsCacheKey, coinsData);
          setCachedData(globalCacheKey, global);
        }

        setCoins(coinsData);
        setGlobalData(global);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [currency]);

  if (loading) {
    return <p className="text-white text-center mt-8 text-lg">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-400 text-center mt-8 text-lg">{error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
        Crypto Market Dashboard
      </h2>

      {/* Currency Selector */}
      <div className="flex justify-center mb-6">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-gray-900 text-white p-2 rounded-lg border border-gray-700"
        >
          {Object.entries(currencySymbols).map(([key, value]) => (
            <option key={key} value={key}>
              {key.toUpperCase()} ({value})
            </option>
          ))}
        </select>
      </div>

      {/* Global Stats */}
      {globalData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-900 p-4 rounded-2xl shadow-lg text-center">
            <p className="text-gray-400 text-sm">Total Market Cap</p>
            <p className="text-yellow-400 font-bold">
              {symbol}{globalData.total_market_cap[currency].toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-2xl shadow-lg text-center">
            <p className="text-gray-400 text-sm">24h Volume</p>
            <p className="text-yellow-400 font-bold">
              {symbol}{globalData.total_volume[currency].toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-2xl shadow-lg text-center">
            <p className="text-gray-400 text-sm">BTC Dominance</p>
            <p className="text-yellow-400 font-bold">
              {globalData.market_cap_percentage.btc.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-2xl shadow-lg text-center">
            <p className="text-gray-400 text-sm">ETH Dominance</p>
            <p className="text-yellow-400 font-bold">
              {globalData.market_cap_percentage.eth.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Top Coins */}
      <h3 className="text-2xl text-white font-semibold mb-4">Top Coins</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="bg-gray-900 border border-gray-700 p-4 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            <div className="flex items-center mb-4">
              <img src={coin.image} alt={coin.name} className="w-10 h-10 mr-3" />
              <h3 className="text-white font-semibold text-lg">{coin.name}</h3>
            </div>
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">Price:</span> {symbol}{coin.current_price.toLocaleString()}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">Market Cap:</span> {symbol}{coin.market_cap.toLocaleString()}
            </p>
            <p
              className={`text-sm font-semibold mt-2 ${
                coin.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {coin.price_change_percentage_24h.toFixed(2)}% (24h)
            </p>
          </div>
        ))}
      </div>

      {/* News Section */}
      <h3 className="text-2xl text-white font-semibold mb-4">Latest Crypto News</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Example static news (replace with API if desired) */}
        <div className="bg-gray-900 p-4 rounded-2xl shadow-lg">
          <h4 className="text-yellow-400 font-bold mb-2">Bitcoin hits $100k?</h4>
          <p className="text-gray-300 text-sm">Analysts predict Bitcoin could reach new highs by the end of 2025.</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-2xl shadow-lg">
          <h4 className="text-yellow-400 font-bold mb-2">Ethereum 2.0 Update</h4>
          <p className="text-gray-300 text-sm">Ethereum network gears up for major scalability improvements.</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-2xl shadow-lg">
          <h4 className="text-yellow-400 font-bold mb-2">Crypto Regulation</h4>
          <p className="text-gray-300 text-sm">Governments worldwide are preparing new frameworks for digital assets.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
