import React, { useEffect, useState } from "react";
import axios from "axios";

function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null); // store next page token
  const [error, setError] = useState(null);

  const fetchNews = async (page = null) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("https://newsdata.io/api/1/news", {
        params: {
          apikey: import.meta.env.VITE_NEWS_API_KEY,
          q: "cryptocurrency OR bitcoin OR ethereum",
          language: "en",
          country: "us",
          page: page || undefined, // use nextPage if available
        },
      });

      if (res.data?.results) {
        setNews((prev) => [...prev, ...res.data.results]); // append news
      }

      setNextPage(res.data.nextPage || null); // store nextPage token
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
        Latest Crypto News
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 border border-gray-700 p-4 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 hover:scale-105 flex flex-col h-full"
          >
            {article.image_url ? (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-48 object-cover rounded-xl mb-4 shadow-md"
              />
            ) : (
              <div className="w-full h-48 bg-gray-800 rounded-xl mb-4 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-300 text-sm flex-1 mb-3 line-clamp-3">
              {article.description}
            </p>

            <div className="flex justify-between items-center mt-auto">
              <span className="text-gray-400 text-xs">
                {new Date(article.pubDate).toLocaleDateString()}
              </span>
              <span className="text-yellow-400 text-xs font-semibold px-2 py-1 bg-gray-800 rounded-full">
                {article.source_id}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        {nextPage && (
          <button
            onClick={() => fetchNews(nextPage)}
            disabled={loading}
            className="bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
}

export default NewsPage;
