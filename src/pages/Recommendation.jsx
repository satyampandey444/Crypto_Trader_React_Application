import React, { useState, useEffect } from "react";

// Load API Key from .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function Recommendations() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch top 1250 coins (5 pages × 250 per page)
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const cached = localStorage.getItem("crypto_coins_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = Date.now();
          if (now - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setCoins(parsed.data);
            console.log("✅ Loaded coins from cache");
            return;
          }
        }

        let allCoins = [];
        for (let page = 1; page <= 5; page++) {
          const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}`
          );
          const data = await res.json();
          allCoins = [...allCoins, ...data];
        }

        localStorage.setItem(
          "crypto_coins_cache",
          JSON.stringify({ data: allCoins, timestamp: Date.now() })
        );

        setCoins(allCoins);
        console.log(`✅ Fetched ${allCoins.length} coins`);
      } catch (err) {
        console.error("Error fetching coins:", err);
      }
    };

    fetchCoins();
  }, []);

  // ✅ Analyze selected coin
  const handleAnalyze = async () => {
    if (!selectedCoin) {
      alert("Please select a coin first!");
      return;
    }
    setLoading(true);
    setRecommendation("");

    try {
      const chartRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}/market_chart?vs_currency=usd&days=7`
      );
      const chartData = await chartRes.json();

      const prices = chartData.prices.map((p) => p[1]);
      const firstPrice = prices[0];
      const lastPrice = prices[prices.length - 1];
      const trend = lastPrice > firstPrice ? "upward" : "downward";
      const changePercent = (
        ((lastPrice - firstPrice) / firstPrice) *
        100
      ).toFixed(2);

      const prompt = `
You are an expert cryptocurrency analyst and trading advisor. Your goal is to provide a clear, structured, and actionable recommendation for a retail trader. Analyze the following coin:

1. Recommendation: Buy, Sell, or Hold
2. Rationale: Explain why this recommendation makes sense in simple, trader-friendly terms
3. Trend Analysis: Comment on the recent price trend, 7-day price movement, and short-term volatility
4. Risk Assessment: Mention potential risks, market conditions, or news that could impact the coin
5. Actionable Tip: Suggest entry points, exit points, or waiting periods (do not give financial advice)

Coin Details:
- Name: ${selectedCoin.name} (${selectedCoin.symbol.toUpperCase()})
- Current Price: $${selectedCoin.current_price?.toLocaleString() || "N/A"}
- 24h Price Change: ${
        selectedCoin.price_change_percentage_24h?.toFixed(2) || "N/A"
      }%
- Market Cap: $${selectedCoin.market_cap?.toLocaleString() || "N/A"}
- 7-Day Trend: ${trend} (${changePercent}% change)
- 7-Day Price Movement: Started at $${firstPrice.toFixed(
        2
      )}, ended at $${lastPrice.toFixed(2)}
      `;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setRecommendation(data.candidates[0].content.parts[0].text);
      } else {
        console.error("Invalid API response:", data);
        setRecommendation("❌ No recommendation returned. Try again later.");
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      setRecommendation(
        "❌ Could not fetch recommendation. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      <h2 className="text-4xl font-extrabold text-center text-yellow-400 drop-shadow-lg mb-8">
        ⚡ AI Crypto Recommendations
      </h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Coin Selection */}
        <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl p-6">
          <label className="block text-gray-300 mb-2 font-semibold">
            🔎 Search Coin
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Bitcoin, Ethereum, etc..."
            className="w-full p-3 mb-4 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <div className="max-h-[500px] overflow-y-auto border border-gray-700 rounded-lg custom-scroll">
            {filteredCoins.map((coin) => (
              <div
                key={coin.id + coin.symbol}
                onClick={() => {
                  setSelectedCoin(coin);
                  setSearch(coin.name);
                }}
                className={`flex items-center justify-between p-3 cursor-pointer transition-all duration-200 ${
                  selectedCoin?.id === coin.id
                    ? "bg-yellow-400 text-black shadow-md"
                    : "hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium">
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </span>
                </div>
                <span className="font-semibold">
                  ${coin.current_price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation Section */}
        <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl p-6 flex flex-col">
          <button
            onClick={handleAnalyze}
            disabled={loading || !selectedCoin}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 mb-6 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Analyzing...
              </>
            ) : (
              "Get AI Recommendation"
            )}
          </button>

          {recommendation && (
            <div className="mt-2 bg-gray-900/80 border border-gray-700 rounded-lg p-5 shadow-inner overflow-auto">
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">
                📊 Recommendation:
              </h3>
              <pre className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {recommendation}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
