import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Search from "./components/Search";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(query) {
    setSearchQuery(query);

    // Wait for the search section to render
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
    <div>
      {/* Navbar */}
      <div className="absolute left-0 top-0 z-20 w-full">
        <Navbar onSearch={handleSearch} />
      </div>

      {/* Hero */}
      <Hero />

      {/* Search Results */}
      {searchQuery && (
        <div id="search-results">
          <Search query={searchQuery} />
        </div>
      )}
    </div>
  );
}

export default App;