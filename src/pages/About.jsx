import React from "react";

function About() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Website Name */}
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-6">
          Crypto Trader
        </h1>

        {/* Developer Info */}
        <p className="text-center text-lg text-gray-400 mb-10">
          Developed with ❤️ by{" "}
          <span className="font-semibold text-white">Satyam Pandey</span>
        </p>

        {/* About Section */}
        <div className="bg-gray-900 shadow-lg rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            About Crypto Trader
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            <span className="font-semibold text-white">Crypto Trader</span> is a
            modern cryptocurrency dashboard built to empower traders, investors,
            and enthusiasts with accurate market data and visual tools. It
            combines real-time updates, financial analysis, and crypto news in a
            single, easy-to-use platform.
          </p>

          {/* Features Section */}
          <h3 className="text-xl font-semibold text-white mb-3">
            Key Features 🚀
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              📊 <strong>Live Market Data</strong> – Real-time prices, market
              cap, and trading volume for hundreds of cryptocurrencies.
            </li>
            <li>
              💹 <strong>Exchanges Data</strong> – Compare and explore
              top-performing exchanges with liquidity and volume details.
            </li>
            <li>
              🔥 <strong>Trending Coins</strong> – Discover which coins are
              trending worldwide and track their performance.
            </li>
            <li>
              📰 <strong>Crypto News</strong> – Aggregated news from trusted
              sources to keep you updated on market moves and regulations.
            </li>
            <li>
              🕯️ <strong>Interactive Candlestick Charts</strong> – Analyze price
              fluctuations with professional-grade candlestick charting.
            </li>
            <li>
              🔑 <strong>Google Authentication</strong> – Secure login with your
              Google account for a personalized experience.
            </li>
            <li>
              🎨 <strong>Modern UI/UX</strong> – Built with TailwindCSS,
              animations, and responsive layouts for a smooth user experience.
            </li>
          </ul>

          {/* Technologies Section */}
          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            Tech Stack 🛠️
          </h3>
          <p className="text-gray-300 mb-6">
            Crypto Trader is powered by cutting-edge technologies:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>⚛️ <strong>React.js</strong> – Core frontend library.</li>
            <li>
              🎨 <strong>TailwindCSS</strong> – For modern, responsive styling.
            </li>
            <li>
              📈 <strong>Chart.js + Financial Plugin</strong> – To render
              candlestick charts and analytics.
            </li>
            
            <li>
              🌍 <strong>News API + Market APIs</strong> – Fetching live crypto
              data and news feeds.
            </li>
          </ul>

          {/* Future Enhancements */}
          <h3 className="text-xl font-semibold text-white mt-8 mb-3">
            Future Enhancements 🌟
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>📌 Portfolio tracking for users.</li>
            <li>📊 More technical indicators on charts.</li>
            <li>⚡ Alerts & notifications for price movements.</li>
            <li>📱 Mobile app version for Android/iOS.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
