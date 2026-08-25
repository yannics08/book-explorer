import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";
import { getTrendingBooks } from "../services/openLibrary";

function Explore() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const results = await getTrendingBooks();
        setBooks(results);
      } catch (error) {
        console.error(error);
        setError("Unable to load trending books.");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <>
      <section
        id="explore"
        className="relative z-10 -mt-16 px-6 pb-16 font-serif"
      >
        {/* Parchment Container with Antique Brass Border */}
        <div className="mx-auto max-w-7xl rounded-2xl border border-[#c59b27]/30 bg-[#f4f1ea] px-8 py-10 shadow-2xl">

          {/* Heading */}
          <div className="mb-8 border-b border-[#e2dcce] pb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8c6d1f]">
              Curated Collection
            </span>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#1c1917]">
              Trending Now
            </h2>

            <p className="mt-1 text-[#57534e] italic">
              Discover manuscripts and literature captivating scholars today.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e2dcce] border-t-[#8c6d1f]" />

              <p className="mt-4 text-[#57534e] italic text-sm">
                Unshelving trending manuscripts...
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

          {/* Books Grid */}
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

          {/* No books */}
          {!loading && !error && books.length === 0 && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-[#78716c] italic">
                No trending manuscripts found in the archives.
              </p>
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

export default Explore;