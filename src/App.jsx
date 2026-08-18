import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Explore from "./components/Explore";
import Search from "./components/Search";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

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
    <div>
      {/* Navbar */}
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
    </div>
  );
}

export default App;