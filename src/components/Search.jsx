import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";
import { searchBooks } from "../services/openLibrary";

function Search({ query }) {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setBooks([]);
      return;
    }

    async function getBooks() {
      setLoading(true);
      setError("");
      setSelectedBook(null);

      try {
        const results = await searchBooks(query);
        setBooks(results);
      } catch (error) {
        console.error(error);
        setError("Unable to search for manuscripts.");
      } finally {
        setLoading(false);
      }
    }

    getBooks();
  }, [query]);

  return (
    <>
      {/* Search Section */}
      <section
        id="search-results"
        className="relative z-10 -mt-16 px-6 pb-16 font-serif"
      >
        {/* Parchment Container with Antique Brass Border */}
        <div className="mx-auto max-w-7xl rounded-2xl border border-[#c59b27]/30 bg-[#f4f1ea] px-8 py-10 shadow-2xl">
          
          {/* Heading */}
          <div className="mb-8 border-b border-[#e2dcce] pb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8c6d1f]">
              Archive Search
            </span>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1c1917]">
              Search Results
            </h1>

            <p className="mt-1 text-[#57534e] italic">
              Displaying catalog entries for "{query}"
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e2dcce] border-t-[#8c6d1f]" />

              <p className="mt-4 text-[#57534e] italic text-sm">
                Searching the archives...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-red-700 italic">
                {error}
              </p>
            </div>
          )}

          {/* No Results */}
          {!loading &&
            !error &&
            books.length === 0 && (
              <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-[#78716c] italic">
                  No manuscripts found matching "{query}".
                </p>
              </div>
            )}

          {/* Books */}
          {!loading && !error && books.length > 0 && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
              {books.map((book) => (
                <BookCard
                  key={book.key}
                  book={book}
                  onSelect={setSelectedBook}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetails
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
}

export default Search;