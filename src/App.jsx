import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Explore from "./components/Explore";
import Search from "./components/Search";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll position to toggle button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  function handleSearch(query) {
    setSearchQuery(query);

    setTimeout(() => {
      document
        .getElementById("search-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  return (
    <div className="relative">
      {/* Navbar Container */}
      <div className="absolute left-0 top-0 z-20 w-full">
        <Navbar onSearch={handleSearch} />
      </div>

      {/* Hero */}
      <Hero />

      {/* Explore / Search */}
      {searchQuery ? (
        <Search query={searchQuery} />
      ) : (
        <Explore />
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#c59b27]/40 bg-[#1c1917]/90 text-[#c59b27] shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-[#c59b27] hover:bg-[#c59b27] hover:text-[#1c1917] hover:scale-110 active:scale-95 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default App;