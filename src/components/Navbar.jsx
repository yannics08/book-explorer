import { useState } from "react";
import { BookMarked, Search as SearchIcon } from "lucide-react";

function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");

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
    <nav className="flex items-center justify-between bg-transparent px-8 py-4 text-white">
      {/* Logo - Click reloads page */}
      <div 
        onClick={handleLogoClick}
        className="flex cursor-pointer items-center gap-2 text-xl font-semibold transition-opacity hover:opacity-80"
      >
        <BookMarked size={24} />
        <span>Book Explorer</span>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSubmit}
        className="flex w-[450px] items-center gap-3 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 shadow-lg backdrop-blur-md"
      >
        <SearchIcon size={20} />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books, authors, editions..."
          className="w-full bg-transparent outline-none placeholder:text-white/70"
        />
      </form>
    </nav>
  );
}

export default Navbar;