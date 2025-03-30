import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [filteredNewsletters, setFilteredNewsletters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      console.log("✅ API response:", data);

      if (data?.recommendations?.length > 0) {
        setFilteredNewsletters(data.recommendations);
      } else {
        setFilteredNewsletters([]);
        setError("No newsletters found.");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/ghibli-bg.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Quicksand', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.8rem", fontWeight: "700", color: "#1f2937", marginBottom: "1.5rem" }}>
        AI Newsletter Finder
      </h1>

      <input
        type="text"
        placeholder="Find the best newsletters..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "12px",
          fontSize: "1rem",
          width: "320px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          marginBottom: "12px",
          outline: "none",
        }}
      />

      <button
        onClick={fetchRecommendations}
        disabled={loading}
        style={{
          padding: "10px 24px",
          backgroundColor: "#4f9a94",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        {loading ? "Searching..." : "Find Newsletters"}
      </button>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem", fontWeight: "500" }}>
          {error}
        </p>
      )}

      {filteredNewsletters.length > 0 &&
        filteredNewsletters.map((n, index) => (
          <div
            key={index}
            style={{
              background: "rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              padding: "18px",
              borderRadius: "16px",
              marginTop: "16px",
              width: "340px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              color: "#1f2937",
              transition: "transform 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h2 style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "6px" }}>{n.title}</h2>
            <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>{n.description}</p>
          </div>

        ))}
    </div>
  );
}
