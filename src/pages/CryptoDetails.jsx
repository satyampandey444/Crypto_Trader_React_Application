import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../components/Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CryptoDetails() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        setLoading(true);
        const coinRes = await fetch(`https://api.coinranking.com/v2/coin/${id}`);
        const coinData = await coinRes.json();
        setCoin(coinData?.data?.coin);

        const historyRes = await fetch(
          `https://api.coinranking.com/v2/coin/${id}/history?timePeriod=7d`
        );
        const historyData = await historyRes.json();
        setHistory(historyData?.data?.history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [id]);

  if (loading) return <Loader />;

  if (!coin) return <p className="text-red-500">Coin not found</p>;

  const chartData = {
    labels: history.map((h) =>
      new Date(h.timestamp * 1000).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${coin.name} Price (USD)`,
        data: history.map((h) => h.price),
        borderColor: "rgb(147, 51, 234)", // purple
        backgroundColor: "rgba(147, 51, 234, 0.3)",
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">🔍 {coin.name} Details</h1>
      <p className="text-gray-400">Price: ${parseFloat(coin.price).toFixed(2)}</p>
      <p className="text-gray-400">Market Cap: ${coin.marketCap}</p>
      <p className="text-gray-400">Volume: ${coin["24hVolume"]}</p>

      {/* Chart */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow">
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default CryptoDetails;
