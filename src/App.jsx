import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import CryptoDetails from "./pages/CryptoDetails";
import NewsPage from "./pages/NewsPage";
import Exchanges from "./pages/Exchanges";
import Recommendation from "./pages/Recommendation";
import About from "./pages/About"; // 👈 Import About page

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currency, setCurrency] = useState("usd");

  return (
    <Router>
      <div className="bg-gray-900 min-h-screen text-white">
        {/* Navbar */}
        <Navbar
          onSearch={setSearchTerm}
          currency={currency}
          setCurrency={setCurrency}
        />

        {/* Pages */}
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route
              path="/"
              element={<HomePage searchTerm={searchTerm} currency={currency} />}
            />
            <Route
              path="/crypto/:id"
              element={<CryptoDetails currency={currency} />}
            />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/exchanges" element={<Exchanges />} />
            <Route path="/recommendations" element={<Recommendation />} />
            <Route path="/about" element={<About />} /> {/* 👈 About route */}
          </Routes>
        </div>

        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
