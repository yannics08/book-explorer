import { useState, useEffect } from "react";
import { BookMarked, Search as SearchIcon } from "lucide-react";

function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    onSearch(trimmedQuery);
  }

  // Handle logo click to refresh/reload page
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 text-white transition-all duration-300 border-b ${
        isScrolled
          ? "bg-[#0f0e0c]/70 backdrop-blur-md border-[#c59b27]/20 shadow-lg"
          : "bg-transparent border-transparent"
      }`}
    >
      {/* Logo with Dark Academia Serif Accent - Click reloads page */}
      <div 
        onClick={handleLogoClick}
        className="flex cursor-pointer items-center gap-2 text-xl font-semibold transition-opacity hover:opacity-80 group"
      >
        <BookMarked size={24} className="text-[#c59b27] group-hover:scale-105 transition-transform" />
        <span className="font-serif tracking-wide">
          Book <span className="text-[#c59b27] italic">Explorer</span>
        </span>
      </div>

      {/* Search Input - Original Sans Font Preserved */}
      <form
        onSubmit={handleSubmit}
        className="flex w-[450px] items-center gap-3 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 shadow-lg backdrop-blur-md transition-colors focus-within:border-[#c59b27]/80"
      >
        <SearchIcon size={20} className="text-[#c59b27]" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for manuscripts, authors, editions..."
          className="w-full bg-transparent outline-none placeholder:text-white/70"
        />
      </form>
    </nav>
  );
}

export default Navbar;