import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [newsletters, setNewsletters] = useState([]);
  const [filteredNewsletters, setFilteredNewsletters] = useState([]); // ✅ FIXED
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load the newsletter data from JSON
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await fetch("/newsletters.json");

        // Check if response is valid
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNewsletters(data);
      } catch (err) {
        console.error("Error loading newsletters:", err);
      }
    };

    fetchNewsletters();
  }, []);

  // Function to get AI recommendations
  const fetchRecommendations = async () => {
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://newsletterfinder.onrender.com/recommend", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations. Try again.");
      }

      const data = await response.json();
      setFilteredNewsletters(data.recommendations); // ✅ FIXED

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{
        backgroundImage: "url('/ghibli-bg.jpg')",
        backgroundAttachment: "fixed",
      }}
    >

      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        AI Newsletter Finder
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Find the best newsletters..."
        className="p-3 border border-gray-400 rounded-lg w-96 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Search Button */}
      <button
        onClick={fetchRecommendations}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Searching..." : "Find Newsletters"}
      </button>

      

    </div>
  );
}
