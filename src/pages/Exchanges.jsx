import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  CandlestickController,
  CandlestickElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

Modal.setAppElement("#root");

const timeRanges = [
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
  { label: "1Y", value: 365 },
];

function ExchangesPage() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("usd");
  const [symbol, setSymbol] = useState("$");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState(30);

  const currencySymbols = {
    usd: "$",
    inr: "₹",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    aud: "A$",
    cad: "C$",
  };

  const getCachedData = (key, expiryMinutes = 10) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { timestamp, data } = JSON.parse(cached);
    if (new Date().getTime() - timestamp < expiryMinutes * 60 * 1000) return data;
    return null;
  };

  const setCachedData = (key, data) => {
    localStorage.setItem(
      key,
      JSON.stringify({ timestamp: new Date().getTime(), data })
    );
  };

  // Fetch all coins
  useEffect(() => {
    setSymbol(currencySymbols[currency] || "$");
    setLoading(true);
    setError(null);

    const fetchCoins = async () => {
      try {
        const cachedCoins = getCachedData(`coins_${currency}`);
        let coinsData = cachedCoins || [];

        if (!cachedCoins) {
          const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
            params: {
              vs_currency: currency,
              order: "market_cap_desc",
              per_page: 250,
              page: 1,
              sparkline: true,
            },
          });
          coinsData = res.data || [];
          setCachedData(`coins_${currency}`, coinsData);
        }

        setCoins(coinsData);
        setFilteredCoins(coinsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load coin data or API rate limit reached.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [currency]);

  // Search filter
  useEffect(() => {
    if (!searchTerm) setFilteredCoins(coins);
    else {
      const term = searchTerm.toLowerCase();
      setFilteredCoins(
        coins.filter(
          (coin) =>
            coin.name.toLowerCase().includes(term) ||
            coin.symbol.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, coins]);

  // Fetch candlestick chart data
  const fetchChart = async (coin, days) => {
    setChartLoading(true);
    try {
      const cacheKey = `chart_${coin.id}_${currency}_${days}`;
      const cachedChart = getCachedData(cacheKey);
      if (cachedChart) {
        setChartData(cachedChart);
      } else {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coin.id}/ohlc`,
          { params: { vs_currency: currency, days: days } }
        );
        const ohlc = res.data.map(([timestamp, open, high, low, close]) => ({
          x: timestamp,
          o: open,
          h: high,
          l: low,
          c: close,
        }));
        setChartData(ohlc);
        setCachedData(cacheKey, ohlc);
      }
    } catch (err) {
      console.error("Chart fetch failed:", err);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
    setModalIsOpen(true);
    setSelectedRange(30);
    fetchChart(coin, 30);
  };

  const handleRangeChange = (days) => {
    setSelectedRange(days);
    if (selectedCoin) fetchChart(selectedCoin, days);
  };

  if (loading) return <p className="text-white text-center mt-8 text-lg">Loading data...</p>;
  if (error) return <p className="text-red-400 text-center mt-8 text-lg">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
        Crypto Exchanges & Market Overview
      </h2>

      {/* Currency Selector & Search */}
      <div className="flex justify-center mb-6 gap-4 flex-wrap">
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

        <input
          type="text"
          placeholder="Search coins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-700 text-white p-3 rounded-2xl border border-gray-700"
        />
      </div>

      {/* Coins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoins.map((coin) => (
          <div
            key={coin.id}
            className="bg-gray-900 border border-gray-700 p-4 rounded-2xl shadow-lg flex flex-col hover:scale-105 transition cursor-pointer"
            onClick={() => handleCoinClick(coin)}
          >
            <div className="flex items-center mb-3">
              <img src={coin.image} alt={coin.name} className="w-10 h-10 mr-3" />
              <div className="flex flex-col">
                <h3 className="text-white font-semibold">{coin.name}</h3>
                <span className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</span>
              </div>
            </div>

            {/* Price */}
            <p className="text-gray-300 text-sm mb-2">
              Price:{" "}
              {coin.current_price !== null && coin.current_price !== undefined
                ? `${symbol}${coin.current_price.toLocaleString()}`
                : "N/A"}
            </p>

            {/* Market Cap */}
            <p className="text-gray-400 text-xs mb-1">
              Market Cap:{" "}
              {coin.market_cap
                ? `${symbol}${coin.market_cap.toLocaleString()}`
                : "N/A"}
            </p>

            {/* 24h Volume */}
            <p className="text-gray-400 text-xs mb-1">
              Volume (24h):{" "}
              {coin.total_volume
                ? `${symbol}${coin.total_volume.toLocaleString()}`
                : "N/A"}
            </p>

            {/* Circulating Supply */}
            <p className="text-gray-400 text-xs mb-1">
              Circulating Supply:{" "}
              {coin.circulating_supply
                ? `${coin.circulating_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`
                : "N/A"}
            </p>

            {/* 24h Change */}
            <span
              className={`mt-2 text-sm font-bold ${
                coin.price_change_percentage_24h >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}{" "}
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Modal Chart */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Coin Chart"
        className="bg-gray-900 p-6 rounded-2xl max-w-[95vw] w-[95vw] max-h-[90vh] mx-auto mt-5 shadow-lg outline-none overflow-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      >
        <button
          onClick={() => setModalIsOpen(false)}
          className="text-white mb-4 px-3 py-1 bg-red-600 rounded hover:bg-red-700"
        >
          Close
        </button>

        {selectedCoin && (
          <>
            <h3 className="text-3xl text-yellow-400 font-bold mb-6 text-center">
              {selectedCoin.name} Candlestick Chart ({selectedRange} Days)
            </h3>

            <div className="flex gap-3 justify-center mb-6 flex-wrap">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  className={`px-4 py-2 rounded border ${
                    selectedRange === range.value
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-gray-800 text-white border-gray-600"
                  } hover:bg-yellow-500 transition`}
                  onClick={() => handleRangeChange(range.value)}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {chartLoading ? (
              <p className="text-white text-center text-lg">Loading chart...</p>
            ) : chartData.length ? (
              <Chart
                type="candlestick"
                data={{
                  datasets: [
                    {
                      label: `${selectedCoin.name} (${currency.toUpperCase()})`,
                      data: chartData,
                      borderColor: "#FFD700",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    x: {
                      type: "time",
                      time: { unit: "day" },
                      ticks: { color: "#fff" },
                      grid: { color: "#333" },
                    },
                    y: {
                      ticks: { color: "#fff" },
                      grid: { color: "#333" },
                    },
                  },
                }}
                className="h-[65vh] w-full"
              />
            ) : (
              <p className="text-white text-center text-lg">
                No chart data available.
              </p>
            )}

            {selectedCoin.current_price && (
              <p className="mt-6 text-white text-center text-xl">
                Current Price:{" "}
                <span className="font-bold">
                  {symbol}
                  {selectedCoin.current_price.toLocaleString()}
                </span>
              </p>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}

export default ExchangesPage;
